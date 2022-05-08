const express = require('express');
const router = express.Router();
const LocationContributeController = require('../Controllers/locationContribute.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');

router.post('/create', auth, LocationContributeController.createLocation);
router.get('/all', auth, authRole([2]), LocationContributeController.getAll);

router.get(
  '/:id',
  auth,
  authRole([2]),
  LocationContributeController.getLocation
);

router.patch(
  '/:id',
  auth,
  authRole([2]),
  LocationContributeController.updateState
);
router.delete(
  '/:id',
  auth,
  authRole([2]),
  LocationContributeController.deleteLocation
);

module.exports = router;
