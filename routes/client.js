const express = require('express');
const controller = require('../controllers/client');
const passport = require('passport')
const router = express.Router();

// localhost:3000/api/client
router.get('/', passport.authenticate('client-access', {session: false}),  controller.ClientCheck);

// localhost:3000/api/client/login
router.post('/login',  controller.login);

// localhost:3000/api/client/register
router.post('/register',  controller.register);

// localhost:3000/api/client/change-password
router.post('/change-password', passport.authenticate('client-access', {session: false}),   controller.change_password);

// localhost:3000/api/client/user-settings
router.post('/user-settings', passport.authenticate('client-access', {session: false}),  controller.user_settings);

// localhost:3000/api/client/favorite/:_id
router.get('/favorite/:_id', passport.authenticate('client-access', {session: false}),  controller.favorite);

// localhost:3000/api/client/phone-check/:phone
router.get('/phone-check/:phone',  controller.NumberCheck);


// localhost:3000/api/client/find
router.post('/find', passport.authenticate('admin-access', {session: false}), controller.find);

// localhost:3000/api/client/catch
router.post('/catch', passport.authenticate('admin-access', {session: false}),  controller.catch);

// localhost:3000/api/client
router.delete('/:_id', passport.authenticate('admin-access', {session: false}),  controller.delete);

module.exports = router;