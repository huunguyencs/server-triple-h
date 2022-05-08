const express = require('express');
const router = express.Router();
const ProvinceContributeController = require('../Controllers/provinceContribute.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');

router.post('/create', auth, ProvinceContributeController.createProvince);
router.get('/all', auth, authRole([2]), ProvinceContributeController.getAll);
router.get(
  '/:id',
  auth,
  authRole([2]),
  ProvinceContributeController.getProvince
);
router.patch(
  '/:id',
  auth,
  authRole([2]),
  ProvinceContributeController.updateState
);
router.delete(
  '/:id',
  auth,
  authRole([2]),
  ProvinceContributeController.deleteProvince
);

module.exports = router;
