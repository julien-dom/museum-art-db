/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
   domains: ['www.artic.edu', 'openaccess-cdn.clevelandart.org', 'nrs.harvard.edu'],

  },
};

module.exports = nextConfig;