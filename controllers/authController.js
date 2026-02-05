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
        // --- FIX START: Generate a unique username ---
        // 1. Generate a random 4-digit number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        
        // 2. Get the first name (or default to 'user') and lowercase it
        const firstName = name ? name.split(" ")[0].toLowerCase() : "user";
        
        // 3. Combine them (e.g., "mars5923")
        const tempUsername = `${firstName}${randomNum}`;
        // --- FIX END ---

        user = new User({ 
            name, 
            email, 
            googleId: uid,
            username: tempUsername // Now we save the generated username!
        });
        await user.save();
      }
  
      const token = jwt.encode({ id: user._id }, jwtConfig.secret);
  
      res.json({ token: `Bearer ${token}` });
    } catch (error) {
      console.error("Error verifying ID token:", error);
      res.status(401).json({ message: "Invalid ID token" });
    }
  };