import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // or use your SMTP server
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password' // Use app password if using Gmail
    }
});

export async function sendEmailToDonors(recipients, subject, htmlContent) {
    const mailOptions = {
        from: 'your_email@gmail.com',
        to: recipients, // array or comma-separated string
        subject,
        html: htmlContent
    };

    return transporter.sendMail(mailOptions);
}