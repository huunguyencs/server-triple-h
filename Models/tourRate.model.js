const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    tour_id: { type: mongoose.Types.ObjectId, ref: 'tours' },
    user_id: { type: mongoose.Types.ObjectId, ref: 'users' },
    score: Number
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('tour_rates', tourSchema);
