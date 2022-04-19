const mongoose = require('mongoose');

const locationContributeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    images: [{ type: String }],
    fullname: String,
    star: {
        type: [Number],
        default: [0, 0, 0, 0, 0]
    },
    province: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    province_name: String,
    position: {
        lng: Number,
        lat: Number
    },
    information: String
}, {
    timestamps: true
})


module.exports = mongoose.model('location_contribute', locationContributeSchema)