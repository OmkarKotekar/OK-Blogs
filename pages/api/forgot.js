// /pages/api/forgot.js
import nodemailer from 'nodemailer';
import User from '@/models/User';
import connectDb from '@/middlewear/mongoose';

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, sent } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log('Invalid Email');
      return res.status(404).json({ error: 'User not found' });
    }

    if (sent) {
      // Generate 6-digit OTP
      const genotp = Math.floor(100000 + Math.random() * 900000).toString();

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset on OK BLOGS Website is: ${genotp}`,
      };

      await transporter.sendMail(mailOptions);

      console.log('OTP email sent to:', email);
      return res.status(200).json({ success: true, otp: genotp }); // OTP sent
    }

    // If `sent` is false, only verify user existence
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default connectDb(handler); // ✅ consistent DB wrap
