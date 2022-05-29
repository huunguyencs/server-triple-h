const Services = require('../Models/service.model');
const ServiceRates = require('../Models/serviceRate.model');
const {
  createItem,
  reviewItem,
  viewDetailItem,
  updatePropsItem,
  deleteItem
} = require('../utils/recombee');
const TourDates = require('../Models/tourDate.model');
const ObjectId = require('mongoose').Types.ObjectId;

class ServiceController {
  async createService(req, res) {
    try {
      const {
        name,
        description,
        attribute,
        contact,
        type,
        province,
        cost,
        andress,
        position,
        images,
        discount
      } = req.body;

      if (req.user.role !== 1) return res.unauthorized();

      const newService = new Services({
        cooperator: req.user._id,
        name,
        description,
        attribute,
        contact,
        type,
        province,
        cost,
        andress,
        position,
        images,
        discount
      });

      await newService.save();

      // console.log(location)
      res.created({
        success: true,
        message: 'Create Service successful',
        newService: {
          ...newService._doc
        }
      });

      let cat = [];

      if (attribute?.conform) cat = [attribute.conform];
      if (attribute?.featured) cat = [...cat, attribute.featured];

      createItem(newService._doc._id, 'service', cat, description);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async updateService(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy dịch vụ');
        return;
      }
      const {
        name,
        description,
        contact,
        andress,
        position,
        type,
        province,
        images,
        cost,
        discount,
        attribute
      } = req.body;

      const service = await Services.findOneAndUpdate(
        { _id: req.params.id, cooperator: req.user._id },
        {
          name,
          description,
          attribute,
          contact,
          type,
          province,
          cost,
          andress,
          position,
          images,
          discount
        },
        { new: true }
      );

      res.success({
        success: true,
        message: 'update Service successful',
        service
      });

      let cat = [];

      if (service.attribute?.conform) cat = [service.attribute.conform];
      if (service.attribute?.featured)
        cat = [...cat, service.attribute.featured];

      updatePropsItem(req.params.id, 'service', cat, description);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async deleteService(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy dịch vụ');
        return;
      }

      await Services.findOneAndDelete({
        _id: req.params.id,
        cooperator: req.user._id
      });

      res.deleted();
      try {
        deleteItem(req.params.id);
      } catch (err) {}
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  // lấy thông tin 1 Service theo params.id
  async getService(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy dịch vụ');
        return;
      }
      const service = await Services.findById(req.params.id)
        .populate('cooperator', 'fullname avatar')
        .populate('province', 'fullname name position');
      res.success({
        success: true,
        message: 'get info 1 Service success',
        service
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getAll(req, res) {
    try {
      let { limit, page, province, cooperator, name, isContribute } = req.query;
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 0;

      const where = {};
      // console.log(typeof isContribute)

      if (province) where.province = province;
      if (cooperator) where.contribute = cooperator;
      if (name) where.name = name;
      if (isContribute && isContribute === 'true') where.isContribute = true;
      else where.isContribute = { $ne: true };

      const count = await Services.count(where);
      // console.log(count);

      const services = await Services.find(
        where,
        'name description images star type isContribute'
      )
        .skip(page * limit)
        .limit(limit)
        .populate('cooperator', 'fullname avatar')
        .populate('province', 'fullname');
      res.success({
        success: true,
        message: 'get info all Service success',
        services,
        total: count
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getServices(req, res) {
    try {
      var { offset, isContribute } = req.query;
      offset = parseInt(offset) || 0;
      let where = { isContribute: { $ne: true } };
      if (isContribute && isContribute === 'true') where = {};
      // console.log(offset);
      const services = await Services.find(where)
        .skip(offset * 5)
        .limit(5)
        .populate('cooperator', 'fullname avatar')
        .populate('province', 'name fullname');
      res.success({
        success: true,
        message: 'get info all Service success',
        services
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getServiceByCoop(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy user');
        return;
      }
      let { limit, page } = req.query;
      limit = parseInt(limit) || 5;
      page = parseInt(page) || 0;
      const services = await Services.find({ cooperator: req.params.id })
        .skip(page * limit)
        .limit(limit)
        .populate('province', 'name fullname')
        .populate('cooperator', 'fullname avatar');
      res.success({ success: true, message: '', services });
    } catch (err) {
      res.error(err);
    }
  }

  async getServiceRate(req, res) {
    try {
      let { limit, page } = req.query;
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 0;
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy dịch vụ');
        return;
      }
      const count = await ServiceRates.count({ service: req.params.id });
      const rates = await ServiceRates.find({
        service: req.params.id
      })
        .skip(limit * page)
        .limit(limit)
        .populate('userId', 'fullname avatar');
      res.success({
        success: true,
        message: '',
        rates,
        count
      });

      if (req.user && req.user._id !== 0) {
        viewDetailItem(req.user._id, req.params.id);
      }
    } catch (err) {
      res.error(err);
    }
  }

  async reviewService(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy dịch vụ');
        return;
      }
      const { rate, content, images, tourDateId, eventId } = req.body;
      const newRate = await ServiceRates({
        userId: req.user._id,
        rate,
        content,
        images,
        service: req.params.id
      });

      await newRate.save();

      var service;

      switch (parseInt(rate)) {
        case 1:
          service = await Services.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'star.0': 1 }
            },
            { new: true }
          );
          break;
        case 2:
          service = await Services.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'star.1': 1 }
            },
            { new: true }
          );
          break;
        case 3:
          service = await Services.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'star.2': 1 }
            },
            { new: true }
          );
          break;
        case 4:
          service = await Services.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'star.3': 1 }
            },
            { new: true }
          );
          break;
        case 5:
          service = await Services.findByIdAndUpdate(
            req.params.id,
            {
              $inc: { 'star.4': 1 }
            },
            { new: true }
          );
          break;
      }

      res.success({ success: true, message: '', star: service.star, newRate });

      if (tourDateId) {
        await TourDates.findOneAndUpdate(
          {
            _id: tourDateId,
            events: { $elemMatch: { _id: eventId } }
          },
          {
            $push: {
              'events.$.rateIds': newRate._doc._id
            }
          },
          { new: true, safe: true, upsert: true }
        );
      }

      reviewItem(req.user._id, req.params.id, rate);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async search(req, res) {
    try {
      var { q, offset } = req.query;
      offset = parseInt(offset) || 0;
      var services = await Services.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .skip(offset * 10)
        .limit(10);
      services = services.map(item => ({
        _id: item._id,
        fullname: item.name,
        link: `/u/${item.cooperator}`,
        description: item.description,
        image: item.images[0]
      }));
      res.success({ success: true, results: services, query: q });
    } catch (err) {
      res.error(err);
    }
  }

  async getTopServiceNear(req, res) {
    try {
      let { lat, lng } = req.query;
      if (!lat || !lng || lat === 'undefined' || lng === 'undefined')
        return res.error('Thiếu dữ liệu');

      lat = parseFloat(lat);
      lng = parseFloat(lng);

      console.log(lat);
      console.log(lng);

      let services = await Services.aggregate([
        {
          $geoNear: {
            includeLocs: 'position',
            distanceField: 'distance',
            near: { type: 'Point', coordinates: [lng, lat] },
            maxDistance: 10000,
            spherical: true
          }
        },
        {
          $addFields: {
            rateScore: {
              $avg: [
                { $multiply: [{ $arrayElemAt: ['$star', 0] }, 1] },
                { $multiply: [{ $arrayElemAt: ['$star', 1] }, 2] },
                { $multiply: [{ $arrayElemAt: ['$star', 2] }, 3] },
                { $multiply: [{ $arrayElemAt: ['$star', 3] }, 4] },
                { $multiply: [{ $arrayElemAt: ['$star', 4] }, 5] }
              ]
            }
          }
        },
        {
          $sort: {
            rateScore: -1
          }
        },
        {
          $limit: 5
        },
        {
          $lookup: {
            from: 'users',
            localField: 'cooperator',
            foreignField: '_id',
            as: 'cooperator'
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'province',
            foreignField: '_id',
            as: 'province',
            pipeline: [{ $project: { _id: 1, name: 1, fullname: 1 } }]
          }
        }
      ]);

      if (!services) return res.notFound('Không tìm thấy service');
      services = services.map(item => ({
        ...item,
        cooperator: item.cooperator[0],
        province: item.province[0]
      }));
      res.success({
        success: true,
        services
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async createContribute(req, res) {
    try {
      const { description, province_name, name } = req.body;
      const service = new Services({
        ...req.body,
        cooperator: req.user._id,
        isContribute: true
      });

      await service.save();

      // console.log(req.user);

      res.success({
        success: true,
        service: {
          ...service._doc
        }
      });

      createItem(
        service._doc._id,
        'service',
        [province_name, name],
        description
      );
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async updateContribute(req, res) {
    try {
      const { _id } = req.body;
      if (!_id) return res.notFound('Không tìm thấy dịch vụ');
      const service = await Services.findOneAndUpdate(
        {
          _id,
          cooperator: req.user._id,
          isContribute: true
        },
        req.body,
        { new: true }
      );
      if (!service) return res.notFound('Không tìm thấy dịch vụ');
      res.success({
        success: true,
        service
      });
    } catch (err) {
      res.error(err);
    }
  }

  async deleteContribute(req, res) {
    try {
      const { id } = req.params;
      await Services.findByIdAndDelete(id);
      res.deleted();
    } catch (err) {
      res.error(err);
    }
  }

  async getByProvince(req, res) {
    try {
      const { id } = req.params;
      // console.log(offset);
      const services = await Services.find({ province: id })
        .populate('cooperator', 'fullname avatar')
        .populate('province', 'name fullname');
      res.success({
        success: true,
        message: 'get info all Service success',
        services
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async myShare(req, res) {
    try {
      const services = await Services.find({
        cooperator: req.user?._id,
        isContribute: true
      }).populate('province', 'name fullname');

      res.success({
        success: true,
        services
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getListReview(req, res) {
    try {
      const { list } = req.body;
      if (!list?.length) return res.errorClient();
      const reviews = await ServiceRates.find({
        _id: {
          $in: list
        }
      })
        .populate('userId', 'avatar fullname name')
        .populate('service', 'name image');

      res.success({
        success: true,
        reviews
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new ServiceController();
