const mongoose = require('mongoose');

const tourDateSchema = new mongoose.Schema(
  {
    date: Date,
    description: String,
    cost: Number,
    events: [
      {
        location: { type: mongoose.Types.ObjectId, ref: 'locations' },
        service: { type: mongoose.Types.ObjectId, ref: 'services' },
        reviewIds: [{ type: mongoose.Types.ObjectId, ref: 'posts' }],
        rateIds: [{ type: mongoose.Types.ObjectId, ref: 'rate_services' }],
        description: String,
        cost: Number,
        time: String
      }
    ],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('tour_dates', tourDateSchema);
