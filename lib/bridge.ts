import { hex } from "./helpers";
import { BridgeConfigLike } from "./types";

export const bridgeConfig: BridgeConfigLike = {
  version: 2,
  fuse: {
    chainId: 138,
    wrapped: "0xF2f8fBC78F25F59c9319eB21aAD41bDB869D8d0C",
  },
  original: [
    {
      address: "0x10f3873fB61E03537089455C865E1447C4Ee3B93",
      chainId: 102,
    },
  ],
  wrapped: [
    {
      address: "0x853958E49b54F8655805A43C1194390019F92630",
      chainId: 102,
    },
  ],
  originalFuse: [
    {
      address: "0x2aCb653b903795634628Fc4D731b25D5FE25E803",
      chainId: 102,
    },
  ],
  tokens: [
    [
      {
        chainId: 138,
        decimals: 6,
        symbol: "USDC",
        name: "USD Coin",
        isBridged: true,
        isNative: false,
        address: "0x1E93F2E072f73F903A08456A4604a8bb7067C4fd",
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "USDC",
        name: "USDC Coin",
        isBridged: false,
        isNative: false,
        address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: false,
        isNative: true,
        address: hex,
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0x945F7f0411Bd83804C50941156C099242E6A9310",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 6,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: true,
        isNative: false,
        address: "0x48C3faBa98012c6d32bAea8840844548f8D20579",
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: false,
        isNative: false,
        address: "0x55d398326f99059ff775485246999027b3197955",
      },
    ],
  ],
};
