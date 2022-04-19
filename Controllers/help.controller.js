const Helps = require('../Models/help.model');
const { ip2position } = require('../utils/ip2position');

class HelpController {
  async createHelp(req, res) {
    try {
      let { description, position, type, positionStr, contact, expireAt } =
        req.body;

      console.log(req.headers['x-forwarded-for']);

      if (!position) {
        const temp = ip2position(req.headers['x-forwarded-for']);
        position = [temp.longitude, temp.latitude];
      }

      if (!expireAt) {
        expireAt = new Date();
        expireAt.setDate(expireAt.getDate() + 2);
        expireAt = new Date(expireAt);
      }
      const help = new Helps({
        userId: req.user._id,
        description,
        position,
        contact,
        type,
        positionStr,
        expireAt
      });
      await help.save();
      res.success({
        success: true,
        help: {
          ...help._doc,
          userId: {
            _id: req.user._id,
            fullname: req.user.fullname,
            avatar: req.user.avatar
          }
        }
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getHelps(req, res) {
    try {
      let { lat, lng } = req.query;
      if (lat === 'undefined' || lng === 'undefined') {
        if (!req.headers['x-forwarded-for']) {
          return res.error({ message: 'Not found your position' });
        }
        let temp = ip2position(req.headers['x-forwarded-for']);
        lat = temp.latitude;
        lng = temp.longitude;
      }
      lat = parseFloat(lat);
      lng = parseFloat(lng);

      const helps = await Helps.find({
        position: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: 5000
          }
        }
      }).populate('userId', 'avatar fullname');

      res.success({
        success: true,
        helps
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getMyHelps(req, res) {
    try {
      const helps = await Helps.find({ userId: req.user._id });
      res.success({
        success: true,
        helps
      });
    } catch (err) {
      res.error(err);
    }
  }

  async updateHelp(req, res) {
    try {
      const { id } = req.params;
      const help = await Helps.findOneAndUpdate(
        { _id: id, userId: req.user._id },
        req.body
      );

      res.success({
        success: true,
        help
      });
    } catch (err) {
      res.error(err);
    }
  }

  async help(req, res) {
    try {
      const { id } = req.params;
      const help = await Helps.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            state: req.user._id
          }
        },
        { new: true }
      );

      res.success({
        success: true,
        help
      });
    } catch (err) {
      res.error(err);
    }
  }

  async deleteHelp(req, res) {
    try {
      const { id } = req.params;
      await Helps.findByIdAndDelete(id);
      res.deleted({
        success: true
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new HelpController();
