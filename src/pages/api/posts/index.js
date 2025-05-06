import dbConnect from '../../../utils/database'
import Post from '../../../models/Post'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  
  // Check if user is authenticated
  if (!session) {
    return res.status(401).json({ success: false, message: 'Not authenticated' })
  }
  
  await dbConnect()
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 })
        res.status(200).json({ success: true, data: posts })
      } catch (error) {
        res.status(400).json({ success: false, message: error.message })
      }
      break
      
    case 'POST':
      try {
        const post = await Post.create(req.body)
        res.status(201).json({ success: true, data: post })
      } catch (error) {
        res.status(400).json({ success: false, message: error.message })
      }
      break
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' })
      break
  }
}