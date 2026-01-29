/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cms.wlf.com.mx',
            },
            {
                protocol: 'https',
                hostname: 'media.wlf.com.mx',
            },
        ],
    },
    async rewrites() {
        return [
            // Proxy API requests to CMS
            {
                source: '/api/:path*',
                destination: `${process.env.CMS_URL || 'http://localhost:3001'}/api/:path*`,
            },
        ]
    },
}

export default nextConfig
