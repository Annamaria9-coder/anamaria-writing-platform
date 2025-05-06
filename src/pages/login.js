import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session } = useSession()
  
  // If already logged in, redirect to write page
  if (session) {
    router.push('/write')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password
    })
    
    if (result.error) {
      setError('Invalid username or password')
    } else {
      router.push('/write')
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Login | Anamaria</title>
        <meta name="description" content="Login to your writing space" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="header">
        <Link href="/" legacyBehavior>
          <a className="home-link">Anamaria</a>
        </Link>
      </header>
      <main className="login-container">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Enter your private writing space</p>
          
          {error && <p className="error-message">{error}</p>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>
            
            <button type="submit" className="login-button">
              Enter
            </button>
          </form>
        </div>
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
        
        .login-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem 0;
        }
        
        .login-card {
          padding: 2rem;
          border: 1px solid var(--light-accent);
          border-radius: 8px;
        }
        
        .login-title {
          font-size: 1.75rem;
          font-weight: 400;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .login-subtitle {
          text-align: center;
          color: var(--accent);
          margin-bottom: 2rem;
        }
        
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .form-group label {
          font-size: 0.9rem;
          color: var(--accent);
        }
        
        .login-button {
          background-color: var(--accent);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
          transition: background-color 0.2s;
        }
        
        .login-button:hover {
          background-color: #5a6868;
        }
        
        .error-message {
          color: #e53e3e;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}