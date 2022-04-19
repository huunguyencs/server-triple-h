const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversation: { type: mongoose.Types.ObjectId, ref: 'conversations' },
    recipient: { type: mongoose.Types.ObjectId, ref: "users" },
    sender: { type: mongoose.Types.ObjectId, ref: "users" },
    text:String,
    seen:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})


module.exports = mongoose.model('messages', messageSchema )