/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true
    },
    // see: https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding", "eccrypto");
        return config;
    },
}

module.exports = nextConfig
