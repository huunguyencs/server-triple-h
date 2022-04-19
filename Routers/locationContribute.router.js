const express = require('express');
const router = express.Router();
const LocationContributeController = require('../Controllers/locationContribute.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');

router.post('/create', auth, LocationContributeController.createLocation);
router.get('/locations/:province', auth, authRole([2]), LocationContributeController.getLocations);
router.get('/all', auth, authRole([2]), LocationContributeController.getAll)
router.get('/hot', auth, authRole([2]), LocationContributeController.getHotLocations);
router.get('/search', auth, authRole([2]), LocationContributeController.search)


router.get('/:name', auth, authRole([2]), LocationContributeController.getLocation);
router.patch('/:id', auth, authRole([2]), LocationContributeController.updateLocation);
router.delete('/:id', auth, authRole([2]), LocationContributeController.deleteLocation);

router.get("/:id/posts", LocationContributeController.getPosts);


module.exports = router;