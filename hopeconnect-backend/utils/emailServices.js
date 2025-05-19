import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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
export async function sendEmail(to, subject, htmlContent, textFallback = '') {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
      text: textFallback || 'This email requires HTML support.'
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Email error:', error.message);
  }
}
