const mongoose = require('mongoose');

const tourDateSchema = new mongoose.Schema({
    date: Date,
    description: String,
    services: [
        {
            service: { type: mongoose.Types.ObjectId, ref: 'services' },
            serviceName: String,
            cost: Number,
            description: String
        }
    ],
    cost: Number,
    locations: [
        {
            location: { type: mongoose.Types.ObjectId, ref: 'locations' },
            locationName: String,
            postId: [{ type: mongoose.Types.ObjectId, ref: 'posts' }],
            description: String,
            cost: Number,
            time: String,
            joinIds: [{ type: mongoose.Types.ObjectId, ref: 'users' }],
            services: [
                {
                    service: { type: mongoose.Types.ObjectId, ref: 'services' },
                    serviceName: String,
                    cost: Number,
                    description: String
                }
            ]
        }
    ]
}, {
    timestamps: true
})


module.exports = mongoose.model('tour_dates', tourDateSchema)