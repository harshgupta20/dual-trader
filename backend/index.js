const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const moment = require('moment-timezone');
const rateLimit = require('express-rate-limit'); // ✅ Import rate limiter
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const tradeRouter = require("./routers/trade");
const dataRouter = require("./routers/data");
const logger = require('./utils/winstonLogger');
const { sendMail } = require('./utils/emailService');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ✅ Define a rate limiter middleware
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1200, // limit each IP to 1200 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

app.set('trust proxy', true);
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_BASE_URL, process.env.BACKEND_BASE_URL],
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST'],
}));


app.use(apiLimiter); // ✅ Apply rate limit to all routes

// Routers
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/trade", tradeRouter);
app.use("/data", dataRouter);

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

// Schedule: Run every minute, but only act at 9:30 AM IST
// cron.schedule('* * * * *', () => {
//   try {
//     console.log("Running cron job at:", moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'));
//     const now = moment().tz('Asia/Kolkata');
//     if (now.hour() === 1 && now.minute() === 20) {
//       const currentTimeIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
//       const emailTemplate = require('./utils/emailTemplates/serverUpNotification')();
//       sendMail(process.env.GMAIL_EMAIL, emailTemplate.subject, emailTemplate.html, process.env.GMAIL_CC_EMAIL2, process.env.GMAIL_EMAIL)
//       console.log(`✅ Cron Job running at ${currentTimeIST} IST`);
//     }
//   } catch (error) {
//     console.error('Error in cron job:', error);
//     logger.error('Error in cron job: %s', error.message);
//     const errorEmailTemplate = require('./utils/emailTemplates/cronErrorNotification')(error);
//     sendMail(process.env.GMAIL_EMAIL, "Cron Job Error", "Server is not running and crashed.", process.env.GMAIL_CC_EMAIL2, process.env.GMAIL_EMAIL)
//     console.error('Error email sent:', errorEmailTemplate.subject);
//     logger.error('Error email sent: %s', errorEmailTemplate.subject);
//   }
// });


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
