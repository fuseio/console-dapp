/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/points',
        destination: '/rewards',
        permanent: true,
      },
      {
        source: '/points/:path*',
        destination: '/rewards/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true
  },
  // see: https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding", "eccrypto");
    return config;
  },
};

export default nextConfig;
