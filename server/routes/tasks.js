import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Task from '../models/Task.js';
import { startOfDay, endOfDay } from 'date-fns';

const router = express.Router();

// Get all tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { group, date } = req.query;
    const query = { userId: req.userId };

    if (group) {
      query.group = group;
    }

    if (date) {
      const targetDate = new Date(date);
      query.date = {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      };
    }

    const tasks = await Task.find(query).sort({ priority: -1, createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top 3 priority tasks
router.get('/top', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const tasks = await Task.find({
      userId: req.userId,
      status: 'pending',
      date: {
        $gte: startOfDay(today),
        $lte: endOfDay(today)
      }
    })
      .sort({ priority: -1, createdAt: -1 })
      .limit(3);

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, priority, group, date } = req.body;

    const task = new Task({
      userId: req.userId,
      title,
      priority: priority || 0,
      group: group || 'daily',
      date: date || new Date()
    });

    await task.save();
    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update task
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Carry forward incomplete tasks
router.post('/carry-forward', authMiddleware, async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const incompleteTasks = await Task.find({
      userId: req.userId,
      status: 'pending',
      date: {
        $gte: startOfDay(yesterday),
        $lte: endOfDay(yesterday)
      },
      carriedForward: false
    });

    const today = new Date();
    const newTasks = incompleteTasks.map(task => ({
      userId: task.userId,
      title: task.title,
      priority: task.priority,
      group: task.group,
      date: today,
      carriedForward: true
    }));

    if (newTasks.length > 0) {
      await Task.insertMany(newTasks);
    }

    res.json({ message: `Carried forward ${newTasks.length} tasks`, count: newTasks.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
