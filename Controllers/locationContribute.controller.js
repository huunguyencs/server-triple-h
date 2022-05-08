const Locations = require('../Models/locationContribute.model');

class LocationContributeController {
  async createLocation(req, res) {
    try {
      const newLocation = new Locations(req.body);
      await newLocation.save();

      res.created({
        success: true,
        message: 'Create Location successful',
        newLocation
      });
    } catch (err) {
      res.error(err);
    }
  }

  async deleteLocation(req, res) {
    try {
      await Locations.findByIdAndDelete(req.params.id);
      res.success({
        success: true,
        message: 'Delete Location success'
      });
    } catch (err) {
      res.error(err);
    }
  }

  // lấy thông tin 1 Location theo name
  async getLocation(req, res) {
    try {
      const location = await Locations.findById(req.params.id).populate(
        'province',
        'name fullname image'
      );
      if (location) {
        res.success({
          success: true,
          message: 'get info 1 Location success',
          location
        });
      } else {
        res.notFound('Không tìm thấy địa điểm!');
      }
    } catch (err) {
      res.error(err);
    }
  }

  async getAll(req, res) {
    try {
      const locations = await Locations.find({})
        .select('fullname name province position images')
        .populate('province', 'fullname name');
      res.success({
        success: true,
        message: 'Lấy tất cả địa điểm thành công',
        locations
      });
    } catch (err) {
      res.error(err);
    }
  }

  async updateState(req, res) {
    try {
      const location = await Locations.findByIdAndUpdate(req.params.id, {
        state: true
      });
      res.success({
        success: true,
        location
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new LocationContributeController();
