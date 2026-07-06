const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    pickup: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    dropoff: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number, // in km
    },
    duration: {
      type: Number, // in minutes
    },
    rideType: {
      type: String,
      enum: ['economy', 'comfort', 'premium'],
      default: 'economy',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'wallet'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    cancelledBy: {
      type: String,
      enum: ['user', 'driver'],
    },
    cancelReason: {
      type: String,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Index for faster queries
rideSchema.index({ user: 1, status: 1 });
rideSchema.index({ driver: 1, status: 1 });

module.exports = mongoose.model('Ride', rideSchema);
