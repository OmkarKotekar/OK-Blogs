// /pages/api/addBlog.js

import Blog from "@/models/Blog";
import connectDb from "@/middlewear/mongoose";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      let category = req.body.category.toLowerCase();

      const b = new Blog({
        slug: req.body.slug,
        title: req.body.title,
        content: req.body.content,
        category,
        createdBy: req.body.createdBy,
        metadesc: req.body.metadesc,
        images: req.body.images,
        thumbnail: req.body.thumbnail,
      });

      await b.save();
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("AddBlog Error:", error);
      res.status(500).json({ error: "Blog creation failed." });
    }
  } else {
    res.status(405).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler); // ✅ THIS is required!
