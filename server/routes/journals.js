import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import Journal from '../models/Journal.js';
import { startOfDay, endOfDay } from 'date-fns';

const router = express.Router();

// Get all journals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const journals = await Journal.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ journals });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get journal by date
router.get('/date/:date', authMiddleware, async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    const journal = await Journal.findOne({
      userId: req.userId,
      date: {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      }
    });

    res.json({ journal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create or update journal
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { whatIDid, whatIAvoided, energyLevel, date } = req.body;
    const targetDate = date ? new Date(date) : new Date();

    const existingJournal = await Journal.findOne({
      userId: req.userId,
      date: {
        $gte: startOfDay(targetDate),
        $lte: endOfDay(targetDate)
      }
    });

    if (existingJournal) {
      existingJournal.whatIDid = whatIDid;
      existingJournal.whatIAvoided = whatIAvoided;
      existingJournal.energyLevel = energyLevel;
      await existingJournal.save();
      return res.json({ journal: existingJournal });
    }

    const journal = new Journal({
      userId: req.userId,
      whatIDid,
      whatIAvoided,
      energyLevel,
      date: targetDate
    });

    await journal.save();
    res.status(201).json({ journal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete journal
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const journal = await Journal.findOneAndDelete({ _id: id, userId: req.userId });

    if (!journal) {
      return res.status(404).json({ error: 'Journal not found' });
    }

    res.json({ message: 'Journal deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
