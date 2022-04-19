const express = require('express');
const router = express.Router();
const HelpControlller = require('../Controllers/help.controller');
const auth = require('../Middlewares/auth');

router.get('/', HelpControlller.getHelps)
router.get('/my', auth, HelpControlller.getMyHelps)
router.post('/', auth, HelpControlller.createHelp);
router.put('/:id', auth, HelpControlller.updateHelp);
router.patch('/help/:id', auth, HelpControlller.help)
router.delete('/:id', auth, HelpControlller.deleteHelp);

module.exports = router;