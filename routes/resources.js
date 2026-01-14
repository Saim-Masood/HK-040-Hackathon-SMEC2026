const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { search, type, availability } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (type) {
      query.type = type;
    }
    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    const resources = await Resource.find(query).sort({ name: 1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id/availability', protect, async (req, res) => {
  try {
    const { date } = req.query;
    const resourceId = req.params.id;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await Booking.find({
      resource: resourceId,
      status: { $in: ['pending', 'approved'] },
      startTime: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ startTime: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
