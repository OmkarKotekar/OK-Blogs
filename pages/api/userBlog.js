// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Blog from "../../models/Blog"
import connectDb from "@/middlewear/mongoose"
var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    const user = req.query.user;
    let blogs = await Blog.find({ createdBy: user });

    res.status(200).json({ blogs });
};

export default handler;