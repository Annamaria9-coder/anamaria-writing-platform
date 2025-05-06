import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Read() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTag, setSelectedTag] = useState('All')
  const tags = ['All', 'Thoughts', 'Poetry', 'Essays']
  
  // Fetch public posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts/public')
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
    
    fetchPosts()
  }, [])
  
  // Filter posts by tag (for future implementation)
  const filteredPosts = posts

  return (
    <div className="container">
      <Head>
        <title>Read | Anamaria</title>
        <meta name="description" content="Read thoughts, poems, and ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="header">
        <Link href="/" className="home-link">
          Anamaria
        </Link>
      </header>
      <main className="reading-space">
        <div className="tag-filter">
          {tags.map(tag => (
            <button 
              key={tag} 
              className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading writings...</div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <p>No writings have been shared yet.</p>
          </div>
        ) : (
          <div className="posts">
            {filteredPosts.map(post => (
              <article key={post._id} className="post-card">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-date">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="post-excerpt">{post.excerpt}</p>
                <Link href={`/post/${post._id}`} className="read-more">
                  Read more
                </Link>
              </article>
            ))}
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
        
        .reading-space {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .tag-filter {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        
        .tag-button {
          background: none;
          border: none;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-size: 0.9rem;
          border-radius: 20px;
          transition: all 0.2s;
        }
        
        .tag-button:hover {
          background-color: var(--light-accent);
        }
        
        .tag-button.active {
          background-color: var(--accent);
          color: white;
        }
        
        .posts {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        
        .post-card {
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--light-accent);
        }
        
        .post-title {
          font-size: 1.75rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
          font-family: var(--font-serif);
        }
        
        .post-date {
          font-size: 0.9rem;
          color: var(--accent);
          margin-bottom: 1rem;
        }
        
        .post-excerpt {
          font-family: var(--font-serif);
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        
        .read-more {
          display: inline-block;
          font-size: 0.9rem;
          color: var(--accent);
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
        }
        
        .read-more:hover {
          border-color: var(--accent);
        }
        
        @media (max-width: 600px) {
          .post-title {
            font-size: 1.5rem;
          }
        }
        
        .loading, .no-posts {
          text-align: center;
          padding: 3rem 0;
          color: var(--accent);
        }
      `}</style>
    </div>
  );
}