const mongoose = require('mongoose');

const volunteerLocationSchema = new mongoose.Schema({
    users: [{
        isAccommodation: Boolean,
        user: { type: mongoose.Types.ObjectId, ref: 'users' }
    }],
    timeStart: Date,
    maxUsers: Number,
    description: [{type:String}],
    activities: [{ type: String }],
    ageUser: String,
    location: { type: mongoose.Types.ObjectId, ref: 'locations' },
    accommodation: String
}, {
    timestamps: true
})


module.exports = mongoose.model('volunteer_locations', volunteerLocationSchema)