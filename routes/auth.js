const express = require('express');
const controller = require('../controllers/auth');
const passport = require('passport')
const router = express.Router();

// localhost:3000/api/user
router.get('/', passport.authenticate('shared-access', {session: false}),  controller.user);

// localhost:3000/api/user/login
router.post('/login', controller.login);

// localhost:3000/api/user/users
router.get('/users', passport.authenticate('admin-access', {session: false}), controller.getUsers);

// localhost:3000/api/user/catch
router.post('/catch',  passport.authenticate('admin-access', {session: false}),  controller.catch);

// localhost:3000/api/user/:id
router.delete('/:id', passport.authenticate('admin-access', {session: false}), controller.delete);

module.exports = router;