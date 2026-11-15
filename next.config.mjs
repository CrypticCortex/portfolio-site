/** @type {import('next').NextConfig} */
const nextConfig = {
  // the old subpages are stops on the journey now
  async redirects() {
    return ['/research', '/education', '/stack'].map((source) => ({ source, destination: '/', permanent: true }));
  },
};

export default nextConfig;
