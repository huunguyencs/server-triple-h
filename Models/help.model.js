const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    description: String,
    position: [Number], //lng, lat
    type: String,
    contact: String,
    positionStr: String,
    state: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
  },
  {
    timestamps: true
  }
);

helpSchema.index({ position: '2dsphere' }, { name: '2D Sphere Help' });
helpSchema.index({ position: '2d' }, { name: '2D Help' });
helpSchema.index(
  { createdAt: 1 },
  { name: 'Expire Help', expireAfterSeconds: 24 * 60 * 60 * 2 }
);

module.exports = mongoose.model('helps', helpSchema);
