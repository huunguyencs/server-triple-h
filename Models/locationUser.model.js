const mongoose = require('mongoose');

const locationUserSchema = new mongoose.Schema(
  {
    review: { type: mongoose.Types.ObjectId, ref: 'posts' },
    user: { type: mongoose.Types.ObjectId, ref: 'users' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('location_users', locationUserSchema);
