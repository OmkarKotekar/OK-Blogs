// pages/api/categories.js
import connectDb from "@/middlewear/mongoose";
import Blog from "../../models/Blog";

const handler = async (req, res) => {
  try {
    const categories = await Blog.distinct("category");
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ consistent with rest of APIs
