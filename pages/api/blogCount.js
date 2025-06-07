import Blog from "../../models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDb();

    // Parse cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "No token found in cookies" });
    }

    // Decode JWT using the same secret as in login
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.name;

    // Get blog count from DB
    const blogCount = await Blog.countDocuments({
      createdBy: { $regex: `^${username}$`, $options: "i" }, // case-insensitive match
    });

    return res.status(200).json({
      blogs: blogCount,
      user: {
        name: decoded.name,
        email: decoded.email
      }
    });
  } catch (error) {
    console.error("Error in blogCount API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handler;
