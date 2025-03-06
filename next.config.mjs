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
};

export default nextConfig;
