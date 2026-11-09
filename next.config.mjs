/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days (prevents constant Vercel Image Optimization recalculations)
    deviceSizes: [640, 750, 1080, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // 1. Immutable Edge CDN Caching for Static Images & Media Assets (1 Year)
        // Drastically cuts Vercel Fast Origin Transfer and Fast Data Transfer
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|mp4|webm|mov|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // 2. Edge CDN Caching for CMS API Hydration (reduces Function Invocations)
        source: '/api/cms',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/team',
        destination: '/about#team',
        permanent: true,
      },
      {
        source: '/projects/mantle',
        destination: '/projects/the-mantle',
        permanent: true,
      },
      {
        source: '/projects/mantle-buildofy',
        destination: '/projects/the-mantle',
        permanent: true,
      },
      {
        source: '/projects/zenith-residence',
        destination: '/projects/the-mantle',
        permanent: true,
      },
      {
        source: '/projects/nirvana',
        destination: '/projects/echoes-of-nirvana',
        permanent: true,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
