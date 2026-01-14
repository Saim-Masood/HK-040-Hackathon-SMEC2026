const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['lab', 'hall', 'equipment', 'room', 'other']
  },
  description: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  location: {
    building: String,
    floor: String,
    roomNumber: String
  },
  amenities: [String],
  images: [String],
  availability: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    start: String,
    end: String
  },
  bookingDuration: {
    min: { type: Number, default: 30 },
    max: { type: Number, default: 240 }
  },
  requiresApproval: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resourceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Resource', resourceSchema);
