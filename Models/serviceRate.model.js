const mongoose = require('mongoose');

const rateService = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    rate: Number,
    content: String,
    images: [String],
    service: { type: mongoose.Types.ObjectId, ref: 'services' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('rate_services', rateService);
