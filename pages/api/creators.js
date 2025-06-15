// /pages/api/creators.js
import connectDb from "@/middlewear/mongoose";
import Blog from "@/models/Blog"; // ✅ Use alias path for consistency

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const creators = await Blog.distinct("createdBy");
    return res.status(200).json({ creators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ Consistent with rest of project
