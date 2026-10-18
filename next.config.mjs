/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
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
