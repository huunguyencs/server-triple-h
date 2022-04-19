const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentType: {
        type: String
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    content: {
        type: String,
        required: true
    },
    userId: { type: mongoose.Types.ObjectId, ref: 'users' }
}, {
    timestamps: true
})


module.exports = mongoose.model('comments', commentSchema)