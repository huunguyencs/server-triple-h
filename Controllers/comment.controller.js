const Comments = require('../Models/comment.model')
const Posts = require('../Models/post.model')
const Tours = require('../Models/tour.model')
const Volunteers = require('../Models/volunteer.model');
const { commentItem } = require('../utils/recombee');
class CommentController {
    async createComment(req, res) {
        try {
            const { commentType, content, postId, tourId, volunteerId } = req.body;

            const newComment = new Comments({
                userId: req.user._id, content, commentType
            })

            await newComment.save()

            switch (commentType) {
                case "post":
                    const post = await Posts.findById(postId);
                    if (!post) {
                        return res.status(400).json({ success: false, message: "This post is not exist." })
                    }

                    await Posts.findOneAndUpdate({ _id: postId }, {
                        $push: {
                            comments: newComment._id
                        }
                    });
                    break;

                case "tour":
                    const tour = await Tours.findById(tourId);
                    if (!tour) {
                        return res.status(400).json({ success: false, message: "This tour is not exist." })
                    }

                    await Tours.findOneAndUpdate({ _id: tourId }, {
                        $push: {
                            comments: newComment._id
                        }
                    })
                    break;

                case "volunteer":
                    const volunteer = await Volunteers.findById(volunteerId);
                    if (!volunteer) {
                        return res.status(400).json({ success: false, message: "This volunteer is not exist." })
                    }

                    await Volunteers.findOneAndUpdate({ _id: volunteerId }, {
                        $push: {
                            comments: newComment._id
                        }
                    })
                    break;
                default:
                    break;
            }
            res.created({ success: true, message: "Create comment successful", newComment })
            commentItem(req.user._id, postId)
        } catch (err) {
            res.error(err);
        }
    }

    async getCommentPost(req, res) {
        try {
            const { id } = req.params;
            const { offset } = req.query;
            const post = await Posts.findById(id, "comments").populate({
                path: "comments",
                options: {
                    limit: 3,
                    sort: { created: -1 },
                    skip: offset * 3,
                },
                populate: {
                    path: "userId likes",
                    select: "username fullname avatar"
                }
            })
            res.success({ success: true, comments: post.comments })
        }
        catch (err) {
            res.err(err)
        }
    }

    async getCommentTour(req, res) {
        try {
            const { id } = req.params;
            const { offset } = req.query;

            const tour = await Tours.findById(id, "comments").populate({
                path: "comments",
                options: {
                    limit: 3,
                    sort: { created: -1 },
                    skip: offset * 3,

                },
                populate: {
                    path: "userId likes",
                    select: "username fullname avatar"
                }
            })
            res.success({ success: true, comments: tour.comments })
        }
        catch (err) {
            res.error(err)
        }
    }

    async getCommentVolunteer(req, res) {
        try {
            const { id } = req.params;
            const { offset } = req.query;

            const volunteer = await Volunteers.findById(id, "comments").populate({
                path: "comments",
                options: {
                    limit: 3,
                    sort: { created: -1 },
                    skip: offset * 3,

                },
                populate: {
                    path: "userId likes",
                    select: "username fullname avatar"
                }
            })
            res.success({ success: true, comments: volunteer.comments })
        }
        catch (err) {
            res.error(err)
        }
    }

    async updateComment(req, res) {
        try {
            const { content } = req.body;
            const comment = await Comments.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { content }, { new: true })
                .populate("userId", "avatar fullname username");

            res.success({ success: true, message: "Update comment successful", comment })
        } catch (err) {
            res.error(err)
        }
    }

    // A(req.user._id) like comment B(params.id)
    async likeComment(req, res) {
        try {
            const comment = await Comments.findOne({ _id: req.params.id, likes: req.user._id });

            if (comment && comment.length > 0) {
                return res.status(400).json({ success: false, message: "You liked this comment." })
            }

            const newComment = await Comments.findByIdAndUpdate(req.params.id, {
                $push: {
                    likes: req.user._id
                }
            }, { new: true }).populate("userId", "avatar fullname username");
            res.success({ success: true, message: "Like comment", newComment })
        } catch (err) {
            res.error(err)
        }
    }

    // A(req.user._id) unlike comment B(params.id)
    async unlikeComment(req, res) {
        try {
            const newComment = await Comments.findByIdAndUpdate(req.params.id, {
                $pull: {
                    likes: req.user._id
                }
            }, { new: true }).populate("userId", "avatar fullname username");
            res.success({ success: true, message: "Unlike comment", newComment })
        } catch (err) {
            res.error(err)
        }
    }

    // A(req.user._id) delete comment B(params.id)
    async deleteComment(req, res) {
        try {
            const comment = await Comments.findOneAndDelete({
                _id: req.params.id, userId: req.user._id
            })

            const { postId } = req.query;

            switch (comment.commentType) {
                case "post":
                    await Posts.findByIdAndUpdate(postId, {
                        $pull: { comments: req.params.id }
                    })
                    break;

                case "tour":
                    await Tours.findByIdAndUpdate(postId, {
                        $pull: { comments: req.params.id }
                    })
                    break;
                case "volunteer":
                    await Volunteers.findOneAndUpdate({ _id: comment.volunteerId }, {
                        $pull: { comments: req.params.id }
                    })
                    break;
                default:
                    break;
            }
            res.success({ success: true, message: "Delete comment" })
        } catch (err) {
            res.error(err)
        }
    }


}

module.exports = new CommentController();