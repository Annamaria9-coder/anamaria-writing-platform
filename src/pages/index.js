import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  // Simple animation on load
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`welcome-container ${mounted ? 'fade-in' : ''}`}>
      <Head>
        <title>Anamaria | A Personal Writing Space</title>
        <meta name="description" content="A quiet space for thoughts and writings" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet" />
      </Head>
      <main className="welcome">
        <h1 className="welcome-title">Anamaria</h1>
        <p className="welcome-description">
          A quiet space for thoughts, poems, and ideas.
        </p>
        
        <div className="welcome-links">
          <Link href="/read" legacyBehavior>
            <a className="welcome-link">Read</a>
          </Link>
          <Link href="/write" legacyBehavior>
            <a className="welcome-link welcome-link-accent">Write</a>
          </Link>
        </div>
      </main>
      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          opacity: 0;
          transition: opacity 1s ease-in-out;
        }
        
        .fade-in {
          opacity: 1;
        }
        
        .welcome {
          padding: 2rem;
        }
        
        .welcome-title {
          font-size: 3rem;
          font-weight: 300;
          margin-bottom: 1rem;
          letter-spacing: 1px;
        }
        
        .welcome-description {
          font-size: 1.25rem;
          color: var(--accent);
          margin-bottom: 3rem;
          font-weight: 300;
        }
        
        .welcome-links {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
        }
        
        .welcome-link {
          padding: 0.75rem 2rem;
          border: 1px solid var(--light-accent);
          border-radius: 4px;
          font-size: 1.125rem;
          transition: all 0.2s;
        }
        
        .welcome-link:hover {
          background-color: var(--light-accent);
        }
        
        .welcome-link-accent {
          background-color: var(--accent);
          color: white;
          border: 1px solid var(--accent);
        }
        
        .welcome-link-accent:hover {
          background-color: #5a6868;
          border-color: #5a6868;
        }
      `}</style>
    </div>
  );
}