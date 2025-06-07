// pages/api/categoriesCreator.js
import connectDb from "../../middlewear/mongoose";
import Blog from "../../models/Blog";

const handler = async (req, res) => {
    try {
        // Assuming the selected creator is sent in the query parameters as ?createdBy=selectedCreatorName
        const { createdBy } = req.query;

        if (!createdBy) {
            return res.status(400).json({ error: "Creator not specified in the request" });
        }

        // Modify the query to filter by createdBy
        const categories = await Blog.distinct("category", { createdBy });
        
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default connectDb(handler);
