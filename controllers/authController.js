const jwt = require("jwt-simple");
const User = require("../models/User");
const jwtConfig = require("../config/jwtConfig");
const admin = require("../config/firebaseAdmin");

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

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).send({ message: "Authentication failed. User not found." });
    }

    user.comparePassword(password, (err, isMatch) => {
        if (isMatch && !err) {
            const token = jwt.encode({ id: user._id }, jwtConfig.secret);
            return res.json({ token: `Bearer ${token}` });
        } else {
            return res.status(401).send({ message: "Authentication failed. Wrong password." });
        }
    });
};

exports.googleLogin = async (req, res) => {
    const { idToken } = req.body;

    try {

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email, name } = decodedToken;


        let user = await User.findOne({ email });

        if (!user) {

            user = new User({ name, email, googleId: uid });
            await user.save();
        }

        const token = jwt.encode({ id: user._id }, jwtConfig.secret);

        res.json({ token: `Bearer ${token}` });
    } catch (error) {
        console.error("Error verifying ID token:", error);
        res.status(401).json({ message: "Invalid ID token" });
    }
};
