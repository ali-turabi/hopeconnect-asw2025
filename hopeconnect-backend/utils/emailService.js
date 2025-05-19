const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} htmlContent - html body
 * @param {string} textFallback - plain text body (optional)
 */
async function sendEmail(to, subject, htmlContent, textFallback = '') {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
      text: textFallback || 'This email requires HTML support.'
    });
    console.log('the emain is sent ');
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
}

module.exports = sendEmail;