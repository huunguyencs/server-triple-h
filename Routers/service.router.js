const express = require('express');
const router = express.Router();
const ServiceController = require('../Controllers/service.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');
const fakeAuth = require('../Middlewares/fakeAuth');

router.post('/create', auth, authRole([1]), ServiceController.createService);
router.get('/list', ServiceController.getServices);
router.get('/all', ServiceController.getAll);
router.get('/coop/:id', ServiceController.getServiceByCoop);
router.get('/rate/:id', fakeAuth, ServiceController.getServiceDetail);
router.get('/search', ServiceController.search);
router.get('/top_near', ServiceController.getTopServiceNear);

// router.get('/user_services/:id', ServiceController.getUserService);
router.post('/review/:id', auth, ServiceController.reviewService);

router.get('/:id', ServiceController.getService);
router.put('/:id', auth, authRole([1]), ServiceController.updateService);
router.delete('/:id', auth, authRole([1]), ServiceController.deleteService);

module.exports = router;
