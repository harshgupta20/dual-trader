
const admin = require('firebase-admin');
const serviceAccount = require('../firebaseServiceAccount');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<your-project-id>.firebaseio.com' // Replace with your Firebase DB URL
});

// Firestore example
const db = admin.firestore();


module.exports = db;