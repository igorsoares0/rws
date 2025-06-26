import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'seu-bucket.s3.amazonaws.com'],
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  }
};

export default nextConfig;
