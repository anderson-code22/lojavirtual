/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["localhost", "placeholder.svg", "images.unsplash.com", "via.placeholder.com"],
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
