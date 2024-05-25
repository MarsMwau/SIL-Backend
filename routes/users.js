const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('../config/passport');

router.get('/', passport.authenticate('jwt', { session: false }), userController.getUser);

module.exports = router;
