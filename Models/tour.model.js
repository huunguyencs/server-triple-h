const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    content: String,
    tour: [{ type: mongoose.Types.ObjectId, ref: 'tour_dates' }],
    name: {
      type: String
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    joinIds: [
      {
        id: { type: mongoose.Types.ObjectId, ref: 'users' },
        isJoin: { type: Boolean, default: false },
        isEdit: { type: Boolean, default: false }
      }
    ],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    hashtags: Array,
    image: String,
    shareId: { type: mongoose.Types.ObjectId, ref: 'tours' },
    cost: Number,
    provinces: [{ type: String }],
    locations: [{ type: String }]
  },
  {
    timestamps: true
  }
);

tourSchema.index(
  {
    name: 'text',
    provinces: 'text',
    locations: 'text',
    content: 'text',
    hashtags: 'text'
  },
  {
    name: 'Tour text index',
    weights: {
      name: 6,
      provinces: 8,
      locations: 7,
      content: 6,
      hashtags: 4
    }
  }
);

module.exports = mongoose.model('tours', tourSchema);
