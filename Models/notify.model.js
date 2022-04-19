const mongoose = require('mongoose');

const notifySchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    user: { type: mongoose.Types.ObjectId, ref: 'users' },
    recipients: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
    content: {
        type: String,
        required: true
    },
    seen: [{
        id_recipient: { type: mongoose.Types.ObjectId, ref: 'users' },
        isSeen: { type: Boolean, default: false }
    }],
    url: String,
    image: String,
    text: String
}, {
    timestamps: true
})


module.exports = mongoose.model('notifies', notifySchema)