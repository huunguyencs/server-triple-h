const mongoose = require('mongoose');

const eventContributeSchema = new mongoose.Schema({
    description: String,
    timedes: String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    fullname: String,
    provinceId: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    images: [{ type: String }],
    time: Number,
    calendarType: Boolean // False: AL, True: DL
}, {
    timestamps: true
})


module.exports = mongoose.model('event_contribute', eventContributeSchema)