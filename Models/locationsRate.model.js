const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    location_id: { type: mongoose.Types.ObjectId, ref: 'locations' },
    user_id: { type: mongoose.Types.ObjectId, ref: 'users' },
    rate: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('location_rates', locationSchema);
