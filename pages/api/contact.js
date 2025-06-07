// pages/api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, message } = req.body;

      // Your validation logic for name, email, and message

      // Your email sending logic
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL, // Replace with your Gmail address
          pass: process.env.GMAIL_PASS, // Replace with your Gmail password
        },
      });

      const mailOptions = {
        from: process.env.EMAIL, // Replace with your Gmail address
        to: process.env.EMAIL, // Replace with your contact email address
        subject: 'New Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);
      // Send the contact form submission to your email (your existing email sending logic)

      console.log('Contact form submitted');

      // Return the success response
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
