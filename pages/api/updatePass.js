// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middlewear/mongoose"
var CryptoJS = require('crypto-js');

const handler = async (req, res) => {
    if (req.method == 'POST') {
        const { email, password } = req.body
        let u = await User.findOne({ email: email })
        console.log(u)

        if (!u) {
            return res.status(404).json({ error: 'User not found' });
        }

        // let u = new User({username, email, password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()})
        // await u.update()
        u.password = CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString();

        console.log('Email:', email);
        console.log('New Password:', password);
        console.log('Encrypted Password:', u.password);
        // Save the updated user
        await u.save();

        res.status(200).json({ success: 'Password updated successfully', password: u.password });
    }
    else {
        res.status(400).json({ error: 'This method is not allowed' })
    }
}
export default handler;
