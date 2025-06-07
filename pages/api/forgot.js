// pages/api/forgot.js
import nodemailer from 'nodemailer';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, sent, otp } = req.body;
      const ifexist = await User.findOne({ email: email })
      if (ifexist) {
        // Generate a random 6-digit OTP
        const genotp = Math.floor(100000 + Math.random() * 900000).toString();

        if (sent) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL, // Replace with your Gmail address
              pass: process.env.GMAIL_PASS, // Replace with your Gmail password
            },
          });

          const mailOptions = {
            from: process.env.EMAIL, // Replace with your Gmail address
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset on OK BLOGS Website is: ${genotp}`,
          };

          await transporter.sendMail(mailOptions);
          // Send the OTP to the user's email (your existing email sending logic)

          console.log('Email sent with OTP');

          // Return the success response
          return res.status(200).json({ success: true, otp:genotp });
        } else {
          // If not sending an email, just return success
          return res.status(200).json({ success: true });
        }
      } else if(otp) {
        if(otp==genotp){}
      } else {
        console.log('Invalid Email');
        return res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}