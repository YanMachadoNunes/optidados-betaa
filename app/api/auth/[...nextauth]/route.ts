import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/utils"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email === "admin@optigestao.com" && credentials?.password === "admin123") {
          const user = await prisma.user.findUnique({
            where: { email: "admin@optigestao.com" }
          })
          
          if (user) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          }
          
          return {
            id: "fallback-admin-id",
            name: "Administrador",
            email: "admin@optigestao.com",
          }
        }
        return null
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === "google" && user.email) {
        // Cria ou atualiza o usuário no banco
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
          },
          create: {
            email: user.email,
            name: user.name || "Usuário Google",
            image: user.image,
            plan: "FREE",
          },
        })
      }
      return true
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.id = token.sub || token.id
      }
      return session
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
