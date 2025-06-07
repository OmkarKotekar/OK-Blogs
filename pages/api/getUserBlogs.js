import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDb();

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.name;
    console.log("Fetching blogs for user:", username);

    const sortBy = req.query.sortBy || "createdAt";

    let blogs = await Blog.find({ createdBy: username }).lean();

    switch (sortBy) {
      case "trending":
        blogs.sort(
          (a, b) =>
            (b.views || 0) + 2 * (b.likes || 0) -
            ((a.views || 0) + 2 * (a.likes || 0))
        );
        break;
      case "views":
        blogs.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "likes":
        blogs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        blogs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
    }

    res.status(200).json({ user: username, blogs });
  } catch (err) {
    console.error("Error in getUserBlogs API:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
