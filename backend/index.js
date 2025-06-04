const express = require('express');
const app = express();
const cors = require('cors');
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const tradeRouter = require("./routers/trade");
const logger = require('./utils/winstonLogger');
const KillSwitch = require('./middllewares/killSwitch');
const db = require('./utils/FirebaseInitiate');
require('dotenv').config();


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/trade", tradeRouter);


// LOGGER
app.use((req, res, next) => {
  logger.info('Incoming request: %s %s', req.method, req.url);

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed: %s %s - Status: %d - %dms',
      req.method, req.url, res.statusCode, duration);
  });
  next();
});

app.get('/', (req, res) => {
    res.json({
        message: 'Server is up and runnnig.',
        success: true
    });
});

app.get('/users', KillSwitch, async (req, res) => {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
});

// app.get('/kill-all', async (req, res) => {
//     const snapshot = await db.collection('switches').get();
//     const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.json(users);
// });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});