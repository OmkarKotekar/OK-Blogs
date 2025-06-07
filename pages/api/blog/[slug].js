import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  const { slug } = req.query;

  try {
    await connectDb();
    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Decode token to check if user is creator
    let isBlogCreator = false;
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (typeof token === 'string' && token.trim()) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded?.name === blog.createdBy) {
      isBlogCreator = true;
    }
  } catch (err) {
    console.warn("Invalid token:", err.message);
  }
}

    

    // Handle likes
    if (req.method === "POST") {
      blog.likes = (blog.likes || 0) + 1;
    }

    // Handle updates
    if (req.method === "PUT") {
      const { content, category, metadesc } = req.body;
      blog.content = content;
      blog.category = category;
      blog.metadesc = metadesc;
      await blog.save();
      return res.status(200).json({ ...blog.toObject(), isBlogCreator });
    }

    // Save blog for GET and POST
    await blog.save();

    res.status(200).json({ ...blog.toObject(), isBlogCreator });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
