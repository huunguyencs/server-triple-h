const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  members: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  text: String,
  seen:{
    type: Boolean,
    default: false
  }
},{
    timestamps: true
})


module.exports = mongoose.model('conversations', conversationSchema )