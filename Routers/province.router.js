const express = require('express');
const router = express.Router();
const ProvinceController = require('../Controllers/province.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');

router.post('/create', auth, authRole([2]), ProvinceController.createProvince);
router.get('/provinces', ProvinceController.getProvinces);
router.get('/all', ProvinceController.getAllDetail);
router.get('/search', ProvinceController.search);

router.get('/location/:id', ProvinceController.getLocationsProvince)
router.get('/event/:id', ProvinceController.getEventsProvince)
router.get('/service/:id', ProvinceController.getServicesProvince)

router.get('/:id', ProvinceController.getProvince);
router.patch('/:id', auth, authRole([2]), ProvinceController.updateProvince);
// router.delete('/:id', auth, authRole([2]), ProvinceController.deleteProvince);


module.exports = router;