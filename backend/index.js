const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit'); // ✅ Import rate limiter
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const tradeRouter = require("./routers/trade");
const logger = require('./utils/winstonLogger');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ✅ Define a rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

app.use(express.json());
app.use(cors());
app.use(apiLimiter); // ✅ Apply rate limit to all routes

// Routers
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
