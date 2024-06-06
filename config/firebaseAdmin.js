require('dotenv').config();
const admin = require('firebase-admin');

const serviceAccountJson = process.env.FIREBASE_ADMIN_SDK_JSON;
const serviceAccount = JSON.parse(serviceAccountJson);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
