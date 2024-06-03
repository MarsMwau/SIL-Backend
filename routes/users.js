const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('../config/passport');

router.put('/update-username', passport.authenticate('jwt', { session: false }), userController.updateUsername);
router.put('/update-password', passport.authenticate('jwt', { session: false }), userController.updatePassword);

module.exports = router;
