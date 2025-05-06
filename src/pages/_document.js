import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        
        {/* Add global CSS variables */}
        <style jsx global>{`
          :root {
            --accent: #6b7280;
            --light-accent: #e5e7eb;
            --background: #ffffff;
            --text: #1f2937;
          }
          
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          html,
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
            color: var(--text);
            background-color: var(--background);
            line-height: 1.6;
          }
          
          a {
            color: inherit;
            text-decoration: none;
          }
          
          .input, .textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--light-accent);
            border-radius: 4px;
            font-family: inherit;
            font-size: 1rem;
          }
          
          .textarea {
            min-height: 300px;
            resize: vertical;
          }
        `}</style>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}