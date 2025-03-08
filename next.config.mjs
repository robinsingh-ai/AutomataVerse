/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google profile images
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // Just in case for GitHub profile images
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // For other Google user content domains
        pathname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during `yarn build`
  },
  
  // Disable source maps in production to prevent source code exposure
  productionBrowserSourceMaps: false,

  // Add security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Compress output for better performance
  compress: true,

  // Configure webpack to further hide source
  webpack: (config, { dev, isServer }) => {
    // Only apply in production client builds
    if (!dev && !isServer) {
      // Avoid exposing filenames
      config.optimization.minimizer.forEach((plugin) => {
        if (plugin.constructor.name === 'TerserPlugin') {
          plugin.options.terserOptions.compress.drop_console = true;
          plugin.options.terserOptions.output = {
            ...plugin.options.terserOptions.output,
            comments: false,
          };
        }
      });
    }

    return config;
  },
};

export default nextConfig;
