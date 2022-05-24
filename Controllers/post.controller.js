const Posts = require('../Models/post.model');
const Comments = require('../Models/comment.model');
const TourDates = require('../Models/tourDate.model');
const Locations = require('../Models/location.model');
const LocationsRate = require('../Models/locationsRate.model');
const LocationUser = require('../Models/locationUser.model');
const {
  createItem,
  shareItem,
  reviewItem,
  likeItem,
  unLikeItem,
  viewDetailItem,
  getPostRecommend,
  updatePropsItem
  // deleteItem
} = require('../utils/recombee');
const { shuffle } = require('../utils/utils');

const ObjectId = require('mongoose').Types.ObjectId;

class PostController {
  //co hai loai post
  async createPost(req, res) {
    try {
      const { content, images, hashtags, isPublic } = req.body;

      const newPost = new Posts({
        userId: req.user._id,
        content,
        images,
        hashtags,
        isPublic
      });
      await newPost.save();
      res.created({
        success: true,
        message: 'Tạo bài viết thành công',
        newPost: {
          ...newPost._doc,
          userId: {
            fullname: req.user.fullname,
            _id: req.user._id,
            avatar: req.user.avatar,
            followers: req.user.followers
          }
        }
      });

      if (isPublic) createItem(newPost._doc._id, 'post', hashtags, content);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async sharePost(req, res) {
    try {
      const { content, hashtags, shareId } = req.body;

      const newPost = new Posts({
        userId: req.user._id,
        content,
        hashtags,
        shareId
      });

      await newPost.save();

      const share = await Posts.findById(shareId).populate(
        'userId',
        'username fullname avatar'
      );

      res.created({
        success: true,
        message: 'Chia sẻ thành công!',
        newPost: {
          ...newPost._doc,
          userId: {
            _id: req.user._id,
            username: req.user.username,
            fullname: req.user.fullname,
            avatar: req.user.avatar
          },
          shareId: share
        }
      });

      shareItem(req.user._id, shareId);
    } catch (err) {
      res.error(err);
    }
  }

  async createReview(req, res) {
    try {
      const { locationId, rate, tourDateId, indexLocation, hashtags, content } =
        req.body;
      if (!locationId) {
        return res.errorClient('Thiếu thông tin địa điểm');
      }
      let isPostReview = true;
      const newPost = new Posts({
        userId: req.user._id,
        isPostReview,
        ...req.body
      });
      await newPost.save();

      res.created({
        success: true,
        message: 'Create review successful',
        newPost: {
          ...newPost._doc,
          userId: {
            _id: req.user._id,
            fullname: req.user.fullname,
            avatar: req.user.avatar,
            followers: req.user.followers
          }
        }
      });

      const newLocationUser = new LocationUser({
        user: req.user._id,
        review: newPost._doc._id
      });
      await newLocationUser.save();

      if (tourDateId) {
        await TourDates.findOneAndUpdate(
          {
            _id: tourDateId,
            locations: { $elemMatch: { _id: indexLocation } }
          },
          {
            $push: {
              'locations.$.postId': newPost._doc._id
            }
          },
          { new: true, safe: true, upsert: true }
        );
      }
      let location = null;
      if (rate) {
        switch (parseInt(rate)) {
          case 1:
            location = await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.0': 1 }
              },
              { new: true }
            );
            break;
          case 2:
            location = await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.1': 1 }
              },
              { new: true }
            );
            break;
          case 3:
            location = await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.2': 1 }
              },
              { new: true }
            );
            break;
          case 4:
            location = await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.3': 1 }
              },
              { new: true }
            );
            break;
          case 5:
            location = await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.4': 1 }
              },
              { new: true }
            );
            break;
          default:
            break;
        }
        const rateLoc = new LocationsRate({
          location_id: locationId,
          user_id: req.user._id,
          rate: parseInt(rate)
        });
        await rateLoc.save();
        reviewItem(req.user._id, locationId, rate);
        let cat = [];
        if (hashtags) cat = [...hashtags];
        if (location) cat = [...cat, location.fullname];
        createItem(newPost._doc._id, 'post', cat, content);
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async updatePost(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy bài viết');
        return;
      }
      const { content, images, rate, hashtags, oldRate, locationId, isPublic } =
        req.body;
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        {
          content,
          images,
          rate,
          hashtags,
          isPublic
        },
        { new: true }
      )
        .populate('userId likes', 'username fullname avatar')
        .populate('locationId', 'name fullname')
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
            path: 'locationId',
            select: 'name fullname'
          }
        });
      res.success({ success: true, message: 'update post successful', post });

      let cat = [...post.hashtags];
      if (post.locationId) cat = [...cat, post.locationId.fullname];

      updatePropsItem(req.params.id, 'post', post.hashtags, post.content);

      if (rate && parseInt(rate) !== parseInt(oldRate)) {
        switch (parseInt(oldRate)) {
          case 1:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.0': -1 }
              },
              { new: true }
            );
            break;
          case 2:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.1': -1 }
              },
              { new: true }
            );
            break;
          case 3:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.2': -1 }
              },
              { new: true }
            );
            break;
          case 4:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.3': -1 }
              },
              { new: true }
            );
            break;
          case 5:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.4': -1 }
              },
              { new: true }
            );
            break;
          default:
            break;
        }

        switch (parseInt(rate)) {
          case 1:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.0': 1 }
              },
              { new: true }
            );
            break;
          case 2:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.1': 1 }
              },
              { new: true }
            );
            break;
          case 3:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.2': 1 }
              },
              { new: true }
            );
            break;
          case 4:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.3': 1 }
              },
              { new: true }
            );
            break;
          case 5:
            await Locations.findByIdAndUpdate(
              locationId,
              {
                $inc: { 'star.4': 1 }
              },
              { new: true }
            );
            break;
          default:
            break;
        }

        const locationRate = new LocationsRate({
          location_id: locationId,
          user_id: req.user._id,
          rate: parseInt(rate)
        });

        await locationRate.save();
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }
  //lấy pots của 1 user cụ thể (params.id)
  async getUserPost(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy user');
        return;
      }
      const { offset } = req.query;

      const query = { userId: req.params.id };
      if (!req.user || req.user._id !== req.params.id) {
        query.isPublic = true;
      }
      // console.log(offset);
      const posts = await Posts.find(query)
        .skip(offset * 5)
        .limit(5)
        .sort('-createdAt')
        .populate('userId likes', 'username fullname avatar')
        .populate('locationId', 'name fullname')
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
            path: 'locationId',
            select: 'name fullname'
          }
        });

      res.success({
        success: true,
        message: 'get user post successful',
        posts
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  //lấy nhiều post gắn lên trang feed theo người mình theo dõi  hoặc  group
  async getPosts(req, res) {
    try {
      let postId = await Posts.find(
        {
          userId: {
            $in: req.user.followings
          },
          isPublic: true
        },
        { _id: 1 }
      )
        .limit(80)
        .sort({ createdAt: -1 });

      postId = postId.map(item => item._id);

      let postRecommendId = await getPostRecommend(req.user._id, 20);
      console.log('RECOMMEND:', postRecommendId);
      if (postRecommendId) {
        postRecommendId = postRecommendId.recomms.map(item => item.id);
        postId = postId.concat(
          postRecommendId.filter(item => postId.indexOf(item) < 0)
        );
      }

      postId = shuffle(postId);
      var currentPostId = postId.slice(0, 10);
      postId = postId.slice(10);

      const posts = await Posts.find({
        _id: {
          $in: currentPostId
        }
      })
        .populate('userId likes', 'username fullname avatar')
        .populate('locationId', 'name fullname')
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
            path: 'locationId',
            select: 'name fullname'
          }
        })
        .sort({ createdAt: -1 });

      res.success({
        success: true,
        message: 'Lấy danh sách bài viết thành công',
        posts,
        postId
      });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  // lấy thông tin 1 post theo params.id
  async getPost(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy bài viết');
        return;
      }
      const post = await Posts.findById(req.params.id)
        .populate('userId likes', 'username fullname avatar')
        .populate('locationId', 'name fullname')
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
            path: 'locationId',
            select: 'name fullname'
          }
        });
      if (post && (post.isPublic || req?.user._id === post.userId._id)) {
        res.success({
          success: true,
          message: 'get info 1 post success',
          post
        });
        if (req?.user._id !== 0) {
          viewDetailItem(req.user._id, req.params.id);
        }
      } else {
        res.notFound('Không tìm thấy bài viết');
      }
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  //A(user._id) like post B(params.id)
  async likePost(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy bài viết');
        return;
      }
      // var post = await Posts.find({ _id: req.params.id, likes: req.user._id });
      // if (post.length > 0) {
      //     return res.status(400).json({ success: false, message: "You liked this post." })
      // }

      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $addToSet: {
            likes: req.user._id
          }
        },
        { new: true }
      ).populate('likes', 'username fullname avatar');

      res.success({
        success: true,
        message: 'like post success',
        likes: post.likes,
        post
      });

      likeItem(req.user._id, req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }
  //A(user._id) unlike post B(params.id)
  async unlikePost(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy bài viết');
        return;
      }
      const post = await Posts.findByIdAndUpdate(
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
        message: 'unlike post success',
        likes: post.likes,
        post
      });

      unLikeItem(req.user._id, req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async deletePost(req, res) {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        res.notFound('Không tìm thấy bài viết');
        return;
      }
      const post = await Posts.findById(req.params.id);

      if (!post) return res.notFound('Không tìm thấy bài viết');

      await Posts.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });
      if (post.comments)
        await Comments.deleteMany({ _id: { $in: post.comments } });

      if (post.rate) {
        switch (parseInt(post.rate)) {
          case 1:
            await Locations.findByIdAndUpdate(
              post.locationId,
              {
                $inc: { 'star.0': -1 }
              },
              { new: true }
            );
            break;
          case 2:
            await Locations.findByIdAndUpdate(
              post.locationId,
              {
                $inc: { 'star.1': -1 }
              },
              { new: true }
            );
            break;
          case 3:
            await Locations.findByIdAndUpdate(
              post.locationId,
              {
                $inc: { 'star.2': -1 }
              },
              { new: true }
            );
            break;
          case 4:
            await Locations.findByIdAndUpdate(
              post.locationId,
              {
                $inc: { 'star.3': -1 }
              },
              { new: true }
            );
            break;
          case 5:
            await Locations.findByIdAndUpdate(
              post.locationId,
              {
                $inc: { 'star.4': -1 }
              },
              { new: true }
            );
            break;
          default:
            break;
        }
      }

      res.deleted();

      // deleteItem(req.params.id);
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async search(req, res) {
    try {
      var { q, offset } = req.query;
      offset = offset || 0;
      var posts = await Posts.find(
        { $text: { $search: q }, isPublic: true },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .skip(offset * 10)
        .limit(10)
        .populate('userId', 'avatar fullname');
      posts = posts.map(item => ({
        _id: item._id,
        fullname: `Bài viết của ${item.userId.fullname}`,
        link: `/post/${item._id}`,
        description: item.content,
        image: item.userId.avatar
      }));
      res.success({ success: true, results: posts, query: q });
    } catch (err) {
      res.error(err);
    }
  }

  async postList(req, res) {
    try {
      let { list } = req.body;
      let { offset, detail, limit } = req.query;
      offset = offset || 0;
      detail = detail || false;
      limit = limit || 0;

      list = list.map(item => ObjectId(item));

      let posts;

      if (detail) {
        posts = await Posts.find({
          _id: {
            $in: list
          },
          isPublic: true
        })
          .skip(offset)
          .limit(limit)
          .populate('userId likes', 'username fullname avatar')
          .populate('locationId', 'name fullname')
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
              path: 'locationId',
              select: 'name fullname'
            }
          })
          .sort({ createdAt: -1 });
      } else {
        posts = await Posts.find(
          {
            _id: {
              $in: list
            }
          },
          '-comments -likes'
        )
          .populate('userId', 'username fullname avatar')
          .sort({ createdAt: -1 });
      }

      res.success({ success: true, posts });
    } catch (err) {
      console.log(err);
      res.error(err);
    }
  }

  async getAll(req, res) {
    try {
      const posts = await Posts.find(
        {},
        { _id: 1, createdAt: 1, isPostReview: 1 }
      );
      res.success({
        success: true,
        posts
      });
    } catch (err) {
      res.error(err);
    }
  }

  async getByHashtags(req, res) {
    try {
      let { hashtag, limit, page } = req.query;
      limit = parseInt(limit) || 5;
      page = parseInt(page) || 0;
      if (!hashtag) return res.errorClient('Thiếu hashtags');
      const posts = await Posts.find({ hashtags: hashtag })
        .skip(page)
        .limit(limit)
        .populate('userId likes', 'username fullname avatar')
        .populate('locationId', 'name fullname')
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
            path: 'locationId',
            select: 'name fullname'
          }
        });

      res.success({
        success: true,
        posts
      });
    } catch (err) {
      res.error(err);
    }
  }
}

module.exports = new PostController();
