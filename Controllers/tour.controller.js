const Tours = require('../Models/tour.model');
const TourDates = require('../Models/tourDate.model');
const Comments = require('../Models/comment.model');
const ToursRate = require('../Models/tourRate.model');
const {
  createItem,
  shareItem,
  likeItem,
  unLikeItem,
  deleteItem,
  joinItem,
  unJoinItem,
  viewDetailItem,
  getTourRecommend,
  getSimilarTour,
  updatePropsItem
} = require('../utils/recombee');

const ObjectId = require('mongoose').Types.ObjectId;

class TourController {
  async createTour(req, res) {
    try {
      const {
        content,
        name,
        taggedIds,
        image,
        hashtags,
        tour,
        provinces,
        locations,
        cost,
        isPublic
      } = req.body;

      const joinIds = [
        {
          id: req.user._id,
          isJoin: true,
          isEdit: true
        }
      ];

      const newTour = new Tours({
        userId: req.user._id,
        content,
        image,
        name,
        taggedIds,
        hashtags,
        provinces,
        joinIds,
        tour: [],
        locations,
        cost,
        isPublic
      });

      await newTour.save();

      if (tour.length > 0) {
        tour.forEach(async function (element) {
          const newTourDate = new TourDates({
            date: element.date,
            events: element.events,
            description: element.description,
            cost: element.cost,
            comments: []
          });
          await newTourDate.save();
          await Tours.findOneAndUpdate(
            { _id: newTour._id },
            {
              $push: {
                tour: newTourDate._id
              }
            }
          );
        });
      }

      res.created({
        success: true,
        message: 'Create Tour successful',
        newTour: {
          ...newTour._doc,
          userId: {
            fullname: req.user.fullname,
            _id: req.user._id,
            avatar: req.user.avatar,
            followers: req.user.followers
          }
        }
      });

      let cat = [...provinces, ...locations];
      if (hashtags) cat = [...cat, ...hashtags];

      if (isPublic) {
        createItem(newTour._doc._id, 'tour', cat, content);
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async shareTour(req, res) {
    try {
      const { content, hashtags, shareId } = req.body;
      const newTour = new Tours({
        userId: req.user._id,
        content,
        hashtags,
        shareId
      });

      await newTour.save();

      const share = await Tours.findById(shareId).populate(
        'userId',
        'username fullname avatar'
      );

      res.created({
        success: true,
        message: 'Chia sẻ thành công!',
        newTour: {
          ...newTour._doc,
          userId: {
            _id: req.user._id,
            username: req.user.username,
            fullname: req.user.fullname,
            avatar: req.user.avatar
          },
          shareId: share
        }
      });

      if (share.isPublic) {
        const tourRate = new ToursRate({
          tour_id: shareId,
          user_id: req.user._id,
          score: 3
        });
        await tourRate.save();
      }

      shareItem(req.user._id, shareId);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  ///
  async updateTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      const {
        content,
        name,
        isPublic,
        image,
        hashtags,
        tour,
        cost,
        provinces,
        locations
      } = req.body;

      const findTour = await Tours.findById(req.params.id);
      const edits = findTour.joinIds
        .filter(item => item.isEdit)
        .map(item => item.id);
      if (!edits.includes(req.user._id.toString()))
        return res.errorClient('Không có quyền');

      const newTour = await Tours.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          image,
          name,
          hashtags,
          isPublic,
          cost,
          provinces,
          locations
        },
        { new: true }
      )
        .populate('userId likes', 'username fullname avatar')
        .populate({
          path: 'joinIds',
          populate: {
            path: 'id',
            select: 'username fullname avatar'
          }
        })
        .populate('tour', 'date')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId likes',
            select: 'username fullname avatar'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'userId',
            select: 'username fullname avatar'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'tour',
            select: 'date'
          }
        });

      if (newTour && tour) {
        const oldTour = newTour.tour.map(item => item._id);
        let tourId = [];
        tour.forEach(item => {
          if (item._id) tourId.push(item._id.toString());
        });
        oldTour.forEach(async function (element) {
          if (!tourId.includes(element.toString())) {
            await Tours.findByIdAndUpdate(req.params.id, {
              $pull: {
                tour: element._id
              }
            });
          }
        });
        tour.forEach(async function (element) {
          if (element._id)
            await TourDates.findByIdAndUpdate(
              element._id,
              {
                date: element.date,
                events: element.events,
                description: element.description
              },
              { new: true }
            );
          else {
            let newTourDate = new TourDates({
              date: element.date,
              events: element.events
            });
            await newTourDate.save();
            await Tours.findByIdAndUpdate(req.params.id, {
              $push: {
                tour: newTourDate._id
              }
            });
          }
        });

        let cat = [...provinces, ...locations];
        if (hashtags) cat = [...cat, ...hashtags];

        res.success({
          success: true,
          message: 'update tour successful',
          newTour
        });

        updatePropsItem(req.params.id, 'tour', cat, content);
      } else {
        res.notFound('Không tìm thấy tour');
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  //A(user._id) like tour B(params.id)
  async likeTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.notFound('Không tìm thấy tour');
      }
      // var tour = await Tours.findOne({ _id: req.params.id, likes: req.user._id });
      // if (tour) {
      //     return res.status(400).json({ success: false, message: "You liked this tour." })
      // }

      const tour = await Tours.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: {
            likes: req.user._id
          }
        },
        { new: true }
      ).populate('likes', 'username fullname avatar');

      res.success({
        success: true,
        message: 'like tour success',
        likes: tour.likes,
        tour
      });

      if (!tour.shareId && tour.isPublic) {
        const tourRate = new ToursRate({
          tour_id: req.params.id,
          user_id: req.user._id,
          score: 2
        });

        await tourRate.save();
      }

      likeItem(req.user._id, req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  //A(user._id) unlike tour B(params.id)
  async unlikeTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      const tour = await Tours.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            likes: req.user._id
          }
        },
        { new: true }
      ).populate('likes', 'username fullname avatar');

      res.success({
        success: true,
        message: 'unlike tour success',
        likes: tour.likes
      });
      unLikeItem(req.user._id, req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async deleteTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      const tour = await Tours.findById(req.params.id);
      if (tour) {
        await Tours.findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id
        });
        if (tour.comments)
          await Comments.deleteMany({ _id: { $in: tour.comments } });
        if (tour.tour) await TourDates.deleteMany({ _id: { $in: tour.tour } });
        if (tour.tour) {
          tour.tour.forEach(item => async () => {
            if (item.comments.length > 0)
              await Comments.deleteMany({ _id: { $in: item.comments } });
          });
        }
        res.deleted();
      } else {
        res.notFound('Không tìm thấy tour');
      }
      try {
        deleteItem(req.params.id);
      } catch (err) {}
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getTours(req, res) {
    try {
      var { offset, maxCost, minCost, q } = req.query;
      offset = offset ? parseInt(offset) : 0;
      maxCost = maxCost ? parseInt(maxCost) : null;
      minCost = minCost ? parseInt(minCost) : null;
      var query = {};
      var sort = '-createdAt';
      var score = {};

      if (maxCost && maxCost < 1000) {
        query = {
          cost: {
            $lte: maxCost
          }
        };
      }
      if (minCost && minCost > 0) {
        query = {
          ...query,
          cost: {
            ...query.cost,
            $gte: minCost
          }
        };
      }
      if (q) {
        query = {
          ...query,
          $text: {
            $search: q
          }
        };
        sort = { score: { $meta: 'textScore' } };
        score = sort;
      }
      query = {
        ...query,
        isPublic: true
      };

      const tours = await Tours.find(query, score)
        .sort(sort)
        .skip(offset * 5)
        .limit(5)
        .populate('userId likes', 'username fullname avatar')
        .populate({
          path: 'joinIds',
          populate: {
            path: 'id',
            select: 'username fullname avatar'
          }
        })
        .populate('tour', 'date')
        .populate({
          path: 'shareId',
          populate: {
            path: 'userId',
            select: 'username fullname avatar'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'tour',
            select: 'date'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'joinIds',
            populate: {
              path: 'id',
              select: 'username fullname avatar'
            }
          }
        });

      res.success({ success: true, message: 'get tours successful', tours });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  //lấy tours của 1 user cụ thể (params.id)
  async getUserTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy user');
        return;
      }
      var { offset } = req.query;
      offset = offset || 0;

      const query = {
        userId: req.params.id
      };
      if (!req.user || req.user._id.toString() !== req.params.id) {
        query.isPublic = true;
      }
      const tours = await Tours.find(query)
        .sort('-createdAt')
        .skip(offset * 5)
        .limit(5)
        .populate('userId likes', 'username fullname avatar')
        .populate({
          path: 'joinIds',
          populate: {
            path: 'id',
            select: 'username fullname avatar'
          }
        })
        .populate('tour', 'date')
        .populate({
          path: 'comments',
          populate: {
            path: 'userId likes',
            select: 'username fullname avatar'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'userId',
            select: 'username fullname avatar'
          }
        });

      res.success({
        success: true,
        message: 'get user tour successful',
        tours
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  // lấy thông tin 1 tour theo params.id
  async getTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }

      // console.log(req.params.id)
      let tour = await Tours.findById(req.params.id);
      if (!tour) return res.notFound('Không tìm thấy tour');
      const isInvite = tour.joinIds.map(item => item.id?.toString());
      console.log(isInvite);
      if (!tour.isPublic && !isInvite.includes(req.user._id.toString())) {
        return res.notFound('Không tìm thấy tour');
      }
      let requestId;
      if (tour.shareId) {
        requestId = tour.shareId;
      } else requestId = tour._id;

      tour = await Tours.findById(requestId)
        .populate('tour')
        .populate({
          path: 'tour',
          populate: {
            path: 'events',
            populate: {
              path: 'location',
              select: 'name images fullname position',
              populate: {
                path: 'province',
                select: 'name fullname'
              }
            }
          }
        })
        .populate({
          path: 'tour',
          populate: {
            path: 'events',
            populate: {
              path: 'service',
              select: 'name images position'
            }
          }
        })
        .populate({
          path: 'tour',
          populate: {
            path: 'comments',
            populate: {
              path: 'userId likes',
              select: 'fullname avatar'
            }
          }
        })
        .populate('userId likes', 'fullname avatar')
        .populate({
          path: 'joinIds',
          populate: {
            path: 'id',
            select: 'fullname avatar email'
          }
        })
        .populate({
          path: 'comments',
          populate: {
            path: 'userId likes',
            select: 'fullname avatar'
          }
        });

      res.success({
        success: true,
        message: 'get info 1 tour success',
        tour
      });

      if (req.user && req.user._id !== 0) {
        viewDetailItem(req.user._id, req.params.id);
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async inviteJoinTour(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }

      const users = req.body;

      let usersTemp = users.map(item => ({
        id: item.id._id,
        isJoin: false,
        isEdit: item.isEdit
      }));

      var tour = await Tours.find({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!tour) {
        res.notFound('Không tìm thấy tour');
        return;
      }

      tour = await Tours.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            joinIds: { $each: usersTemp }
          }
        },
        { new: true }
      ).populate({
        path: 'joinIds',
        populate: {
          path: 'id',
          select: 'username fullname avatar'
        }
      });

      res.success({
        success: true,
        message: 'join tour success',
        tour: tour
      });
    } catch (err) {
      res.error(err);
    }
  }

  async removeMember(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      let tour = await Tours.find({
        _id: req.params.id,
        userId: req.user._id
      });
      if (!tour) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      const { id } = req.body;

      tour = await Tours.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            joinIds: { id: id }
          }
        },
        { new: true }
      ).populate({
        path: 'joinIds',
        populate: {
          path: 'id',
          select: 'username fullname avatar'
        }
      });

      res.success({
        success: true,
        message: 'remove user success',
        tour: tour
      });
      // unJoinItem(user, req.params.id);
    } catch (err) {
      res.error(err);
    }
  }

  async changeIsEditJoin(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      let tour = await Tours.find({
        _id: req.params.id,
        userId: req.user._id
      });
      if (!tour) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      const { id, isEdit } = req.body;
      tour = await Tours.findOneAndUpdate(
        {
          _id: req.params.id,
          joinIds: { $elemMatch: { id: id } }
        },
        {
          $set: {
            'joinIds.$.isEdit': isEdit
          }
        },
        { new: true }
      ).populate({
        path: 'joinIds',
        populate: {
          path: 'id',
          select: 'username fullname avatar'
        }
      });

      res.success({
        success: true,
        message: 'change user success'
      });
      // unJoinItem(user, req.params.id);
    } catch (err) {
      res.error(err);
    }
  }

  async acceptInviteJoin(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      let tour = await Tours.findById(req.params.id);

      tour = await Tours.findOneAndUpdate(
        {
          _id: req.params.id,
          joinIds: { $elemMatch: { id: req.user._id } }
        },
        {
          $set: {
            'joinIds.$.isJoin': true
          }
        },
        { new: true }
      ).populate({
        path: 'joinIds',
        populate: {
          path: 'id',
          select: 'username fullname avatar'
        }
      });

      res.success({
        success: true,
        message: 'accept user success',
        joinIds: tour.joinIds
      });

      if (tour.isPublic) {
        const tourRate = new ToursRate({
          tour_id: req.params.id,
          user_id: req.user._id,
          score: 2
        });

        await tourRate.save();
      }

      joinItem(req.user._id, req.params.id);
    } catch (err) {
      res.error(err);
    }
  }

  async unAcceptInviteJoin(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      let tour = await Tours.findById(req.params.id);

      tour = await Tours.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            joinIds: { id: req.user._id }
          }
        },
        { new: true }
      ).populate({
        path: 'joinIds',
        populate: {
          path: 'id',
          select: 'username fullname avatar'
        }
      });

      res.success({
        success: true,
        message: 'unAccept success',
        joinIds: tour.joinIds
      });
      // unJoinItem(user, req.params.id);
    } catch (err) {
      res.error(err);
    }
  }

  async removeReview(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy tour');
        return;
      }
      const { locationId } = req.body;
      const { reviewId } = req.query;

      await TourDates.findOneAndUpdate(
        { _id: req.params.id, locations: { $elemMatch: { _id: locationId } } },
        {
          $pull: {
            'locations.$.postId': reviewId
          }
        },
        { new: true, safe: true, upsert: true }
      );

      res.success({
        success: true,
        message: 'Xóa review thành công'
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  // async joinLocation(req, res) {
  //   try {
  //     const { id } = req.params;
  //     if (!ObjectId.isValid(id)) {
  //       res.notFound('Không tìm thấy tour');
  //       return;
  //     }
  //     const { locationId } = req.body;
  //     const tour = await TourDates.findOneAndUpdate(
  //       { _id: id, locations: { $elemMatch: { _id: locationId } } },
  //       {
  //         $addToSet: {
  //           'locations.$.joinIds': req.user._id
  //         }
  //       }
  //     );

  //     if (!tour) return res.notFound();

  //     if (tour.isPublic) {
  //       const tourRate = new ToursRate({
  //         tour_id: id,
  //         user_id: req.user._id,
  //         type: 4
  //       });

  //       await tourRate.save();
  //     }

  //     res.success({
  //       success: true,
  //       message: 'Tham gia thành công'
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.error(err);
  //   }
  // }

  // async unjoinLocation(req, res) {
  //   try {
  //     const { id } = req.params;
  //     if (!ObjectId.isValid(id)) {
  //       res.notFound('Không tìm thấy tour');
  //       return;
  //     }
  //     const { locationId } = req.body;
  //     await TourDates.findOneAndUpdate(
  //       { _id: id, locations: { $elemMatch: { _id: locationId } } },
  //       {
  //         $pull: {
  //           'locations.$.joinIds': req.user._id
  //         }
  //       }
  //     );
  //     res.success({
  //       success: true,
  //       message: 'Bỏ tham gia thành công'
  //     });
  //   } catch (err) {
  //     res.error(err);
  //   }
  // }

  // async removeJoinLocation(req, res) {
  //   try {
  //     const { id } = req.params;
  //     if (!ObjectId.isValid(id)) {
  //       res.notFound('Không tìm thấy tour');
  //       return;
  //     }
  //     const { locationId, userId } = req.body;
  //     await TourDates.findOneAndUpdate(
  //       { _id: id, locations: { $elemMatch: { _id: locationId } } },
  //       {
  //         $pull: {
  //           'locations.$.joinIds': userId
  //         }
  //       }
  //     );
  //     res.success({
  //       success: true,
  //       message: 'Loại thành công'
  //     });
  //   } catch (err) {
  //     res.error(err);
  //   }
  // }

  async search(req, res) {
    try {
      var { q, offset } = req.query;
      offset = offset || 0;
      var tours = await Tours.find(
        { $text: { $search: q }, isPublic: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .skip(offset * 10)
        .limit(10)
        .populate('userId', 'avatar fullname');
      tours = tours.map(item => ({
        _id: item._id,
        fullname: `Hành trình của ${item.userId.fullname}`,
        link: `/tour/${item._id}`,
        description: item.name,
        image: item.userId.avatar
      }));
      res.success({ success: true, results: tours, query: q });
    } catch (err) {
      res.error(err);
    }
  }

  async tourHot(req, res) {
    try {
      const THIRTY_DAY_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      var tours = await ToursRate.aggregate([
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
                { $multiply: ['$score', 1000] },
                { $subtract: [new Date(), '$createdAt'] }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$tour_id',
            totalScore: {
              $sum: '$trendScore'
            }
          }
        },
        {
          $lookup: {
            from: 'tours',
            localField: '_id',
            foreignField: '_id',
            as: 'tour'
          }
        },
        {
          $unwind: '$tour'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tour.userId',
            foreignField: '_id',
            as: 'tour.userId',
            pipeline: [
              {
                $project: { fullname: 1, avatar: 1 }
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tour.joinIds',
            foreignField: '_id',
            as: 'tour.joinIds',
            pipeline: [
              {
                $project: { fullname: 1, avatar: 1 }
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'tour.likes',
            foreignField: '_id',
            as: 'tour.likes',
            pipeline: [
              {
                $project: { fullname: 1, avatar: 1 }
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'tour_dates',
            localField: 'tour.tour',
            foreignField: '_id',
            as: 'tour.tour',
            pipeline: [
              {
                $project: { date: 1 }
              }
            ]
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
      // console.log("tours",tours)
      tours = tours
        .filter(item => item.tour.isPublic)
        .map(tour => ({
          ...tour.tour,
          userId: tour.tour.userId[0]
        }));

      res.success({
        success: true,
        tours
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getTourRecommend(req, res) {
    try {
      let tourRecommendId = await getTourRecommend(req.user._id, 10);
      if (tourRecommendId) {
        tourRecommendId = tourRecommendId.recomms.map(item => item.id);
        const tours = await Tours.find({
          _id: {
            $in: tourRecommendId
          },
          isPublic: true
        })
          .populate('userId joinIds likes', 'username fullname avatar')
          .populate('tour', 'date')
          .populate({
            path: 'shareId',
            populate: {
              path: 'userId',
              select: 'username fullname avatar'
            }
          })
          .populate({
            path: 'shareId',
            populate: {
              path: 'tour',
              select: 'date'
            }
          })
          .populate({
            path: 'shareId',
            populate: {
              path: 'joinIds',
              populate: {
                path: 'id',
                select: 'username fullname avatar'
              }
            }
          });
        return res.success({
          success: true,
          tours
        });
      }
      res.notFound('Không tìm thấy tour gợi ý');
    } catch (err) {
      res.error(err);
    }
  }

  async getSimilar(req, res) {
    try {
      let { limit } = req.query;
      limit = parseInt(limit) || 3;
      let tourSimilar = await getSimilarTour(
        req.params.id,
        req.user._id,
        limit
      );
      console.log(tourSimilar);
      if (tourSimilar) {
        tourSimilar = tourSimilar.recomms.map(item => item.id);
        // console.log("tourSimilar",tourSimilar)
        const tours = await Tours.find({
          _id: { $in: tourSimilar },
          isPublic: true
        })
          // .select('name image content cost provinces locations');
          .populate('userId likes', 'username fullname avatar')
          .populate({
            path: 'joinIds',
            populate: {
              path: 'id',
              select: 'username fullname avatar'
            }
          });
        // console.log("tours",tours)
        return res.success({
          success: true,
          tours
        });
      }
      res.notFound('Không tìm thấy tour tương tự');
    } catch (err) {
      res.error(err);
    }
  }

  async searchTourHot(req, res) {
    try {
      let { q, max, min } = req.query;
      // console.log("q",q,"max",max,"min",min)
      max = max ? parseInt(max) : null;
      min = min ? parseInt(min) : null;
      var query = {};
      var sort = '-createdAt';
      var score = {};

      if (max && max < 1000) {
        query = {
          cost: {
            $lte: max
          }
        };
      }
      if (min && min > 0) {
        query = {
          ...query,
          cost: {
            ...query.cost,
            $gte: min
          }
        };
      }
      if (q) {
        query = {
          ...query,
          $text: {
            $search: q
          }
        };
        sort = { score: { $meta: 'textScore' } };
        score = sort;
      }
      query = {
        ...query,
        isPublic: true
      };

      let tours = await Tours.find(query, score)
        .sort(sort)
        .populate('userId likes', 'username fullname avatar')
        .populate({
          path: 'joinIds',
          populate: {
            path: 'id',
            select: 'username fullname avatar'
          }
        })
        .populate('tour', 'date')
        .populate({
          path: 'shareId',
          populate: {
            path: 'userId',
            select: 'username fullname avatar'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'tour',
            select: 'date'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'joinIds',
            populate: {
              path: 'id',
              select: 'username fullname avatar'
            }
          }
        });

      const THIRTY_DAY_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      let hot = await ToursRate.aggregate([
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
                { $multiply: ['$score', 1000] },
                { $subtract: [new Date(), '$createdAt'] }
              ]
            }
          }
        },
        {
          $group: {
            _id: '$tour_id',
            totalScore: {
              $sum: '$trendScore'
            }
          }
        },
        {
          $limit: 30
        }
      ]);

      hot = hot.map(item => item._id.toString());

      tours = tours.filter(item => hot.includes(item._id.toString()));
      res.success({
        success: true,
        tours
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getTourHashtag(req, res) {
    try {
      let { hashtag, limit, page } = req.query;
      if (!hashtag) return res.errorClient('Thiếu hashtag');
      limit = parseInt(limit) || 5;
      page = parseInt(page) || 0;
      const tours = await Tours.find({ hashtags: hashtag })
        .skip(page)
        .limit(limit)
        .populate('userId likes', 'username fullname avatar')
        .populate({
          path: 'joinIds',
          populate: {
            path: 'id',
            select: 'username fullname avatar'
          }
        })
        .populate('tour', 'date')
        .populate({
          path: 'shareId',
          populate: {
            path: 'userId',
            select: 'username fullname avatar'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'tour',
            select: 'date'
          }
        })
        .populate({
          path: 'shareId',
          populate: {
            path: 'joinIds',
            populate: {
              path: 'id',
              select: 'username fullname avatar'
            }
          }
        });

      res.success({
        success: true,
        tours
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }
}

module.exports = new TourController();
