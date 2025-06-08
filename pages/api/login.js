// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middlewear/mongoose"
var CryptoJS = require('crypto-js');
var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
  if (req.method === 'POST') {
    await connectDb(); // ✅ Connect to DB first

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ success: false, error: "No user found" });
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const decryptedPass = bytes.toString(CryptoJS.enc.Utf8);

    if (req.body.password === decryptedPass) {
      const token = jwt.sign(
        { email: user.email, name: user.username },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
      );
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(200).json({ success: false, error: "Invalid Credentials" });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // ✅ 405 is proper here
  }
};

export default connectDb(handler);

