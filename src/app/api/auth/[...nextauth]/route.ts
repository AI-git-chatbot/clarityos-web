import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic";

const providers = []

// ── Google OAuth (real login — set these in .env.local) ──────────────────────
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
    )
}

// ── Demo credentials (local dev fallback) ────────────────────────────────────
providers.push(
    CredentialsProvider({
        id: "credentials",
        name: "Demo Account",
        credentials: {},
        async authorize() {
            let user = await prisma.user.findUnique({ where: { email: "demo@woker.com" } })
            if (!user) {
                user = await prisma.user.create({
                    data: { name: "Demo User", email: "demo@woker.com" }
                })
            }
            return { id: user.id, name: user.name, email: user.email }
        }
    })
)

export const authOptions: NextAuthOptions = {
    providers,
    callbacks: {
        async signIn({ user }) {
            // Auto-create a DB user on first Google login
            if (user.email) {
                const existing = await prisma.user.findUnique({ where: { email: user.email } })
                if (!existing) {
                    await prisma.user.create({
                        data: { name: user.name ?? "ClarityOS User", email: user.email, image: user.image }
                    })
                }
            }
            return true
        },
        async session({ session }) {
            if (session?.user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email }
                })
                if (dbUser) {
                    session.user = {
                        ...session.user,
                        id: dbUser.id,
                        apiToken: dbUser.apiToken,
                    } as any
                }
            }
            return session
        }
    },
    pages: {
        signIn: "/",  // redirect to home (landing page) for sign-in
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

