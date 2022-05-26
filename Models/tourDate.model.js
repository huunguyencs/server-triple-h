const mongoose = require('mongoose');

const tourDateSchema = new mongoose.Schema(
  {
    date: Date,
    description: String,
    services: [
      {
        service: { type: mongoose.Types.ObjectId, ref: 'services' },
        cost: Number,
        description: String,
        rateId: [{ type: mongoose.Types.ObjectId, ref: 'rate_services' }]
      }
    ],
    cost: Number,
    events: [
      {
        location: { type: mongoose.Types.ObjectId, ref: 'locations' },
        service: { type: mongoose.Types.ObjectId, ref: 'services' },
        postId: [{ type: mongoose.Types.ObjectId, ref: 'posts' }],
        rateId: [{ type: mongoose.Types.ObjectId, ref: 'rate_services' }],
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
