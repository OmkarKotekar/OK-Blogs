// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Blog from "../../models/Blog"
import connectDb from "@/middlewear/mongoose"

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let category = req.body.category; // Get category from request body

        // Convert category to lowercase
        category = category.toLowerCase();
        let b = new Blog({
            slug: req.body.slug,
            title: req.body.title,
            content: req.body.content,
            category: category,
            createdBy: req.body.createdBy,
            metadesc: req.body.metadesc,
            images: req.body.images,
            thumbnail: req.body.thumbnail, // ✅ new field
        })
        await b.save()
        res.status(200).json({ success: 'success' })
    }
    else {
        res.status(400).json({ error: 'This method is not allowed' })
    }
}
export default handler;
