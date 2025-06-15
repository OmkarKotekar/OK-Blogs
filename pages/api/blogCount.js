import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.name;

    const blogCount = await Blog.countDocuments({
      createdBy: new RegExp(`^${username}$`, "i"),
    });

    return res.status(200).json({
      blogs: blogCount,
      user: {
        name: decoded.name,
        email: decoded.email,
      },
    });
  } catch (err) {
    console.error("Error in /api/blogCount:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler);
