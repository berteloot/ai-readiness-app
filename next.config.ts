import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // SECURITY: Removed typescript.ignoreBuildErrors = true
  // SECURITY: Removed eslint.ignoreDuringBuilds = true
  // These settings can mask critical errors and lead to shipping broken/unsafe code
  
  // Enable proper error checking during builds
  typescript: {
    // Ensure TypeScript errors are caught during build
    ignoreBuildErrors: false,
  },
  
  eslint: {
    // Ensure ESLint errors are caught during build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
