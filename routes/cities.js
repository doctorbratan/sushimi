const express = require('express');
const controller = require('../controllers/cities');
const passport = require('passport');
const router = express.Router();

// localhost:3000/api/city
router.get('/', controller.get);

// localhost:3000/api/city/catch
router.post('/catch', passport.authenticate('admin-access', {session: false}),  controller.catch);

// localhost:3000/api/city
router.delete(`/:_id`, passport.authenticate('admin-access', {session: false}), controller.delete);

module.exports = router;