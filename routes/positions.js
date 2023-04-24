const express = require('express');
const controller = require('../controllers/positions');
const upload = require('../middleware/upload');
const passport = require('passport');
const router = express.Router();

// localhost:3000/api/position
router.post('/', passport.authenticate('admin-access', {session: false}),  controller.find);

// localhost:3000/api/position/catch
router.post('/catch', passport.authenticate('admin-access', {session: false}), upload.single('image'),  controller.catch);

// localhost:3000/api/position
router.delete(`/:_id`, passport.authenticate('admin-access', {session: false}), controller.delete);

// localhost:3000/api/position/update
router.get(`/update`, passport.authenticate('admin-access', {session: false}), controller.update);


module.exports = router;