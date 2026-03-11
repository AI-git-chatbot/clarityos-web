import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare const globalThis: {
    prismaGlobal: PrismaClient
} & typeof global

function createClient() {
    const connectionString = process.env.DATABASE_URL!
    // max: 1 is critical for serverless (Vercel) — prevents pool exhaustion on Neon
    const adapter = new PrismaPg({ connectionString, max: 1 })
    return new PrismaClient({ adapter } as any)
}

// Singleton in ALL environments — prevents "max clients reached" on Neon
// In production serverless, this limits connections per warm instance
const prisma: PrismaClient = globalThis.prismaGlobal ?? createClient()
globalThis.prismaGlobal = prisma

export default prisma
