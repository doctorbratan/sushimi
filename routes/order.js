const express = require('express');
const controller = require('../controllers/order');
const passport = require('passport');
const router = express.Router();


// localhost:3000/api/order/catch
router.post('/catch',  controller.catch);

// localhost:3000/api/order/confim
router.post(`/confim`,   controller.confim);

// localhost:3000/api/order/alert
router.post(`/alert`, passport.authenticate('seller-access', {session: false}), controller.order_alert);

// localhost:3000/api/order/accept
router.post(`/accept`, passport.authenticate('seller-access', {session: false}), controller.order_accept);

// localhost:3000/api/order/inway
router.get(`/inway/:_id`, passport.authenticate('seller-access', {session: false}), controller.order_inway);

// localhost:3000/api/order/end
router.post(`/end`, passport.authenticate('seller-access', {session: false}), controller.order_end);

// localhost:3000/api/order
router.delete(`/:_id`, controller.delete);


module.exports = router;