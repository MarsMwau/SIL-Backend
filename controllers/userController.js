const User = require('../models/User');
const bcrypt = require('bcrypt');
const { passwordSchema } = require('../validators/authValidator');

exports.updateUsername = async (req, res) => {
    try {
        const userId = req.user._id;
        const { username } = req.body;

        const user = await User.findByIdAndUpdate(userId, { username }, { new: true });
        res.status(200).send({ message: 'Username updated successfully', user });
    } catch (err) {
        res.status(400).send(err);
    }
};


exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { password } = req.body;

        const { error } = passwordSchema.validate(password);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        res.status(200).send({ message: 'Password updated successfully', user });
    } catch (err) {
        res.status(400).send(err);
    }
};
