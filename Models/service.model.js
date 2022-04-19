const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cooperator: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    description: String,
    attribute: {
        conform: String, // Phù hợp
        featured: String, // Đặc trưng
        menu: [String],  // Menu
        more_info: [String], // Thông tin thêm
        park: String, // Chỗ đỗ xe
        space: String, // không gian
        convenient: String, // Tiện nghi
        shuttle: String, // Đưa đón
        pickup: [String], // Điểm đón
        stop: [String], // Điểm trả
        book: String, // cách đặt trước
        note: String, // các lưu ý
        time: String, // Thời gian mở cửa
    },
    contact: String,
    type: {
        type: String,
        required: true
    }, // di chuyen, nha hang, khach san, 
    province: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    star: {
        type: [Number],
        default: [0, 0, 0, 0, 0]
    },
    rate: [
        {
            userId: { type: mongoose.Types.ObjectId, ref: 'users' },
            rate: Number,
            content: String,
            images: [String],
        }
    ],
    cost: String,
    andress: String,
    position: {
        lat: Number,
        lng: Number
    },
    images: [{ type: String }],
    discount: [{ type: String }]
}, {
    timestamps: true
})


module.exports = mongoose.model('services', serviceSchema)