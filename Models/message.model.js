const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversations' },
    sender: { type: mongoose.Types.ObjectId, ref: "users" },
    text:String,
    seen: [{
        member: { type: mongoose.Types.ObjectId, ref: 'users' },
        isSeen: { type: Boolean }
    }],
},{
    timestamps: true
})


module.exports = mongoose.model('messages', messageSchema )