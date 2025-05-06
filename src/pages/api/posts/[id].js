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
  
  const { id } = req.query
  
  await dbConnect()
  
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      try {
        const post = await Post.findById(id)
        if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found' })
        }
        res.status(200).json({ success: true, data: post })
      } catch (error) {
        res.status(400).json({ success: false, message: error.message })
      }
      break
      
    case 'PUT':
      try {
        const post = await Post.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        })
        if (!post) {
          return res.status(404).json({ success: false, message: 'Post not found' })
        }
        res.status(200).json({ success: true, data: post })
      } catch (error) {
        res.status(400).json({ success: false, message: error.message })
      }
      break
      
    case 'DELETE':
      try {
        const deletedPost = await Post.findByIdAndDelete(id)
        if (!deletedPost) {
          return res.status(404).json({ success: false, message: 'Post not found' })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false, message: error.message })
      }
      break
      
    default:
      res.status(400).json({ success: false, message: 'Invalid method' })
      break
  }
}