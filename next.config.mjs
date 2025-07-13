/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify: true, // aktifkan jika perlu
  images: {
    domains: ['mockapi.io', 'via.placeholder.com'],
  },
};

export default nextConfig;
