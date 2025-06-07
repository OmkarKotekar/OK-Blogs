// /pages/api/topUserBlogs.js

import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDb();

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const allBlogs = await Blog.find({ createdBy: decoded.name }).lean();

    const byLikes = [...allBlogs].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3);
    const byViews = [...allBlogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
    const byTrending = [...allBlogs].sort((a, b) => ((b.views || 0) + 2 * (b.likes || 0)) - ((a.views || 0) + 2 * (a.likes || 0))).slice(0, 3);

    res.status(200).json({ topLikes: byLikes, topViews: byViews, topTrending: byTrending });
  } catch (err) {
    console.error("Error in /api/topUserBlogs:", err);
    res.status(500).json({ error: "Failed to get top blogs" });
  }
};

export default handler;
