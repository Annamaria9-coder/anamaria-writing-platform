import dbConnect from '../../../utils/database';
import Post from '../../../models/Post';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  await dbConnect();
  
  if (req.method === 'POST') {
    try {
      const post = await Post.create(req.body);
      return res.status(201).json({ success: true, data: post });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
  
  // Handle GET method
  if (req.method === 'GET') {
    try {
      const posts = await Post.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: posts });
    } catch (error) {
      return res.status(400).json({ success: false });
    }
  }
  
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}