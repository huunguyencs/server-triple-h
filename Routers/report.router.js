const express = require('express');
const router = express.Router();
const ReportController = require('../Controllers/report.controller');
const auth = require('../Middlewares/auth');
const authRole = require('../Middlewares/authRole');

router.post('/create', auth, ReportController.createReport);
router.get('/all', auth, authRole([2]), ReportController.getReports);
router.patch('/:id', auth, authRole([2]),ReportController.finish);
router.get('/:id',auth, authRole([2]), ReportController.getReport);
router.delete(':/id', auth, authRole([2]), ReportController.deleteReport);

module.exports = router;