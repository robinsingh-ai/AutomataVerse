/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: [
      'lh3.googleusercontent.com',  // For Google profile images
      'avatars.githubusercontent.com',  // Just in case for GitHub profile images
      'googleusercontent.com'  // For other Google user content domains
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during `yarn build`
  },
};

export default nextConfig;
