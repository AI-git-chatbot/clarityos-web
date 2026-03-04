import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js NOT to bundle Prisma — keep it as a server-side external
  // This prevents PrismaClientInitializationError during build-time page data collection
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
