import Blog from "../../models/Blog";
import connectDb from "@/middlewear/mongoose";
import jwt from "jsonwebtoken";
import cookie from "cookie";

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ error: "No token found in cookies" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const username = decoded.name;

    const totalLikes = await Blog.aggregate([
      {
        $match: {
          createdBy: { $regex: `^${username}$`, $options: "i" }
        }
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likes" }
        }
      }
    ]);

    const likesCount = totalLikes[0]?.totalLikes || 0;
    return res.status(200).json({ likesCount });
  } catch (error) {
    console.error("Error in blogLikes API:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ consistent with your wrapped pattern
