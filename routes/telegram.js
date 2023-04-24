const express = require('express');
const controller = require('../controllers/telegram');
const passport = require('passport');
const router = express.Router();

// localhost:3000/api/telegram
router.get('/', passport.authenticate('admin-access', {session: false}),  controller.get);

// localhost:3000/api/telegram/catch
router.post('/catch', passport.authenticate('admin-access', {session: false}), controller.catch);

// localhost:3000/api/telegram
router.delete(`/:_id`, passport.authenticate('admin-access', {session: false}), controller.delete);

module.exports = router;