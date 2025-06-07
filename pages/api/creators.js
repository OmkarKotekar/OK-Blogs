import connectDb from "@/middlewear/mongoose";
import Blog from "../../models/Blog";

const handler = async (req, res) => {
  try {
    const creators = await Blog.distinct("createdBy");
    res.status(200).json({ creators });
  } catch (error) {
    console.error("Error fetching creators:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler);
