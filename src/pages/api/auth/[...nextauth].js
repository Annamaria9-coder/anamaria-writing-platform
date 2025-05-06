import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// This is a simple credentials provider for demonstration
// In a production environment, you would want to use a more secure method
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would typically check against your database
        // For demonstration, we'll use a hardcoded username and password
        if (credentials.username === "anamaria" && credentials.password === "yourpassword") {
          return {
            id: 1,
            name: "Anamaria",
            email: "anamaria@example.com"
          }
        }
        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key", // In production, use an environment variable
}

export default NextAuth(authOptions)