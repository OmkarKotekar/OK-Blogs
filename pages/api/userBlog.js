// /pages/api/getBlogsByUser.js
import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ error: "User query parameter is required" });
    }

    const blogs = await Blog.find({ createdBy: user }).sort({ createdAt: -1 });
    return res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs by user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ consistent with all your other DB-connected APIs
