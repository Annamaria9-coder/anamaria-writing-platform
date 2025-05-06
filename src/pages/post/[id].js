import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

export default function Post() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Fetch post data
  useEffect(() => {
    if (!id) return
    
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${id}`)
        const data = await response.json()
        
        if (data.success) {
          setPost(data.data)
        } else {
          setError('Post not found')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        setError('Error loading post')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [id])
  
  // Handle loading state
  if (loading) {
    return <div className="container">Loading...</div>
  }
  
  // Handle error state
  if (error || !post) {
    return (
      <div className="container">
        <p>{error || 'Post not found'}</p>
        <Link href="/read" legacyBehavior>
          <a>Back to reading</a>
        </Link>
      </div>
    );
  }
  
  // Check if post is public
  if (!post.isPublic) {
    router.push('/read')
    return null
  }

  return (
    <div className="container">
      <Head>
        <title>{post.title} | Anamaria</title>
        <meta name="description" content={post.excerpt} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="header">
        <Link href="/" legacyBehavior>
          <a className="home-link">Anamaria</a>
        </Link>
        <Link href="/read" legacyBehavior>
          <a className="back-link">← Back to reading</a>
        </Link>
      </header>
      <main className="post-container">
        <article className="post">
          <header className="post-header">
            <h1 className="post-title">{post.title}</h1>
            <p className="post-date">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </header>
          
          <div className="post-content prose">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </article>
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
        
        .back-link {
          font-size: 0.9rem;
          color: var(--accent);
        }
        
        .post-container {
          max-width: 700px;
          margin: 0 auto;
          padding-bottom: 4rem;
        }
        
        .post-header {
          margin-bottom: 2.5rem;
        }
        
        .post-title {
          font-size: 2.5rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
          font-family: var(--font-serif);
          line-height: 1.2;
        }
        
        .post-date {
          font-size: 0.9rem;
          color: var(--accent);
        }
        
        .post-content {
          font-size: 1.125rem;
        }
        
        @media (max-width: 600px) {
          .post-title {
            font-size: 2rem;
          }
          
          .post-content {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}