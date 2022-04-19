const Notifies = require('../Models/notify.model');
const Users = require('../Models/user.model');

class NotifyController {
  async createNotify(req, res) {
    try {
      const { id, recipients, url, content, text, image } = req.body;
      // console.log(req.body);

      // if (recipients.includes(req.user._id.toString())) return;

      const seen = recipients.map(item => {
        return {
          id_recipient: item,
          isSeen: false,
        };
      });

      const newNotify = new Notifies({
        id,
        user: req.user._id,
        recipients,
        url,
        content,
        text,
        image,
        seen,
      });
      await newNotify.save();
      const user = await Users.findById(req.user._id);
      res.created({
        success: true,
        message: 'Create Notify successful',
        newNotify: {
          ...newNotify._doc,
          user: {
            _id: user._id,
            fullname: user.fullname,
            avatar: user.avatar,
          },
        },
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async deleteNotify(req, res) {
    try {
      const notify = await Notifies.findOneAndDelete({
        _id: req.params.id,
        url: req.query.url,
      });

      if (
        req.query.type === 'deletePost' ||
        req.query.type === 'deleteTour' ||
        req.query.type === 'deleteVolunteer'
      ) {
        await Notifies.deleteMany({ url: req.query.url });
      }

      res.success({
        success: true,
        message: 'Delete Notify success',
        notify,
      });
    } catch (err) {
      res.error(err);
    }
  }
  // lấy thông báo của 1 user(user._id)
  async getNotifies(req, res) {
    try {
      const { offset, limit } = req.query;

      // const notifies = await Notifies.find({ recipients: req.user._id })

      const notifies = await Notifies.find({ recipients: req.user._id })
        .skip(parseInt(offset))
        .limit(parseInt(limit))
        .sort('-createdAt')
        .populate('user', 'fullname avatar');

      res.success({
        success: true,
        message: 'Get notifies success',
        notifies,
      });
    } catch (err) {
      res.error(err);
    }
  }

  async isSeenNotify(req, res) {
    try {
      const notify = await Notifies.findOneAndUpdate(
        {
          _id: req.params.id,
          seen: { $elemMatch: { id_recipient: req.user._id } },
        },
        {
          $set: {
            'seen.$.isSeen': true,
          },
        },
        { new: true }
      );

      res.success({
        success: true,
        message: 'Is Seen notify success',
        notify,
      });
    } catch (err) {
      res.error(err);
    }
  }

  async markAllRead(req, res) {
    try {
      await Notifies.updateMany(
        {
          recipients: req.user._id,
          seen: { $elemMatch: { id_recipient: req.user._id } },
        },
        {
          $set: {
            'seen.$.isSeen': true,
          },
        }
      );
      res.success({
        success: true,
        message: 'seen all notify success',
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new NotifyController();
