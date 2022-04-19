const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    content: String,
    tour: [{ type: mongoose.Types.ObjectId, ref: 'tour_dates' }],
    name: {
        type: String
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    joinIds: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comments' }],
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    hashtags: Array,
    image: String,
    shareId: { type: mongoose.Types.ObjectId, ref: 'tours' },
    cost: Number,
    provinces: [{ type: String }],
    locations: [{ type: String }],
}, {
    timestamps: true
})


module.exports = mongoose.model('tours', tourSchema)