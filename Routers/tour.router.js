const express = require('express');
const router = express.Router();
const TourController = require('../Controllers/tour.controller');
const auth = require('../Middlewares/auth');
const fakeAuth = require('../Middlewares/fakeAuth');

router.post('/create', auth, TourController.createTour);
router.post('/share', auth, TourController.shareTour);
router.get('/tours', TourController.getTours);
router.get('/search', TourController.search);
router.get('/search_hot', TourController.searchTourHot);
router.get('/hot', TourController.tourHot);
router.get('/foryou', auth, TourController.getTourRecommend);
router.get('/similar/:id', auth, TourController.getSimilar);
router.get('/hashtag', TourController.getTourHashtag);

router.get('/user/:id', TourController.getUserTour);

router.get('/:id', fakeAuth, TourController.getTour);
router.patch('/:id', auth, TourController.updateTour);
router.delete('/:id', auth, TourController.deleteTour);

router.patch('/:id/like', auth, TourController.likeTour);
router.patch('/:id/unlike', auth, TourController.unlikeTour);

router.patch('/:id/invite', auth, TourController.inviteJoinTour);
router.patch('/:id/remove_invite', auth, TourController.removeInviteTour);
router.patch('/:id/change_isEdit', auth, TourController.changeIsEditJoin);
router.patch('/:id/accept', auth, TourController.acceptInviteJoin);
router.patch('/:id/unAccept', auth, TourController.unAcceptInviteJoin);


router.patch('/:id/remove_review', auth, TourController.removeReview);

module.exports = router;
