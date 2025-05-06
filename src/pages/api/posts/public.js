import dbConnect from '../../../utils/database';
import Post from '../../../models/Post';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await dbConnect();
    
    // Only fetch public posts
    const posts = await Post.find({ isPublic: true }).sort({ createdAt: -1 });
    
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Error fetching public posts:', error);
    return res.status(500).json({ success: false, message: 'Error fetching posts' });
  }
}