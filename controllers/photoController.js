const Photo = require('../models/Photo');
const Album = require('../models/Album');
const { transformPhoto } = require('../utils/transformers');

exports.createPhoto = async (req, res) => {
    try {
        const { albumId, title, imageUrl } = req.body;
        const photo = new Photo({ albumId, title, imageUrl });
        await photo.save();

        // Add the photo ID to the album's photos array
        await Album.findByIdAndUpdate(albumId, { $push: { photos: photo._id } });

        // Transform the photo data
        const transformedPhoto = transformPhoto(photo);

        res.status(201).send(transformedPhoto);
    } catch (err) {
        res.status(400).send(err);
    }
};



exports.updatePhoto = async (req, res) => {
    try {
        const { title } = req.body;
        const photo = await Photo.findOneAndUpdate({ _id: req.params.id }, { title }, { new: true });
        if (!photo) return res.status(404).send({ message: 'Photo not found.' });
        res.status(200).send(photo);
    } catch (err) {
        res.status(400).send(err);
    }
};

exports.deletePhoto = async (req, res) => {
    try {
        const photo = await Photo.findOneAndDelete({ _id: req.params.id });
        if (!photo) return res.status(404).send({ message: 'Photo not found.' });
        res.status(200).send({ message: 'Photo deleted.' });
    } catch (err) {
        res.status(400).send(err);
    }
};
