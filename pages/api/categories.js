// pages/api/categories.js
import connectDb from "@/middlewear/mongoose";
import Blog from "../../models/Blog";
// import mongoose from "mongoose";

// const connectDb = handler => async (req, res)=>{
//     if(mongoose.connections[0].readyState){
//         return handler(req, res)
//     }
//     await mongoose.connect(process.env.MONGO_URI)
//     return handler(req, res);
// }

const handler = async (req, res) => {
    try {
        const categories = await Blog.distinct("category");
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default handler;
