const nodemailer = require('nodemailer');
const cron = require('node-cron');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Cron Job" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL,
      subject: 'Cron Job Triggered',
      text: 'This email is sent every 2 minutes from your Express app.'
    });
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};


const startCronJob = () => {
  cron.schedule('*/2 * * * *', () => {
    console.log('⏰ Running cron job at', new Date().toLocaleTimeString());
    // sendEmail();
  });
};

module.exports = startCronJob;
