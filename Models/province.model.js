const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fullname: String,
    information: String,
    detail: {
        overview: {
            cultural: String,
            geography: String,
            weather: String
        },
        vehicle: {
            airport: String,
            traffic: String
        },
        food: [{ type: String }]
    },
    image: { type: String },
    position: {
        lng: Number,
        lat: Number
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('provinces', provinceSchema)