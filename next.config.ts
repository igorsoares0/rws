import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  serverExternalPackages: ['@prisma/client', 'prisma']
};

export default nextConfig;
