import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Write() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [view, setView] = useState('list') // 'list', 'edit', 'new'
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState(null)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    isPublic: false
  })
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  
  // Fetch posts when authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      fetchPosts()
    }
  }, [status])
  
  // Fetch all posts (both public and private)
  async function fetchPosts() {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return <div className="container">Loading...</div>
  }
  
  // If not authenticated, don't render the page content
  if (!session) {
    return null
  }
  
  const handleNewPost = () => {
    setView('new')
    setNewPost({
      title: '',
      content: '',
      isPublic: false
    })
  }
  
  const handleEditPost = (post) => {
    setSelectedPost(post)
    setView('edit')
  }
  
  const handleSavePost = async () => {
    try {
      if (view === 'new') {
        // Create new post
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPost),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Refresh posts list
          fetchPosts()
          setView('list')
        }
      } else if (view === 'edit') {
        // Update existing post
        const response = await fetch(`/api/posts/${selectedPost._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedPost),
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Refresh posts list
          fetchPosts()
          setView('list')
        }
      }
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post. Please try again.')
    }
  }
  
  const handleDeletePost = async (postId) => {
    if (confirm('Are you sure you want to delete this writing?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE',
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Refresh posts list
          fetchPosts()
        }
      } catch (error) {
        console.error('Error deleting post:', error)
        alert('Error deleting post. Please try again.')
      }
    }
  }
  
  const handlePublishToggle = () => {
    if (view === 'new') {
      setNewPost({
        ...newPost,
        isPublic: !newPost.isPublic
      })
    } else if (view === 'edit') {
      setSelectedPost({
        ...selectedPost,
        isPublic: !selectedPost.isPublic
      })
    }
  }
  
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <div className="container">
      <Head>
        <title>Write | Anamaria</title>
        <meta name="description" content="Private writing space" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="header">
        <Link href="/" className="home-link" legacyBehavior>
          Anamaria
        </Link>
        
        <div className="header-actions">
          {view === 'list' ? (
            <button className="new-post-button" onClick={handleNewPost}>
              New Writing
            </button>
          ) : (
            <button className="back-button" onClick={() => setView('list')}>
              ← Back to Writings
            </button>
          )}
          
          <button className="sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>
      <main className="writing-space">
        {view === 'list' && (
          <div className="posts-list">
            <h1 className="section-title">Your Writings</h1>
            
            {loading ? (
              <div className="loading">Loading your writings...</div>
            ) : posts.length === 0 ? (
              <div className="no-posts">
                <p>You haven't written anything yet.</p>
                <button className="start-writing-button" onClick={handleNewPost}>
                  Start Writing
                </button>
              </div>
            ) : (
              <div className="posts">
                {posts.map(post => (
                  <div key={post._id} className="post-item">
                    <div className="post-info">
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="post-status">
                        {post.isPublic ? 'Public' : 'Private'}
                      </p>
                    </div>
                    
                    <div className="post-actions">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEditPost(post)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeletePost(post._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {(view === 'new' || view === 'edit') && (
          <div className="editor">
            <h1 className="section-title">
              {view === 'new' ? 'New Writing' : 'Edit Writing'}
            </h1>
            
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                className="input"
                value={view === 'new' ? newPost.title : selectedPost.title}
                onChange={(e) => {
                  if (view === 'new') {
                    setNewPost({ ...newPost, title: e.target.value })
                  } else {
                    setSelectedPost({ ...selectedPost, title: e.target.value })
                  }
                }}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                className="textarea"
                value={view === 'new' ? newPost.content : selectedPost.content}
                onChange={(e) => {
                  if (view === 'new') {
                    setNewPost({ ...newPost, content: e.target.value })
                  } else {
                    setSelectedPost({ ...selectedPost, content: e.target.value })
                  }
                }}
                required
              />
            </div>
            
            <div className="form-actions">
              <div className="publish-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={view === 'new' ? newPost.isPublic : selectedPost.isPublic}
                    onChange={handlePublishToggle}
                  />
                  <span className="toggle-text">Make public</span>
                </label>
              </div>
              
              <button className="save-button" onClick={handleSavePost}>
                Save
              </button>
            </div>
          </div>
        )}
      </main>
      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 1rem;
        }
        
        .header {
          padding: 2rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--light-accent);
          margin-bottom: 2rem;
        }
        
        .home-link {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 1px;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        
        .new-post-button, .back-button {
          padding: 0.5rem 1rem;
          background-color: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .sign-out-button {
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid var(--light-accent);
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .writing-space {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .section-title {
          font-size: 1.75rem;
          font-weight: 400;
          margin-bottom: 2rem;
        }
        
        .posts {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .post-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border: 1px solid var(--light-accent);
          border-radius: 4px;
        }
        
        .post-title {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
        }
        
        .post-date, .post-status {
          font-size: 0.9rem;
          color: var(--accent);
        }
        
        .post-status {
          margin-top: 0.5rem;
        }
        
        .post-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .edit-button, .delete-button {
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid var(--light-accent);
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .delete-button {
          color: #e53e3e;
          border-color: #e53e3e;
        }
        
        .no-posts {
          text-align: center;
          padding: 3rem 0;
        }
        
        .start-writing-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: var(--accent);
        }
        
        .form-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }
        
        .publish-toggle {
          display: flex;
          align-items: center;
        }
        
        .toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .toggle-text {
          margin-left: 0.5rem;
          font-size: 0.9rem;
        }
        
        .save-button {
          padding: 0.5rem 1.5rem;
          background-color: var(--accent);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        
        .loading {
          text-align: center;
          padding: 3rem 0;
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}