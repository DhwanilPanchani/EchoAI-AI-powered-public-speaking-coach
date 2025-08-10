/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: (config) => {
      config.resolve.fallback = {
        fs: false,
        encoding: false,
      };
      return config;
    },
  }
  
  module.exports = nextConfig