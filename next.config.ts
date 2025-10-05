import type { NextConfig } from 'next'

const allowedBots = '.*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*'

export default {
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-feather'],
  },
  transpilePackages: ['@11labs/react'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/preview',
        has: [{ key: 'user-agent', type: 'header', value: allowedBots }],
      },
    ]
  },
} as NextConfig
