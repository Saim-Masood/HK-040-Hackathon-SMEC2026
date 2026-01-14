const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');
const { protect } = require('../middleware/auth');
const { notifyBookingStatus } = require('../utils/notifications');

const checkBookingConflict = async (resourceId, startTime, endTime, excludeBookingId = null) => {
  const query = {
    resource: resourceId,
    status: { $in: ['pending', 'approved'] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query);
  return conflictingBooking !== null;
};

router.post('/', protect, [
  body('resource').notEmpty(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('purpose').notEmpty(),
  body('attendees').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { resource, startTime, endTime, purpose, attendees } = req.body;

    const resourceDoc = await Resource.findById(resource);
    if (!resourceDoc) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (!resourceDoc.availability) {
      return res.status(400).json({ message: 'Resource is not available' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: 'Cannot book in the past' });
    }

    const durationMinutes = (end - start) / (1000 * 60);
    if (durationMinutes < resourceDoc.bookingDuration.min || 
        durationMinutes > resourceDoc.bookingDuration.max) {
      return res.status(400).json({ 
        message: `Booking duration must be between ${resourceDoc.bookingDuration.min} and ${resourceDoc.bookingDuration.max} minutes` 
      });
    }

    if (attendees > resourceDoc.capacity) {
      return res.status(400).json({ 
        message: `Number of attendees exceeds resource capacity of ${resourceDoc.capacity}` 
      });
    }

    const hasConflict = await checkBookingConflict(resource, start, end);
    if (hasConflict) {
      return res.status(409).json({ message: 'Time slot is already booked' });
    }

    const booking = await Booking.create({
      resource,
      user: req.user._id,
      startTime: start,
      endTime: end,
      purpose,
      attendees,
      status: resourceDoc.requiresApproval ? 'pending' : 'approved'
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('resource', 'name type location')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('resource', 'name type location')
      .sort({ startTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('resource')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('resource')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.updatedAt = Date.now();
    await booking.save();

    await notifyBookingStatus(booking.user, booking, booking.resource, 'cancelled');

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
