// /pages/api/contact.js
import nodemailer from 'nodemailer';
import connectDb from '@/middlewear/mongoose'; // ✅ For consistency even if unused

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,        // ✅ Set in Vercel env vars
        pass: process.env.GMAIL_PASS,   // ✅ Use App Password (not actual Gmail password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact form submitted');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default connectDb(handler); // ✅ Consistent export
