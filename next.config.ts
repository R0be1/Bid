
import type {NextConfig} from 'next';

// Read the comma-separated list of image domains from the .env file
const imageDomains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS?.split(',').filter(Boolean) || [];

// Generate remotePatterns from the list of domains
const remotePatterns = imageDomains.map(hostname => ({
  protocol: 'https',
  hostname: hostname,
  port: '',
  pathname: '/**',
}));


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: remotePatterns,
  },
  webpack: (config, { isServer }) => {
    // Suppress warnings from handlebars library
    config.externals.push({
      // handlebars: 'commonjs handlebars'
    });
    config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /require\.extensions/,
    ];
    return config;
  }
};

export default nextConfig;
