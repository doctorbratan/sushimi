const express = require('express');
const controller = require('../controllers/places');
const passport = require('passport');
const router = express.Router();

// localhost:3000/api/start
router.get('/start',  controller.start);

// localhost:3000/api/menu
router.post('/menu',  controller.menu);

// localhost:3000/api/cities
router.post('/cities',  controller.sendCities);

// localhost:3000/api/place
router.post('/',  controller.find);

// localhost:3000/api/place/findOne
router.post('/findOne',  controller.findOne);

// localhost:3000/api/place/catch
router.post('/catch',  controller.catch);

// localhost:3000/api/place
router.delete(`/:_id`, controller.delete);

module.exports = router;