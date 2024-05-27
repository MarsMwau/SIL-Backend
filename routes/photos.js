const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController');
const passport = require('../config/passport');
const { validateCreatePhoto, validateUpdatePhotoTitle } = require('../validators/photoValidator');

router.post('/', passport.authenticate('jwt', { session: false }), validateCreatePhoto, photoController.createPhoto);
router.get('/', passport.authenticate('jwt', { session: false }), photoController.getAllPhotos);
router.get('/:id', passport.authenticate('jwt', { session: false }), photoController.getPhotoById);
router.put('/:id', passport.authenticate('jwt', { session: false }), validateUpdatePhotoTitle, photoController.updatePhotoTitle);
router.delete('/:id', passport.authenticate('jwt', { session: false }), photoController.deletePhoto);

module.exports = router;
