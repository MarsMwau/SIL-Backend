const User = require('../models/User');
const Album = require('../models/Album');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const albums = await Album.find({ userId: req.user._id }).populate('photos');
        res.status(200).send({ user, albums });
    } catch (err) {
        res.status(400).send(err);
    }
};
