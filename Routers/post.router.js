const express = require('express');
const router = express.Router();
const PostController = require('../Controllers/post.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');
const fakeAuth = require('../Middlewares/fakeAuth');

router.get('/user/:id', PostController.getUserPost); //bug

router.post('/create_post', auth, PostController.createPost);
router.post('/create_review', auth, PostController.createReview);
router.post('/share', auth, PostController.sharePost);
router.get('/posts', auth, PostController.getPosts);
router.get('/search', PostController.search);
router.post('/list', PostController.postList);
router.get('/all', auth, authRole([2]), PostController.getAll);

router.get('/:id', fakeAuth, PostController.getPost);
router.patch('/:id', auth, PostController.updatePost);
router.delete('/:id', auth, PostController.deletePost);

router.patch('/:id/like', auth, PostController.likePost);
router.patch('/:id/unlike', auth, PostController.unlikePost);

module.exports = router;
