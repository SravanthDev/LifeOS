import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Habit from '../models/Habit.js';
import { startOfDay, differenceInDays } from 'date-fns';

const router = express.Router();

// Get all habits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ habits });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create habit
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    const habitCount = await Habit.countDocuments({ userId: req.userId });
    if (habitCount >= 5) {
      return res.status(400).json({ error: 'Maximum 5 habits allowed' });
    }

    const habit = new Habit({
      userId: req.userId,
      name
    });

    await habit.save();
    res.status(201).json({ habit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete habit for today
router.post('/:id/complete', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({ _id: id, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const today = startOfDay(new Date());
    
    const alreadyCompleted = habit.completedDates.some(
      date => startOfDay(date).getTime() === today.getTime()
    );

    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Habit already completed today' });
    }

    habit.completedDates.push(today);
    habit.lastCompletedAt = today;

    if (habit.completedDates.length > 0) {
      const sortedDates = habit.completedDates
        .map(d => startOfDay(d))
        .sort((a, b) => b - a);

      let currentStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const daysDiff = differenceInDays(sortedDates[i], sortedDates[i + 1]);
        if (daysDiff === 1) {
          currentStreak++;
        } else {
          break;
        }
      }

      habit.currentStreak = currentStreak;
      habit.longestStreak = Math.max(habit.longestStreak, currentStreak);
    }

    await habit.save();
    res.json({ habit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update habit
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { name },
      { new: true }
    );

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ habit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete habit
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOneAndDelete({ _id: id, userId: req.userId });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
