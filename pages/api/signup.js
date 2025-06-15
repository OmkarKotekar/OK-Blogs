// /pages/api/signup.js

import User from "@/models/User";
import connectDb from "@/middlewear/mongoose";
const CryptoJS = require('crypto-js');

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { username, email, password } = req.body;

      const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();

      let user = new User({ username, email, password: hashedPassword });
      await user.save();

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Signup API error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};

export default connectDb(handler);
//error is to be solved