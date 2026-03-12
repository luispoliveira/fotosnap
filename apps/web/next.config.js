/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/trpc'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fotosnap-luispoliveira.s3.eu-central-1.amazonaws.com',
      },
      {
        protocol: process.env.BACKEND_PROTOCOL,
        hostname: process.env.BACKEND_HOST,
      },
    ],
  },
};

export default nextConfig;
