/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',

    // Static export requires unoptimized images or custom loader
    images: {
        unoptimized: true,
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

    // Trailing slash for static hosting
    trailingSlash: true,
}

export default nextConfig
