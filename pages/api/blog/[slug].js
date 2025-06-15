// /pages/api/blog/[slug].js
import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  const { slug } = req.query;

  try {
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check blog creator from token
    let isBlogCreator = false;
    const token = req.headers.authorization?.split(" ")[1];
    if (typeof token === "string" && token.trim()) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded?.name === blog.createdBy) {
          isBlogCreator = true;
        }
      } catch (err) {
        console.warn("Invalid token:", err.message);
      }
    }

    if (req.method === "POST") {
      blog.likes = (blog.likes || 0) + 1;
      await blog.save();
    }

    if (req.method === "PUT") {
      const { content, category, metadesc } = req.body;
      blog.content = content;
      blog.category = category;
      blog.metadesc = metadesc;
      await blog.save();
      return res.status(200).json({ ...blog.toObject(), isBlogCreator });
    }

    if (req.method === "GET") {
      return res.status(200).json({ ...blog.toObject(), isBlogCreator });
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ Wrap with DB connection
