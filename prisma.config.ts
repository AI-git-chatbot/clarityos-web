import { config } from "dotenv";
// Prisma CLI doesn't load .env.local by default — we do it explicitly
config({ path: ".env.local" });
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DATABASE_URL must be set in .env.local (local) or Vercel env vars (production)
    url: process.env["DATABASE_URL"]!,
  },
});
