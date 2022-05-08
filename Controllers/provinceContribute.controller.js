const Provinces = require('../Models/provinceContribute.model');

class ProvinceContributeController {
  async createProvince(req, res) {
    try {
      const province = new Provinces(req.body);
      await province.save();
      res.created({
        success: true,
        message: 'Created'
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getProvince(req, res) {
    try {
      const province = await Provinces.findById(req.params.id);
      if (province) {
        res.success({
          success: true,
          province
        });
      } else {
        res.notFound('Không tìm thấy');
      }
    } catch (err) {
      res.error(err);
    }
  }

  async deleteProvince(req, res) {
    try {
      await Provinces.findByIdAndDelete(req.params.id);
      res.deleted('Xóa thành công');
    } catch (err) {
      res.error(err);
    }
  }

  async getAll(req, res) {
    try {
      const provinces = await Provinces.find({});
      res.success({
        success: true,
        message: 'Lấy tất cả thành công',
        provinces
      });
    } catch (err) {
      res.error(err);
    }
  }

  async updateState(req, res) {
    try {
      const province = await Provinces.findByIdAndUpdate(req.params.id, {
        state: true
      });
      res.success({
        success: true,
        province
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new ProvinceContributeController();
