import jwt from 'jsonwebtoken';
import User from '../../models/User';
import connectDb from '@/middlewear/mongoose';
import cookie from 'cookie';

const handler = async (req, res) => {
  await connectDb();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { creatorUsername } = req.body;

    if (!creatorUsername) {
      return res.status(400).json({ message: 'creatorUsername is required' });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const currentUsername = decoded.name;

    if (currentUsername === creatorUsername) {
      return res.status(200).json({ isSubscribed: false }); // Can't be subscribed to self
    }

    const currentUser = await User.findOne({ username: currentUsername });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isSubscribed = currentUser.subscribedChannel.includes(creatorUsername);

    return res.status(200).json({ isSubscribed });
  } catch (err) {
    console.error('Check subscription error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default handler;
