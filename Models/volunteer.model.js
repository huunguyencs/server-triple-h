const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    descriptions: [{ type: String }],
    date: [{ type: mongoose.Types.ObjectId, ref: 'volunteer_dates' }],
    location: [{ type: mongoose.Types.ObjectId, ref: 'volunteer_locations' }],
    images: [{ type: String }],
    cost: String,
    type: String,
    users: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
  },
  {
    timestamps: true
  }
);

volunteerSchema.index(
  {
    name: 'text',
    descriptions: 'text',
    type: 'text'
  },
  {
    name: 'Volunteer text index',
    weights: {
      name: 8,
      descriptions: 4,
      type: 6
    }
  }
);

module.exports = mongoose.model('volunteers', volunteerSchema);
