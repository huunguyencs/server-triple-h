const Locations = require('../Models/location.model');
const LocationsRate = require('../Models/locationsRate.model');
const Posts = require('../Models/post.model');
const Provinces = require('../Models/province.model');
const {
  createItem,
  viewDetailItem,
  getLocationRecommend,
  updatePropsItem
  // deleteItem
} = require('../utils/recombee');

const ObjectId = require('mongoose').Types.ObjectId;

class LocationController {
  async createLocation(req, res) {
    try {
      const { name, images, province, position, information, fullname } =
        req.body;

      const pro = await Provinces.findById(province).select('fullname');
      if (pro) {
        const province_name = pro.fullname;
        const newLocation = new Locations({
          name,
          images,
          province,
          position,
          information,
          fullname,
          province_name
        });
        await newLocation.save();

        res.created({
          success: true,
          message: 'Create Location successful',
          newLocation: {
            ...newLocation._doc
          }
        });

        createItem(
          newLocation._doc._id,
          'location',
          [province_name, fullname],
          information
        );
      } else {
        res.notFound('Không tìm thấy tỉnh!');
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async updateLocation(req, res) {
    try {
      const { id } = req.params;

      if (!ObjectId.isValid(id)) {
        res.notFound('Không tìm thấy địa điểm');
        return;
      }

      const { information } = req.body;

      const location = await Locations.findByIdAndUpdate(id, req.body, {
        new: true
      }).populate('province', 'name fullname');

      res.success({
        success: true,
        message: 'update Location successful',
        location
      });

      updatePropsItem(
        id,
        'location',
        [location.province_name, location.fullname],
        information
      );
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async deleteLocation(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy địa điểm');
        return;
      }
      const location = await Locations.findByIdAndDelete(req.params.id);
      if (location.posts)
        await Posts.deleteMany({ _id: { $in: location.posts } });

      res.deleted();

      // deleteItem(req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  // lấy thông tin 1 Location theo name
  async getLocation(req, res) {
    try {
      const location = await Locations.findOne({
        name: req.params.name
      }).populate('province', 'name fullname image');
      if (location) {
        res.success({
          success: true,
          message: 'get info 1 Location success',
          location
        });
      } else {
        res.notFound('Không tìm thấy địa điểm!');
      }

      if (req.user && req.user._id !== 0) {
        viewDetailItem(req.user._id, location._id);
      }
    } catch (err) {
      res.error(err);
    }
  }

  async getPosts(req, res) {
    try {
      const { offset } = req.query;
      const posts = await Posts.find({
        isPostReview: true,
        locationId: req.params.id
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .skip(offset)
        .populate('userId likes', 'username fullname avatar')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId likes',
            select: 'username fullname avatar'
          }
        })
        .populate('locationId', 'name fullname');
      res.success({ success: true, message: 'successful', posts });
    } catch (err) {
      res.error(err);
    }
  }

  //Get Location at a province
  async getLocations(req, res) {
    try {
      const locations = await Locations.find(
        { province: req.params.province },
        'images fullname name position'
      ).populate('province', 'fullname name');
      res.success({
        success: true,
        message: 'get locations success',
        locations
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getHotLocations(req, res) {
    try {
      const THIRTY_DAY_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const hot = await LocationsRate.aggregate([
        {
          $match: {
            createdAt: {
              $gte: THIRTY_DAY_AGO
            }
          }
        },
        {
          $addFields: {
            trendScore: {
              $divide: [
                { $multiply: ['$rate', 1000] },
                { $subtract: [new Date(), '$createdAt'] }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$location_id',
            totalScore: {
              $sum: '$trendScore'
            }
          }
        },
        {
          $lookup: {
            from: 'locations',
            localField: '_id',
            foreignField: '_id',
            as: 'location'
          }
        },
        {
          $sort: {
            totalScore: -1
          }
        },
        {
          $limit: 10
        }
      ]);
      res.success({
        success: true,
        message: 'success',
        hot
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getAll(req, res) {
    try {
      let { limit, page, name, province, isContribute } = req.query;
      limit = parseInt(limit) || 10;
      page = parseInt(page) || 0;
      
      console.log('COntribute', isContribute)
      const where = {};
      if (name) where.name = name;
      if (province) where.province = province;
      if (isContribute && isContribute === 'true') where.isContribute = true;

      const locations = await Locations.find(where)
        .skip(limit * page)
        .limit(limit)
        .select('fullname name province position images star')
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

  async search(req, res) {
    try {
      var { q, offset } = req.query;
      offset = offset || 0;
      var locations = await Locations.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(20)
        .skip(offset * 20);

      locations = locations.map(item => ({
        _id: item._id,
        fullname: item.fullname,
        link: `/location/${item.name}`,
        description: item.information,
        image: item.images[0],
        score: item._doc.score
      }));

      res.success({ success: true, results: locations, query: q });
    } catch (err) {
      res.error(err);
    }
  }

  async getRecommendLocation(req, res) {
    try {
      let locationRecommend = await getLocationRecommend(req.user._id);
      console.log('LOCATION RECOMBEE', locationRecommend);
      if (locationRecommend) {
        locationRecommend = locationRecommend.recomms.map(item => item.id);
        const locations = await Locations.find({
          _id: {
            $in: locationRecommend
          }
        });

        return res.success({
          success: true,
          locations
        });
      }
      res.notFound('Không tìm thấy địa điểm gợi ý');
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new LocationController();
