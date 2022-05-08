const mongoose = require('mongoose');

const locationContributeSchema = new mongoose.Schema(
  {
    images: [{ type: String }],
    fullname: String,
    province: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    // position: [Number],
    position: {
      lat: Number,
      lng: Number
    },
    information: String,
    isAdd: Boolean,
    contributeId: { type: mongoose.Types.ObjectId, ref: 'locations' },
    state: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'location_contributes',
  locationContributeSchema
);
