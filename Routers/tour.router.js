const express = require('express');
const router = express.Router();
const TourController = require('../Controllers/tour.controller');
const auth = require('../Middlewares/auth');
const fakeAuth = require('../Middlewares/fakeAuth');

router.post('/create', auth, TourController.createTour);
router.post('/share', auth, TourController.shareTour);
router.get('/tours', TourController.getTours);
router.get('/search', TourController.search);

router.get('/user/:id', TourController.getUserTour);


router.get('/:id', fakeAuth, TourController.getTour);
router.patch('/:id', auth, TourController.updateTour);
router.delete('/:id', auth, TourController.deleteTour);

router.patch('/:id/like', auth, TourController.likeTour);
router.patch('/:id/unlike', auth, TourController.unlikeTour);

router.patch('/:id/join', auth, TourController.joinTour);
router.patch('/:id/unjoin', auth, TourController.unJoinTour);
router.patch('/:id/remove_join', auth, TourController.removeJoin);
router.patch('/:id/join_loc', auth, TourController.joinLocation)
router.patch('/:id/unjoin_loc', auth, TourController.unjoinLocation)
router.patch('/:id/remove_join_loc', auth, TourController.removeJoinLocation)

router.patch('/:id/remove_review', auth, TourController.removeReview)


module.exports = router;