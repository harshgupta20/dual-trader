const nodemailer = require('nodemailer');
// require("dotenv").config();

const SERVICE = process.env.SERVICE;
const HOST =  process.env.HOST;
const SECURE = process.env.SECURE;
const EMAIL =  process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
  service: SERVICE,
  host: HOST,
  port: 587,
  secure: SECURE,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});

// Function to send an email
const sendMail = async (to, subject, html, cc , replyTo) => {
  try {
    const mailOptions = {
      from: `Dual Trader <${EMAIL}>`,
      to, // recipient email
      subject,
      html, // html body
      cc: cc, // cc recipients
      replyTo: EMAIL, // reply-to email
    };
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};


module.exports = {sendMail};