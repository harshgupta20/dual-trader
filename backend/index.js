const express = require('express');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit'); // ✅ Import rate limiter
const authRouter = require("./routers/auth");
const userRouter = require("./routers/user");
const tradeRouter = require("./routers/trade");
const dataRouter = require("./routers/data");
const logger = require('./utils/winstonLogger');
const { sendMail } = require('./utils/emailService');
const moment = require('moment-timezone');
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

app.post("/test", async (req, res) => {
  res.json({
    message: 'Test endpoint is working.',
    success: true,
  });
})

app.get('/', (req, res) => {
  res.json({
    message: 'Server is up and runnnig.',
    success: true
  });
});

// Schedule: Run every minute, but only act at 7:59 AM IST
cron.schedule('* * * * *', async () => {
  const now = moment().tz('Asia/Kolkata');
  const formattedTime = now.format('YYYY-MM-DD HH:mm:ss');

  try {
    // logger.info(`[CRON] Checking at: ${formattedTime}`);

    if (now.hour() === 6 && now.minute() === 10) {
      const emailTemplate = require('./utils/emailTemplates/serverUpNotification')();

      await sendMail(
        [process.env.GMAIL_EMAIL],            // to
        emailTemplate.subject,              // subject
        emailTemplate.html,                 // html body
        [process.env.GMAIL_CC_EMAIL2, process.env.GMAIL_CC_EMAIL],           // cc
      );

      logger.info(`✅ [CRON] Server up notification sent at ${formattedTime} IST`);
    }
  } catch (error) {
    logger.error(`[CRON ERROR] Failed at ${formattedTime}: ${error.message}`);
    console.error(`[CRON ERROR]`, error);

    const errorEmailTemplate = require('./utils/emailTemplates/cronErrorNotification')(error);

    try {
      await sendMail(
        [process.env.GMAIL_EMAIL],                  // to
        errorEmailTemplate.subject,               // subject
        errorEmailTemplate.html,                  // html body
        [process.env.GMAIL_CC_EMAIL2, process.env.GMAIL_CC_EMAIL],              // cc
      );

      logger.error(`[CRON] Error notification email sent: ${errorEmailTemplate.subject}`);
    } catch (mailErr) {
      logger.error(`[MAIL ERROR] Failed to send error notification: ${mailErr.message}`);
      console.error('[MAIL ERROR]', mailErr);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
