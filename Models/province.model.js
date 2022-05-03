const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
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
    position: {
      lng: Number,
      lat: Number
    }
  },
  {
    timestamps: true
  }
);

provinceSchema.index(
  {
    name: 'text',
    fullname: 'text',
    information: 'text',
    'detail.food': 'text'
  },
  {
    name: 'Province text index',
    weights: {
      name: 3,
      fullname: 10,
      information: 3,
      'detail.food': 3
    }
  }
);

module.exports = mongoose.model('provinces', provinceSchema);
