/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
