const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister } = require('../validators/validateMiddleware');

router.post('/register', validateRegister, authController.register);
router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin); 

module.exports = router;
