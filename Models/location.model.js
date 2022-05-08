const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    images: [{ type: String }],
    fullname: String,
    star: {
      type: [Number],
      default: [0, 0, 0, 0, 0]
    },
    province: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    province_name: String,
    position: {
      lng: Number,
      lat: Number
    },
    information: String
  },
  {
    timestamps: true
  }
);

locationSchema.index(
  {
    name: 'text',
    fullname: 'text',
    province_name: 'text',
    information: 'text'
  },
  {
    name: 'Location text index',
    weights: {
      name: 3,
      fullname: 8,
      province_name: 7,
      information: 3
    }
  }
);

module.exports = mongoose.model('locations', locationSchema);
