import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

declare const globalThis: {
    prismaGlobal: PrismaClient
} & typeof global

function createClient() {
    const connectionString = process.env.DATABASE_URL!
    const adapter = new PrismaPg({ connectionString })
    return new PrismaClient({ adapter } as any)
}

const prisma: PrismaClient = globalThis.prismaGlobal ?? createClient()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
