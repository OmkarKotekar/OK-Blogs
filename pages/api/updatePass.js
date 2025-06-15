import User from "@/models/User";
import connectDb from "@/middlewear/mongoose";
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString();
    user.password = encryptedPassword;
    await user.save();

    return res.status(200).json({ success: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler); // ✅ Matches all other routes
