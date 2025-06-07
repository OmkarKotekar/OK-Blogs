const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    slug: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    category: {type: String, required: true},
    createdBy: { type: String, required: true },
    metadesc: {
        type: String,
        default: function () {
            return this.content.substring(0, 150);
        },
        required: true,
    },
    images: { type: [String] },
    thumbnail: { type: String, required: true }, // New field 'thumbnail'
    likes: { type: Number, default: 0 }, // New field 'likes'
    views: { type: Number, default: 0 }, // New field 'views'
}, {timestamps: true});
// mongoose.models = {}
export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);