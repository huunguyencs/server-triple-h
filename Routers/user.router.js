const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/user.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');
// đã test
router.post('/register', UserController.register);
router.post('/login', UserController.login);

router.post('/logout', UserController.logout);
router.post('/activate_email', UserController.activateEmail);
router.post('/refresh_token', UserController.refreshToken);
router.post('/forgot_password', UserController.forgotPassword);
router.post('/reset_password', auth, UserController.resetPassword);
router.patch('/change_avatar', auth, UserController.changeAvatar);
router.patch('/change_background', auth, UserController.changeBackground);
router.patch('/change_info', auth, UserController.editProfile);
router.patch('/change_password', auth, UserController.changePassword);
router.patch('/change_new', auth, UserController.changeNew);

router.get('/all', auth, authRole([2]), UserController.getAll);
router.get('/search', UserController.search);
router.post('/user_list', UserController.getUserByArray);

router.post('/confirm_account', auth, UserController.confirmAccount);
router.get('/get_friend_recommend', auth, UserController.getFriendRecommend);
router.get('/search_by_name', UserController.searchUsers);
router.get('/get_tour_saved', auth, UserController.getTourSaved);

// lấy thông tin một user
router.get('/:id', UserController.getUser);

router.put('/:id/follow', auth, UserController.follow); //id là id của người mà mình follow
router.put('/:id/unfollow', auth, UserController.unfollow); // id là id của người mình unfollow

router.put('/save_tour', auth, UserController.saveTour);
router.put('/unsaved_tour', auth, UserController.unsaveTour);

router.delete('/delete/:id', auth, authRole([2]), UserController.deleteUser);
router.patch(
  '/update_status',
  auth,
  authRole([2]),
  UserController.updateStatus
);

module.exports = router;
