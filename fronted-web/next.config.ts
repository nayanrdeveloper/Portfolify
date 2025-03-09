import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: {
        nodeMiddleware: false,
    },
    /* config options here */
};

export default nextConfig;
