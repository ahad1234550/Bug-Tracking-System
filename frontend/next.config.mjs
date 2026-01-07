/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'], // whitelist your backend hostname
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
