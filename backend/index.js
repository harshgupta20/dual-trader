const express = require('express');
const app = express();
const admin = require('firebase-admin');
require('dotenv').config();

// Load Firebase Admin credentials
const serviceAccount = require('./firebaseServiceAccount');
const PORT = process.env.PORT || 3000;
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<your-project-id>.firebaseio.com' // Replace with your Firebase DB URL
});

// Firestore example
const db = admin.firestore();
app.use(express.json());


const authRouter = require("./routers/auth");

app.use("/auth", authRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Server is up and runnnig.',
        success: true
    });
});

app.get('/users', async (req, res) => {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
});

app.get('/kill-all', async (req, res) => {
    const snapshot = await db.collection('switches').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});