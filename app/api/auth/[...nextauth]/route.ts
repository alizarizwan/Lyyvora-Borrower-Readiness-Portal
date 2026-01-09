import NextAuth, { type NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 465,
        secure: true,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY || "",
        },
      },
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      maxAge: 24 * 60 * 60, // 24 hours
    }),
  ],
  session: {
    strategy: "database" as const,
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the callback URL is a relative path, prepend baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      // If the callback URL is on the same origin, allow it
      try {
        if (new URL(url).origin === baseUrl) {
          return url
        }
      } catch {
        // Invalid URL
      }
      // Default to assessment page after email verification
      return `${baseUrl}/assessment`
    },
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
