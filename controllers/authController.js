const jwt = require('jwt-simple');
const User = require('../models/User');
const jwtConfig = require('../config/jwtConfig');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).send({ message: 'Authentication failed. User not found.' });
    }

    user.comparePassword(password, (err, isMatch) => {
        if (isMatch && !err) {
            const token = jwt.encode({ id: user._id }, jwtConfig.secret);
            return res.json({ token: `Bearer ${token}` });
        } else {
            return res.status(401).send({ message: 'Authentication failed. Wrong password.' });
        }
    });
};

exports.register = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const user = new User({ name, username, email, password });
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};
