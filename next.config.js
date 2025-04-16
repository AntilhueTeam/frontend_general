/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {

  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig;


