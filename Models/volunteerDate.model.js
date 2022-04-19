const mongoose = require('mongoose');

const volunteerDateSchema = new mongoose.Schema({
    accommodation: String,
    date: Date,
    activities: [{
        time: String,
        activity: String
    }]
}, {
    timestamps: true
})


module.exports = mongoose.model('volunteer_dates', volunteerDateSchema)