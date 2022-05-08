const mongoose = require('mongoose');

const eventContributeSchema = new mongoose.Schema(
  {
    description: String,
    timedes: String,
    fullname: String,
    provinceId: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    images: [{ type: String }],
    time: Number,
    calendarType: Boolean, // False: AL, True: DL,
    isAdd: Boolean,
    contributeId: { type: mongoose.Types.ObjectId, ref: 'events' },
    state: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('event_contributes', eventContributeSchema);
