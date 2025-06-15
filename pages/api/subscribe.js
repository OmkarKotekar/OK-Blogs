import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDb from "@/middlewear/mongoose";
import cookie from "cookie";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const { creatorUsername } = req.body;
    if (!creatorUsername) {
      return res.status(400).json({ message: "creatorUsername is required" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const currentUsername = decoded.name;

    if (currentUsername === creatorUsername) {
      return res.status(400).json({ message: "You can't subscribe to yourself" });
    }

    const [currentUser, creator] = await Promise.all([
      User.findOne({ username: currentUsername }),
      User.findOne({ username: creatorUsername }),
    ]);

    if (!currentUser || !creator) {
      return res.status(404).json({ message: "User not found" });
    }

    let isSubscribed = false;
    const index = currentUser.subscribedChannel.indexOf(creatorUsername);

    if (index > -1) {
      // Already subscribed → Unsubscribe
      currentUser.subscribedChannel.splice(index, 1);
      creator.subscribers = Math.max(creator.subscribers - 1, 0);
    } else {
      // Not subscribed → Subscribe
      currentUser.subscribedChannel.push(creatorUsername);
      creator.subscribers += 1;
      isSubscribed = true;
    }

    await Promise.all([currentUser.save(), creator.save()]);

    return res.status(200).json({
      message: isSubscribed ? "Subscribed successfully!" : "Unsubscribed successfully!",
      isSubscribed,
    });
  } catch (err) {
    console.error("Subscription error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ Consistent with your DB pattern
