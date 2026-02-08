import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import FocusSession from '../models/FocusSession.js';

const router = express.Router();

// Get all focus sessions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const sessions = await FocusSession.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create focus session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { duration, type } = req.body;

    const session = new FocusSession({
      userId: req.userId,
      duration,
      type: type || 'pomodoro'
    });

    await session.save();
    res.status(201).json({ session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
