import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Groq from 'groq-sdk';
import Task from '../models/Task.js';
import Journal from '../models/Journal.js';
import Habit from '../models/Habit.js';
import { startOfDay, endOfDay, subDays } from 'date-fns';

const router = express.Router();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }
  return new Groq({ apiKey });
};

// Plan my day
router.post('/plan-day', authMiddleware, async (req, res) => {
  try {
    const groq = getGroqClient();
    const today = new Date();

    const [tasks, habits, recentJournal] = await Promise.all([
      Task.find({
        userId: req.userId,
        status: 'pending',
        date: { $gte: startOfDay(today), $lte: endOfDay(today) }
      }),
      Habit.find({ userId: req.userId }),
      Journal.findOne({ userId: req.userId }).sort({ date: -1 })
    ]);

    const prompt = `You are a strict but helpful life coach. Based on the user's data, create a focused daily plan.

Tasks for today (${tasks.length}):
${tasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}

Active habits (${habits.length}):
${habits.map(h => `- ${h.name} (Current streak: ${h.currentStreak} days)`).join('\n')}

Recent energy level: ${recentJournal ? recentJournal.energyLevel + '/5' : 'No data'}

Provide:
1. Priority order for tasks
2. Best time blocks for each
3. Habit integration suggestions
4. One strict reminder about execution

Be concise and actionable. No fluff.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ plan: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Why am I unproductive?
router.post('/analyze-productivity', authMiddleware, async (req, res) => {
  try {
    const groq = getGroqClient();
    const today = new Date();
    const weekAgo = subDays(today, 7);

    const [missedTasks, completedTasks, journals, habits] = await Promise.all([
      Task.find({
        userId: req.userId,
        status: 'pending',
        date: { $lt: startOfDay(today) }
      }).limit(20),
      Task.countDocuments({
        userId: req.userId,
        status: 'completed',
        completedAt: { $gte: weekAgo }
      }),
      Journal.find({
        userId: req.userId,
        date: { $gte: weekAgo }
      }).sort({ date: -1 }),
      Habit.find({ userId: req.userId })
    ]);

    const avgEnergy = journals.length > 0
      ? journals.reduce((acc, j) => acc + j.energyLevel, 0) / journals.length
      : 0;

    const brokenStreaks = habits.filter(h => h.currentStreak === 0).length;

    const prompt = `You are a strict life coach analyzing poor productivity. Be direct and honest.

Data from the past 7 days:
- Completed tasks: ${completedTasks}
- Missed/pending tasks: ${missedTasks.length}
- Average energy level: ${avgEnergy.toFixed(1)}/5
- Broken habit streaks: ${brokenStreaks}/${habits.length}
- Journal entries: ${journals.length}/7

Recent missed tasks:
${missedTasks.slice(0, 5).map(t => `- ${t.title}`).join('\n')}

Provide:
1. The brutal truth about what's not working
2. 3 specific behavioral changes needed
3. One immediate action to take today

No sugar-coating. Be strict but constructive.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 600
    });

    res.json({ analysis: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Summarize journal
router.post('/summarize-journal', authMiddleware, async (req, res) => {
  try {
    const groq = getGroqClient();
    const { days = 7 } = req.body;
    const since = subDays(new Date(), days);

    const journals = await Journal.find({
      userId: req.userId,
      date: { $gte: since }
    }).sort({ date: -1 });

    if (journals.length === 0) {
      return res.status(400).json({ error: 'No journal entries found' });
    }

    const prompt = `Summarize these journal entries as a strict life coach would. Identify patterns, energy trends, and avoidance behaviors.

Entries:
${journals.map(j => `
Date: ${j.date.toLocaleDateString()}
What I did: ${j.whatIDid}
What I avoided: ${j.whatIAvoided || 'Nothing noted'}
Energy: ${j.energyLevel}/5`).join('\n---')}

Provide:
1. Key patterns observed
2. Energy trends
3. Avoidance patterns
4. One actionable insight

Be insightful and direct.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ summary: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get improvement suggestions
router.post('/suggest-improvements', authMiddleware, async (req, res) => {
  try {
    const groq = getGroqClient();
    const today = new Date();
    const weekAgo = subDays(today, 7);

    const [tasks, habits, journals, completedCount] = await Promise.all([
      Task.find({ userId: req.userId, date: { $gte: weekAgo } }),
      Habit.find({ userId: req.userId }),
      Journal.find({ userId: req.userId, date: { $gte: weekAgo } }),
      Task.countDocuments({
        userId: req.userId,
        status: 'completed',
        completedAt: { $gte: weekAgo }
      })
    ]);

    const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
    const avgStreak = habits.length > 0
      ? habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length
      : 0;

    const prompt = `As a behavioral psychology-focused life coach, suggest concrete improvements.

Current metrics:
- Task completion rate: ${completionRate.toFixed(1)}%
- Total tasks: ${tasks.length}
- Active habits: ${habits.length}
- Average habit streak: ${avgStreak.toFixed(1)} days
- Journal consistency: ${journals.length}/7 days

Provide:
1. One system-level improvement (how they organize work)
2. One behavioral change (mindset/approach)
3. One tactical change (specific action)

Focus on reducing decision fatigue and increasing execution. Be specific and actionable.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 500
    });

    res.json({ suggestions: completion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
