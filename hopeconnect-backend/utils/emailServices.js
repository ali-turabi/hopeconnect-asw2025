import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load variables from .env

export const sendAssignmentEmail = async (toEmail, userName, campaignTitle) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,        // Your Gmail address
      pass: process.env.EMAIL_PASSWORD     // Your App Password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Assignment to Emergency Campaign: ${campaignTitle}`,
    text: `Hello ${userName},\n\nYou have been successfully assigned to the emergency campaign: ${campaignTitle}.\n\nThank you for your support!`
  };

  await transporter.sendMail(mailOptions);
};
