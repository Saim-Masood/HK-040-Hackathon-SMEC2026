const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Resource = require('../models/Resource');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { notifyBookingStatus } = require('../utils/notifications');

router.use(protect);
router.use(authorize('admin'));

// Resource Management
router.post('/resources', [
  body('name').notEmpty(),
  body('type').isIn(['lab', 'hall', 'equipment', 'room', 'other']),
  body('description').notEmpty(),
  body('capacity').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const activeBookings = await Booking.countDocuments({
      resource: req.params.id,
      status: { $in: ['pending', 'approved'] },
      endTime: { $gte: new Date() }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete resource with active bookings' 
      });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Booking Management
router.get('/bookings', async (req, res) => {
  try {
    const { status, resource, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (resource) query.resource = resource;
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('resource', 'name type location')
      .populate('user', 'name email phone department')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/bookings/:id/approve', async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('resource')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be approved' });
    }

    booking.status = 'approved';
    booking.adminNotes = adminNotes;
    booking.updatedAt = Date.now();
    await booking.save();

    await notifyBookingStatus(booking.user, booking, booking.resource, 'approved');

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/bookings/:id/decline', async (req, res) => {
  try {
    const { adminNotes } = req.body;
    
    const booking = await Booking.findById(req.params.id)
      .populate('resource')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be declined' });
    }

    booking.status = 'declined';
    booking.adminNotes = adminNotes;
    booking.updatedAt = Date.now();
    await booking.save();

    await notifyBookingStatus(booking.user, booking, booking.resource, 'declined');

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const availableResources = await Resource.countDocuments({ availability: true });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await Booking.countDocuments({
      startTime: { $gte: today },
      status: 'approved'
    });

    res.json({
      totalResources,
      availableResources,
      totalBookings,
      pendingBookings,
      totalUsers,
      todayBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
