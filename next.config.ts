import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'seu-bucket.s3.amazonaws.com'],
  },
  serverExternalPackages: ['@prisma/client', 'prisma']
};

export default nextConfig;
