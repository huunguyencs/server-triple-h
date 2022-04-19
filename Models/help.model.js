const mongoose = require('mongoose');

const helpSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    description: String,
    position: [Number], //lng, lat
    type: String,
    contact: String,
    positionStr: String,
    state: [{ type: mongoose.Types.ObjectId, ref: 'users' }]
}, {
    timestamps: true
})


module.exports = mongoose.model('helps', helpSchema)