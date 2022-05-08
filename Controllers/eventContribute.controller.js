const Events = require('../Models/eventContribute.model');
const date = require('../utils/date');
const Provinces = require('../Models/province.model');

class EventContributeController {
  async createEvent(req, res) {
    try {
      const { provinceId } = req.body;
      var event;
      if (provinceId) {
        const prov = Provinces.findById(provinceId).select('fullname');
        if (prov) {
          const province = prov.fullname;
          province = new Events(req.body);
        } else {
          res.notFound('Không tìm thấy tỉnh!');
        }
      } else {
        event = new Events(req.body);
      }
      await event.save();

      res.created({
        success: true,
        message: 'Create event successful',
        province: event
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getEvent(req, res) {
    try {
      const event = await Events.findOne({ _id: req.params.id }).populate(
        'provinceId',
        'name fullname'
      );
      if (event) {
        res.success({
          success: true,
          message: 'get info 1 event successful',
          event
        });
      } else {
        res.notFound('Không tìm thấy sự kiện');
      }
    } catch (err) {
      res.error(err);
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;
      await Events.findByIdAndDelete(id);
      res.deleted('Xóa sự kiện thành công');
    } catch (err) {
      res.error(err);
    }
  }

  async getAll(req, res) {
    try {
      const events = await Events.find({})
        .select('name fullname time provinceId calendarType')
        .populate('provinceId', 'fullname');
      res.success({
        success: true,
        message: 'Lấy tất cả các sự kiện thành công',
        events
      });
    } catch (err) {
      res.error(err);
    }
  }

  async updateState(req, res) {
    try {
      const event = await Events.findByIdAndUpdate(req.params.id, {
        state: true
      });
      res.success({
        success: true,
        event
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new EventContributeController();
