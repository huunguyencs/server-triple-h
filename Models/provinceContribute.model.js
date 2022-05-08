const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema(
  {
    fullname: String,
    information: String,
    detail: {
      overview: {
        cultural: String,
        geography: String,
        weather: String
      },
      vehicle: {
        airport: String,
        traffic: String
      },
      food: [{ type: String }]
    },
    image: { type: String },
    position: [Number],
    provinceId: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    state: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('province_contributes', provinceSchema);
