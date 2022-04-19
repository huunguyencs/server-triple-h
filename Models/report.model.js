const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    type: [{ type: String }],
    content: { type: String },
    postId: {type: mongoose.Types.ObjectId, ref: 'posts' },
    state: {type:Number, default: 0} //0: là mới, 1 là đang xử lí, 2 là đã xử lí
}, {
    timestamps: true
})


module.exports = mongoose.model('reports', reportSchema)