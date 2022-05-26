const Services = require('../Models/service.model');
const {
  createItem,
  reviewItem,
  viewDetailItem,
  updatePropsItem
  // deleteItem
} = require('../utils/recombee');
// const mongoose = require('mongoose');
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
      // deleteItem(req.params.id);
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

      if (province) where.province = province;
      if (cooperator) where.contribute = cooperator;
      if (name) where.name = name;
      if (isContribute) where.isContribute = isContribute === 'true';

      const services = await Services.find(
        where,
        'name description images star type'
      )
        .skip(page * limit)
        .limit(limit)
        .populate('cooperator', 'fullname avatar')
        .populate('province', 'fullname');
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

  async getServices(req, res) {
    try {
      var { offset } = req.query;
      offset = offset || 0;
      // console.log(offset);
      const services = await Services.find({}, '-rate -attribute')
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
      const services = await Services.find(
        { cooperator: req.params.id },
        '-rate -attribute'
      )
        .populate('province', 'name fullname')
        .populate('cooperator', 'fullname avatar');
      res.success({ success: true, message: '', services });
    } catch (err) {
      res.error(err);
    }
  }

  async getServiceDetail(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy dịch vụ');
        return;
      }
      const service = await Services.findById(
        req.params.id,
        'rate attribute'
      ).populate({
        path: 'rate',
        populate: {
          path: 'userId',
          select: 'name fullname avatar'
        }
      });
      res.success({
        success: true,
        message: '',
        rate: service.rate,
        attribute: service.attribute
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
      const { rate, content, images } = req.body;
      await Services.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            rate: { rate, content, userId: req.user._id, images }
          }
        },
        { new: true }
      );

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

      res.success({ success: true, message: '', star: service.star });

      reviewItem(req.user._id, req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async search(req, res) {
    try {
      var { q, offset } = req.query;
      offset = offset || 0;
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
        }
      ]);

      if (!services) return res.notFound('Không tìm thấy service');
      services = services.map(item => ({
        ...item,
        cooperator: item.cooperator[0]
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
      const service = new Services({
        ...req.body,
        cooperator: req.user._id,
        isContribute: true
      });

      await service.save();

      res.success({
        success: true,
        service: {
          ...service._doc
        }
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getByProvince(req, res) {
    try {
      const { id } = req.params;
      // console.log(offset);
      const services = await Services.find({ province: id }, '-rate -attribute')
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
}

module.exports = new ServiceController();
