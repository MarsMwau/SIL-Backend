const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const passport = require('../config/passport');

router.post('/', passport.authenticate('jwt', { session: false }), photoController.createPhoto);
router.put('/:id', passport.authenticate('jwt', { session: false }), photoController.updatePhoto);
router.delete('/:id', passport.authenticate('jwt', { session: false }), photoController.deletePhoto);

module.exports = router;
