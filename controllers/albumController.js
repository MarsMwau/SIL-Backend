const Album = require('../models/Album');
const Photo = require('../models/Photo');

exports.createAlbum = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user._id;
        const album = new Album({ userId, title });
        await album.save();
        res.status(201).send(album);
    } catch (err) {
        res.status(400).send(err);
    }
};

// exports.getUserAlbums = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const albums = await Album.find({ userId }).populate('photos');
//         res.status(200).send(albums);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// };

exports.getUserAlbums = async (req, res) => {
    try {
        const albums = await Album.find({ userId: req.user._id }).populate('photos');
        res.status(200).send(albums);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.getAlbumById = async (req, res) => {
    try {
        const albumId = req.params.id;
        const album = await Album.findById(albumId).populate('photos');
        
        if (!album) {
            return res.status(404).send({ message: 'Album not found' });
        }

        // Ensure the logged-in user owns the album
        if (album.userId.toString() !== req.user._id.toString()) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        res.status(200).send(album);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.updateAlbum = async (req, res) => {
    try {
        const { title } = req.body;
        const userId = req.user._id;
        const album = await Album.findOneAndUpdate({ _id: req.params.id, userId }, { title }, { new: true });
        if (!album) return res.status(404).send({ message: 'Album not found or not authorized.' });
        res.status(200).send(album);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const userId = req.user._id; // User ID of the logged-in user
        const album = await Album.findOneAndDelete({ _id: req.params.id, userId });
        if (!album) return res.status(404).send({ message: 'Album not found or not authorized.' });
        await Photo.deleteMany({ albumId: req.params.id });
        res.status(200).send({ message: 'Album and associated photos deleted.' });
    } catch (err) {
        res.status(400).send(err);
    }
};
