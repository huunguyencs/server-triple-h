const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  name: { type: String},
  isGroup: { type: Boolean, default: false},
  members: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  // text: String,
  latestMessage:{
    type: mongoose.Types.ObjectId, ref: "messages"
  },
  // seen:{
  //   type: Boolean,
  //   default: false
  // },
  groupAdmin: {
    type: mongoose.Types.ObjectId, ref: "users"
  }
},{
    timestamps: true
})


module.exports = mongoose.model('conversations', conversationSchema )