// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User"
import connectDb from "@/middlewear/mongoose"
var CryptoJS = require('crypto-js');

const handler = async (req, res) => {
    if (req.method == 'POST') {
        const {username, email} = req.body
        let u = new User({username, email, password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString()})
        await u.save()
        res.status(200).json({ success: 'success' })
    }
    else {
        res.status(400).json({ error: 'This method is not allowed' })
    }
}
export default handler;
