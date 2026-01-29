import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // MANDATORY for Docker-based deployments
  images: {
    remotePatterns: [
      // Conditional spread: only add if NEXT_PUBLIC_SERVER_URL is defined
      ...(process.env.NEXT_PUBLIC_SERVER_URL
        ? [
          {
            hostname: new URL(process.env.NEXT_PUBLIC_SERVER_URL).hostname,
            protocol: new URL(process.env.NEXT_PUBLIC_SERVER_URL).protocol.replace(':', ''),
          },
        ]
        : []),
      // Fallback for local development
      {
        hostname: 'localhost',
        protocol: 'http',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
