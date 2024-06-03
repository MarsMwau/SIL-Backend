const Album = require('../models/Album');
const Photo = require('../models/Photo');

exports.createAlbum = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user._id;
        const album = new Album({ userId, title });
        await album.save();

        console.log('Album created successfully:', album);
        res.status(201).send(album);
    } catch (err) {
        console.error('Error in createAlbum controller:', err);
        
        res.status(400).send({ message: 'An error occurred while creating the album', error: err.message });
    }
};

exports.getUserAlbums = async (req, res) => {
    try {
        console.log('req.user:', req.user);
        const userId = req.user._id;
        console.log('userId:', userId);

        const albums = await Album.find({ userId: userId });

        const albumsWithPhotos = await Promise.all(
            albums.map(async (album) => {
                const photos = await Photo.find({ albumId: album._id }).select('-albumId');
                return { ...album.toObject(), photos };
            })
        );

        res.status(200).send(albumsWithPhotos);
    } catch (err) {
        console.error('Error in getUserAlbums controller:', err);
        
        if (err.name === 'CastError') {
            res.status(400).send({ message: 'Invalid user ID' });
        } else if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Validation error', errors: err.errors });
        } else {
            res.status(400).send({ message: 'An error occurred while fetching albums', error: err.message });
        }
    }
};

exports.getAlbumById = async (req, res) => {
    try {
        const albumId = req.params.id;

        const album = await Album.findById(albumId);

        if (!album) {
            return res.status(404).send({ message: 'Album not found' });
        }

        if (album.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        const photos = await Photo.find({ albumId: album._id }).select('-albumId');

        const albumWithPhotos = {
            ...album.toObject(),
            photos: photos
        };

        res.status(200).send(albumWithPhotos);
    } catch (err) {
        console.error('Error in getAlbumById controller:', err);
        res.status(500).send({ message: 'An error occurred while fetching the album', error: err.message });
    }
};


exports.updateAlbumTitle = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user._id;
        const album = await Album.findOneAndUpdate(
            { _id: req.params.id, userId },
            { title },
            { new: true }
        );
        if (!album) return res.status(404).send({ message: 'Album not found or not authorized.' });
        res.status(200).send(album);
    } catch (err) {
        console.error('Error in updateAlbumTitle controller:', err);
        res.status(400).send({ message: 'An error occurred while updating the album title', error: err.message });
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const userId = req.user._id;
        const album = await Album.findOneAndDelete({ _id: req.params.id, userId });
        if (!album) return res.status(404).send({ message: 'Album not found or not authorized.' });
        await Photo.deleteMany({ albumId: req.params.id });
        res.status(200).send({ message: 'Album and associated photos deleted.' });
    } catch (err) {
        res.status(400).send(err);
    }
};
