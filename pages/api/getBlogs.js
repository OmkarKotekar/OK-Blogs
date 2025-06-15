import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDb(); // ✅ ensure DB connection

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY); // ✅ use same key as everywhere else
    const sortBy = req.query.sortBy || "createdAt";

    let blogs = await Blog.find({ createdBy: decoded.name }).lean();

    // ✅ consistent sorting logic
    if (sortBy === "trending") {
      blogs.sort(
        (a, b) =>
          ((b.views || 0) + 2 * (b.likes || 0)) -
          ((a.views || 0) + 2 * (a.likes || 0))
      );
    } else if (sortBy === "views") {
      blogs.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === "likes") {
      blogs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.status(200).json({ user: decoded, blogs });
  } catch (error) {
    console.error("Error in getUserBlogs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
