const express = require('express');
const controller = require('../controllers/statistic');
const passport = require('passport');
const router = express.Router();

// localhost:3000/api/statistic/order-history
router.post('/order-history', passport.authenticate('admin-access', {session: false}),  controller.order_history);


module.exports = router;