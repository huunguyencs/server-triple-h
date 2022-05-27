const mongoose = require('mongoose');

const rateService = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'users' },
    rate: Number,
    content: String,
    images: [String]
  },
  {
    timestamps: true
  }
);

const serviceSchema = new mongoose.Schema(
  {
    isContribute: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
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
      menu: [String], // Menu
      more_info: [String], // Thông tin thêm
      park: String, // Chỗ đỗ xe
      space: String, // không gian
      convenient: String, // Tiện nghi
      shuttle: String, // Đưa đón
      pickup: [String], // Điểm đón
      stop: [String], // Điểm trả
      book: String, // cách đặt trước
      note: String, // các lưu ý
      time: String // Thời gian mở cửa
    },
    contact: String,
    type: {
      type: String
    }, // di chuyen, nha hang, khach san,
    province: { type: mongoose.Types.ObjectId, ref: 'provinces' },
    star: {
      type: [Number],
      default: [0, 0, 0, 0, 0]
    },
    rate: [{ type: mongoose.Types.ObjectId, ref: 'rate_services' }],
    cost: String,
    andress: String,
    // position: {
    //   lat: Number,
    //   lng: Number
    // },
    position: [Number], // lng, lat
    images: [{ type: String }],
    discount: [{ type: String }]
  },
  {
    timestamps: true
  }
);

serviceSchema.index({ position: '2dsphere' }, { name: '2D sphere Service' });
serviceSchema.index({ position: '2d' }, { name: '2D Service' });

serviceSchema.index(
  {
    name: 'text',
    description: 'text',
    'attribute.conform': 'text',
    'attribute.featured': 'text',
    'attribute.menu': 'text',
    andress: 'text'
  },
  {
    name: 'Service text index',
    weights: {
      name: 7,
      description: 3,
      'attribute.conform': 3,
      'attribute.featured': 1,
      'attribute.menu': 2,
      andress: 4
    }
  }
);

module.exports = mongoose.model('rate_services', rateService);
module.exports = mongoose.model('services', serviceSchema);
