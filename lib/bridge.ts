import { hex } from "./helpers";
import { BridgeConfigLike } from "./types";

export const bridgeConfig: BridgeConfigLike = {
  version: 2,
  fuse: {
    chainId: 138,
    wrapped: "0x353af4878d7452e974538706273887F7ED90Da47",
  },
  original: [
    {
      address: "0x8f5D6332eD11338D2dA4fAAC6675e9A6757BeC8b",
      chainId: 109,
    },
    {
      address: "0xb0F9cE8598c623Ff42e52388F9b452B7CDc409a1",
      chainId: 145,
    },
    {
      address: "0x081dF5af5d022D4A4a4520D4D0D336B8432fDBBb",
      chainId: 111,
    },
    {
      address: "0x081dF5af5d022D4A4a4520D4D0D336B8432fDBBb",
      chainId: 110,
    },
    {
      address: "0x95f51f18212c6bCFfB819fDB2035E5757954B7B9",
      chainId: 101,
    },
    {
      address: "0x081dF5af5d022D4A4a4520D4D0D336B8432fDBBb",
      chainId: 102,
    },
  ],
  wrapped: [
    {
      address: "0xe453d6649643F1F460C371dC3D1da98F7922fe51",
      chainId: 109,
    },
    {
      address: "0x4014115fB4816Bc8343d8e69d2708Fa738dCaa15",
      chainId: 145,
    },
    {
      address: "0xEEd9154F63f6F0044E6b00dDdEFD895b5B4ED580",
      chainId: 111,
    },
    {
      address: "0xe453d6649643F1F460C371dC3D1da98F7922fe51",
      chainId: 110,
    },
    {
      address: "0x0A40e573C72EFd75933C7a18a42155132122Bc86",
      chainId: 101,
    },
    {
      address: "0xADef29442A11ad9308aC5D012965c887Cf2A53D3",
      chainId: 102,
    },
  ],
  originalFuse: [
    {
      address: "0x36207130CF22d8C54842569A32a0Cd5D711f3580",
      chainId: 109,
    },
    {
      address: "0xc465107230c21f154627e017b6727A3C18984B02",
      chainId: 145,
    },
    {
      address: "0xeC3FD32cd5389FbC581427A648d6dc1bc5cfFE3B",
      chainId: 111,
    },
    {
      address: "0x56dF61E9f39C75e2d84C05753557bEBB9841Eb5B",
      chainId: 110,
    },
    {
      address: "0x6fA258e755A20e46c28239c40125e2847c3eE5E8",
      chainId: 101,
    },
    {
      address: "0x6bd341B6C7d6123D28d3DDee6A65d441DbAC1E90",
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
        address: "0x28C3d1cD466Ba22f6cae51b1a4692a831696391A",
      },
      {
        chainId: 109,
        decimals: 6,
        symbol: "USDC",
        name: "USD Coin (PoS)",
        isBridged: false,
        isNative: false,
        address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      },
      {
        chainId: 111,
        decimals: 6,
        symbol: "USDC",
        name: "USDC Coin",
        isBridged: false,
        isNative: false,
        address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      },
      {
        chainId: 110,
        decimals: 6,
        symbol: "USDC",
        name: "USDC Coin",
        isBridged: false,
        isNative: false,
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      },
      {
        chainId: 101,
        decimals: 6,
        symbol: "USDC",
        name: "USDC Coin",
        isBridged: false,
        isNative: false,
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
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
        chainId: 109,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0x6b021b3f68491974bE6D4009fEe61a4e3C708fD6",
      },
      {
        chainId: 111,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0xe453d6649643F1F460C371dC3D1da98F7922fe51",
      },
      {
        chainId: 110,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0x6b021b3f68491974bE6D4009fEe61a4e3C708fD6",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0x970B9bB2C0444F5E81e9d0eFb84C8ccdcdcAf84d",
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0x5857c96DaE9cF8511B08Cb07f85753C472D36Ea3",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "WETH",
        name: "Wrapped Ether",
        isBridged: true,
        isNative: false,
        address: "0x5622F6dC93e08a8b717B149677930C38d5d50682",
      },
      {
        chainId: 109,
        decimals: 18,
        symbol: "WETH",
        name: "Wrapped Ether",
        isBridged: false,
        isNative: false,
        address: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      }
    ],
    [
      {
        chainId: 138,
        decimals: 6,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: true,
        isNative: false,
        address: "0x68c9736781E9316ebf5c3d49FE0C1f45D2D104Cd",
      },
      {
        chainId: 109,
        decimals: 6,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: false,
        isNative: false,
        address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      },
      {
        chainId: 111,
        decimals: 6,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: false,
        isNative: false,
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      },
      {
        chainId: 110,
        decimals: 6,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: false,
        isNative: false,
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      },
      {
        chainId: 101,
        decimals: 6,
        symbol: "USDT",
        name: "Tether USD",
        isBridged: false,
        isNative: false,
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
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
    [
      {
        chainId: 111,
        decimals: 18,
        symbol: "ETH",
        name: "Ether",
        isBridged: false,
        isNative: true,
        address: "0x4200000000000000000000000000000000000006",
        receiveToken: {
          name: "Wrapped Ether",
          symbol: "WETH",
        },
      },
      {
        chainId: 110,
        decimals: 18,
        symbol: "ETH",
        name: "Ether",
        isBridged: false,
        isNative: true,
        address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
        receiveToken: {
          name: "Wrapped Ether",
          symbol: "WETH",
        },
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "ETH",
        name: "Ether",
        isBridged: false,
        isNative: true,
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        receiveToken: {
          name: "Wrapped Ether",
          symbol: "WETH",
        },
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "ETH",
        name: "Ether",
        isBridged: false,
        isNative: false,
        address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        receiveToken: {
          name: "Wrapped Ether",
          symbol: "WETH",
        },
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "FDM",
        name: "Freedom",
        isBridged: true,
        isNative: false,
        address: "0xE3Df2C1f1ca54707AB49747eeBc7658bb1c8Bf1C",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "FDM",
        name: "Freedom",
        isBridged: false,
        isNative: false,
        address: "0x60d91f6D394c5004A782E0D175E2b839e078FB83",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "BNB",
        name: "Binance Coin",
        isBridged: true,
        isNative: false,
        address: "0x117C0419352DDB6FE575A67FAa70315BDc4a93f3"
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "BNB",
        name: "Binance Coin",
        isBridged: false,
        isNative: false,
        address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "BNB",
        name: "Binance Coin",
        isBridged: false,
        isNative: true,
        address: "0x",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "MATIC",
        name: "Matic Token",
        isBridged: true,
        isNative: false,
        address: "0x861bf3d382593ed848972cadfacba9749adce101"
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "MATIC",
        name: "Matic Token",
        isBridged: false,
        isNative: false,
        address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "MATIC",
        name: "Matic Token",
        isBridged: false,
        isNative: false,
        address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD"
      },
      {
        chainId: 109,
        decimals: 18,
        symbol: "MATIC",
        name: "Matic Token",
        isBridged: false,
        isNative: true,
        address: "0x"
      },
    ]
  ],
};
