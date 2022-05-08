const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    description: String,
    timedes: String,
    name: {
      type: String,
      required: true,
      unique: true
    },
    fullname: String,
    provinceId: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    images: [{ type: String }],
    time: Number,
    calendarType: Boolean, // False: AL, True: DL
    province: String
  },
  {
    timestamps: true
  }
);

eventSchema.index(
  {
    description: 'text',
    name: 'text',
    timedes: 'text',
    fullname: 'text',
    calendarType: 'text'
  },
  {
    name: 'Event text index',
    weights: {
      description: 3,
      name: 3,
      timedes: 5,
      fullname: 10,
      calendarType: 1
    }
  }
);

module.exports = mongoose.model('events', eventSchema);
