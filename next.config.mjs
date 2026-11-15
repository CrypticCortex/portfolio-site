/** @type {import('next').NextConfig} */
const nextConfig = {
  // the old subpages now live inside the zine
  async redirects() {
    return [
      { source: '/research', destination: '/#p11', permanent: true },
      { source: '/education', destination: '/#p12', permanent: true },
      { source: '/stack', destination: '/#p13', permanent: true },
    ];
  },
};

export default nextConfig;
