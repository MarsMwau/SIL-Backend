const Photo = require('../models/Photo');
const Album = require('../models/Album');

exports.createPhoto = async (req, res) => {
    try {
        const { albumId, title, imageUrl } = req.body;

        const album = await Album.findById(albumId);
        if (!album) {
            return res.status(404).send({ message: 'Album not found' });
        }

        const photo = new Photo({ albumId, title, imageUrl });
        await photo.save();

        album.photos.push(photo._id);
        await album.save();

        console.log('Photo created successfully:', photo);

        res.status(201).send(photo); 
    } catch (err) {
        console.error('Error in createPhoto controller:', err);
        res.status(400).send({ message: 'An error occurred while creating the photo', error: err.message });
    }
};

exports.getAllPhotos = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log('userId:', userId);

        const albums = await Album.find({ userId: userId });
        console.log('albums:', albums);

        const photos = await Promise.all(
            albums.map(async (album) => {
                const albumPhotos = await Photo.find({ albumId: album._id });
                return albumPhotos;
            })
        );

        const flattenedPhotos = photos.flat();
        console.log('flattenedPhotos:', flattenedPhotos);

        res.status(200).send(flattenedPhotos);
    } catch (err) {
        console.error('Error in getAllPhotos controller:', err);
        res.status(400).send({ message: 'An error occurred while fetching photos', error: err.message });
    }
};


exports.getPhotoById = async (req, res) => {
    try {
        const photoId = req.params.id;
        const userId = req.user._id;

        const albums = await Album.find({ userId: userId });
        const albumIds = albums.map(album => album._id);

        const photo = await Photo.findOne({ _id: photoId, albumId: { $in: albumIds } });

        if (!photo) {
            return res.status(404).send({ message: 'Photo not found' });
        }

        res.status(200).send(photo);
    } catch (err) {
        console.error('Error in getPhotoById controller:', err);
        res.status(400).send({ message: 'An error occurred while fetching the photo', error: err.message });
    }
};

exports.updatePhotoTitle = async (req, res) => {
    try {
        const photoId = req.params.id;
        const userId = req.user._id;
        const { title } = req.body;

        const albums = await Album.find({ userId: userId });
        const albumIds = albums.map(album => album._id);

        const photo = await Photo.findOne({ _id: photoId, albumId: { $in: albumIds } });

        if (!photo) {
            return res.status(404).send({ message: 'Photo not found or you do not have permission to update it' });
        }

        photo.title = title;
        await photo.save();

        res.status(200).send({ message: 'Photo title updated successfully', photo });
    } catch (err) {
        console.error('Error in updatePhotoTitle controller:', err);
        res.status(500).send({ message: 'An error occurred while updating the photo title', error: err.message });
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.id;
        const userId = req.user._id;

        const albums = await Album.find({ userId: userId });
        const albumIds = albums.map(album => album._id);

        const photo = await Photo.findOne({ _id: photoId, albumId: { $in: albumIds } });

        if (!photo) {
            return res.status(404).send({ message: 'Photo not found or you do not have permission to delete it' });
        }

        await photo.deleteOne();

        res.status(200).send({ message: 'Photo deleted successfully' });
    } catch (err) {
        console.error('Error in deletePhoto controller:', err);
        res.status(500).send({ message: 'An error occurred while deleting the photo', error: err.message });
    }
};

