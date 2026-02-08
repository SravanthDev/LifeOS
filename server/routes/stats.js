import express from 'express';
import mongoose from 'mongoose';
import { authMiddleware } from '../middleware/auth.js';
import Task from '../models/Task.js';
import Journal from '../models/Journal.js';
import Habit from '../models/Habit.js';
import FocusSession from '../models/FocusSession.js';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, subDays } from 'date-fns';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const [completedToday, pendingToday, completedWeek, missedTasks, focusSessions, habits] = await Promise.all([
      Task.countDocuments({
        userId: req.userId,
        status: 'completed',
        completedAt: { $gte: startOfDay(today), $lte: endOfDay(today) }
      }),
      Task.countDocuments({
        userId: req.userId,
        status: 'pending',
        date: { $gte: startOfDay(today), $lte: endOfDay(today) }
      }),
      Task.countDocuments({
        userId: req.userId,
        status: 'completed',
        completedAt: { $gte: weekStart }
      }),
      Task.countDocuments({
        userId: req.userId,
        status: 'pending',
        date: { $lt: startOfDay(today) }
      }),
      FocusSession.countDocuments({
        userId: req.userId,
        date: { $gte: startOfWeek(today) }
      }),
      Habit.find({ userId: req.userId })
    ]);

    const totalFocusMinutes = await FocusSession.aggregate([
      {
        $match: {
          userId: userObjectId,
          date: { $gte: weekStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$duration' }
        }
      }
    ]);

    const focusMinutes = totalFocusMinutes[0]?.total || 0;
    const avgStreak = habits.length > 0
      ? habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length
      : 0;

    res.json({
      stats: {
        completedToday,
        pendingToday,
        completedWeek,
        missedTasks,
        focusSessions,
        focusMinutes,
        avgStreak: Math.round(avgStreak * 10) / 10,
        totalHabits: habits.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly chart data
router.get('/weekly', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const [completed, focusMinutes] = await Promise.all([
        Task.countDocuments({
          userId: req.userId,
          status: 'completed',
          completedAt: { $gte: dayStart, $lte: dayEnd }
        }),
        FocusSession.aggregate([
          {
            $match: {
              userId: userObjectId,
              date: { $gte: dayStart, $lte: dayEnd }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$duration' }
            }
          }
        ])
      ]);

      weekData.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        focusMinutes: focusMinutes[0]?.total || 0
      });
    }

    res.json({ weekData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
