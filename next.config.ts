import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: {
        loader: "custom",
        loaderFile: './src/app/image/loader.ts',
        domains: ['picsum.photos'],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
