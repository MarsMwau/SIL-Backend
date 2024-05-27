const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const passport = require('../config/passport');
const { validateAlbum } = require('../validators/albumValidator'); // Import the validation middleware

router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    validateAlbum, // Add validation middleware here
    albumController.createAlbum
);

router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    albumController.getUserAlbums
);

router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    albumController.getAlbumById
);

router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    validateAlbum,
    albumController.updateAlbumTitle
);

router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    albumController.deleteAlbum
);

module.exports = router;
