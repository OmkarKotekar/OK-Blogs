const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    subscribers: { type: Number, default: 0 },
    subscribedChannel: { type: [String], default: [] },
}, {timestamps: true});
// mongoose.models = {}
export default mongoose.models.User || mongoose.model('User', UserSchema);