const express = require('express');
const controller = require('../controllers/categories');
const passport = require('passport');
const router = express.Router();

// localhost:3000/api/category
router.get('/', passport.authenticate('admin-access', {session: false}),  controller.get);

// localhost:3000/api/category/catch
router.post('/catch', passport.authenticate('admin-access', {session: false}),  controller.catch);
 
// localhost:3000/api/category
router.delete(`/:_id`, passport.authenticate('admin-access', {session: false}), controller.delete);

module.exports = router;