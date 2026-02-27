import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'ulems.my.id',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // ✅ tambahkan ini
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ✅ tambahkan ini
      },
    ],
  },
};

export default nextConfig;
