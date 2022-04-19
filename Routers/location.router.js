const express = require('express');
const router = express.Router();
const LocationController = require('../Controllers/location.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');
const fakeAuth = require('../Middlewares/fakeAuth');

router.post('/create', auth, authRole([2]), LocationController.createLocation);
router.get('/locations/:province', LocationController.getLocations);
router.get('/all', LocationController.getAll)
router.get('/hot', LocationController.getHotLocations);
router.get('/search', LocationController.search)


router.get('/:name', fakeAuth, LocationController.getLocation);
router.patch('/:id', auth, authRole([2]), LocationController.updateLocation);
router.delete('/:id', auth, authRole([2]), LocationController.deleteLocation);

router.get("/:id/posts", LocationController.getPosts);


module.exports = router;