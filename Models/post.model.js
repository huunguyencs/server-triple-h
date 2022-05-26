const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    content: String,
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    isPublic: {
      type: Boolean,
      default: true
    },
    isShare: {
      type: Boolean,
      default: false
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    images: Array,
    isPostReview: {
      type: Boolean,
      default: false
    },
    rate: Number,
    locationId: { type: mongoose.Types.ObjectId, ref: 'locations' },
    hashtags: [{ type: String }],
    taggedIds: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    shareId: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }
  },
  {
    timestamps: true
  }
);

postSchema.index(
  {
    content: 'text',
    hashtags: 'text'
  },
  {
    name: 'Post text index',
    weights: {
      content: 5,
      hashtags: 4
    }
  }
);

module.exports = mongoose.model('posts', postSchema);
