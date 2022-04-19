const express = require('express');
const router = express.Router();
const CommentController = require('../Controllers/comment.controller');
const auth = require('../Middlewares/auth');

router.get('/post/:id', CommentController.getCommentPost);
router.get('/tour/:id', CommentController.getCommentTour);
router.get('/volunteer/:id', CommentController.getCommentVolunteer);

router.post('/create', auth, CommentController.createComment);

router.patch('/:id', auth, CommentController.updateComment)
router.delete('/:id', auth, CommentController.deleteComment)


router.patch('/:id/like', auth, CommentController.likeComment)
router.patch('/:id/unlike', auth, CommentController.unlikeComment)




module.exports = router;