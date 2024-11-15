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
    {
      address: "0xe453d6649643F1F460C371dC3D1da98F7922fe51",
      chainId: 184,
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
    {
      address: "0x6041d22c7458A974Cb6E752D75D03D74dcCFf522",
      chainId: 184,
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
    {
      address: "0x691118FBDa4B78747B4C1B883ae4396Dac885651",
      chainId: 184,
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
      {
        chainId: 184,
        decimals: 6,
        symbol: "USDC",
        name: "USDC Coin",
        isBridged: false,
        isNative: false,
        address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
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
      {
        chainId: 184,
        decimals: 18,
        symbol: "FUSE",
        name: "FUSE",
        isBridged: true,
        isNative: true,
        address: "0x01facC69EC7360640AA5898E852326752801674A",
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
      {
        chainId: 184,
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
        address: "0x117C0419352DDB6FE575A67FAa70315BDc4a93f3",
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
        symbol: "POL",
        name: "Pol Token",
        isBridged: true,
        isNative: false,
        address: "0x861bf3d382593ed848972cadfacba9749adce101",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "POL",
        name: "Pol Token",
        isBridged: false,
        isNative: false,
        address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      },
      {
        chainId: 102,
        decimals: 18,
        symbol: "POL",
        name: "Pol Token",
        isBridged: false,
        isNative: false,
        address: "0xCC42724C6683B7E57334c4E856f4c9965ED682bD",
      },
      {
        chainId: 109,
        decimals: 18,
        symbol: "POL",
        name: "Pol Token",
        isBridged: false,
        isNative: true,
        address: "0x",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "MKR",
        name: "Maker",
        isBridged: true,
        isNative: false,
        address: "0x303CC3f27034C4E3933DaB8E601178eD3d2A1E3c",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "MKR",
        name: "Maker",
        isBridged: false,
        isNative: false,
        address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "DAI",
        name: "Dai Stablecoin",
        isBridged: true,
        isNative: false,
        address: "0x2502F488D481Df4F5054330C71b95d93D41625C2",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "DAI",
        name: "Dai Stablecoin",
        isBridged: false,
        isNative: false,
        address: "0x6b175474e89094c44da98b954eedeac495271d0f",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "stETH",
        name: "stETH",
        isBridged: true,
        isNative: false,
        address: "0x587983b895dB50dDaBC0Aac8aDC592b29bB30D80",
        isDepositPaused: true,
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "stETH",
        name: "stETH",
        isBridged: false,
        isNative: false,
        address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
        isDepositPaused: true,
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "ultraETH",
        name: "ultraETH",
        isBridged: true,
        isNative: false,
        address: "0xc28524C6f4569a9f5C376FF440dA48ACAB43a328",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "ultraETH",
        name: "ultraETH",
        isBridged: false,
        isNative: false,
        address: "0xcbC632833687DacDcc7DfaC96F6c5989381f4B47",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "ultraETHs",
        name: "ultraETHs",
        isBridged: true,
        isNative: false,
        address: "0xb10eD6E3810c95a380E4f3e448af1755fa3368cf",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "ultraETHs",
        name: "ultraETHs",
        isBridged: false,
        isNative: false,
        address: "0xF0a949B935e367A94cDFe0F2A54892C2BC7b2131",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "weETH",
        name: "weETH",
        isBridged: true,
        isNative: false,
        address: "0x8Cd3DDbeA0E06d547a3C8Db317eaA94D2685b3d6",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "weETH",
        name: "weETH",
        isBridged: false,
        isNative: false,
        address: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "eETH",
        name: "eETH",
        isBridged: true,
        isNative: false,
        address: "0xebF6eC4Db4ED58E6d51Eea0286939f6746148756",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "eETH",
        name: "eETH",
        isBridged: false,
        isNative: false,
        address: "0x35fA164735182de50811E8e2E824cFb9B6118ac2",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "pzETH",
        name: "pzETH",
        isBridged: true,
        isNative: false,
        address: "0xC39d3776310043694E6001dcEd98Bf07ca792C74",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "pzETH",
        name: "pzETH",
        isBridged: false,
        isNative: false,
        address: "0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "ezETH",
        name: "ezETH",
        isBridged: true,
        isNative: false,
        address: "0x8bf40E191Ac82BC09D946629655A6B8Baf8f063E",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "ezETH",
        name: "ezETH",
        isBridged: false,
        isNative: false,
        address: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "wBETH",
        name: "wBETH",
        isBridged: true,
        isNative: false,
        address: "0x1e2A741C388DDBAE1182777a3AB3B2f04d14010D",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "wBETH",
        name: "wBETH",
        isBridged: false,
        isNative: false,
        address: "0xa2E3356610840701BDf5611a53974510Ae27E2e1",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "rETH",
        name: "rETH",
        isBridged: true,
        isNative: false,
        address: "0xcf77D88de80e7212c5bfe1B3438f550014Eb5F8a",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "rETH",
        name: "rETH",
        isBridged: false,
        isNative: false,
        address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "rETH",
        name: "rETH",
        isBridged: true,
        isNative: false,
        address: "0xcf77D88de80e7212c5bfe1B3438f550014Eb5F8a",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "rETH",
        name: "rETH",
        isBridged: false,
        isNative: false,
        address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "mETH",
        name: "mETH",
        isBridged: true,
        isNative: false,
        address: "0xFc05D55afB8FD38b5b3f0D943e331426023BED56",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "mETH",
        name: "mETH",
        isBridged: false,
        isNative: false,
        address: "0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "ETHx",
        name: "ETHx",
        isBridged: true,
        isNative: false,
        address: "0xf59db2e001aC129d0F173Bb6Bf320aC2cF7d8b70",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "ETHx",
        name: "ETHx",
        isBridged: false,
        isNative: false,
        address: "0xa35b1b31ce002fbf2058d22f30f95d405200a15b",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 18,
        symbol: "wstETH",
        name: "Wrapped liquid staked Ether 2.0",
        isBridged: true,
        isNative: false,
        address: "0x2931B47c2cEE4fEBAd348ba3d322cb4A17662C34",
      },
      {
        chainId: 101,
        decimals: 18,
        symbol: "wstETH",
        name: "Wrapped liquid staked Ether 2.0",
        isBridged: false,
        isNative: false,
        address: "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0",
      },
    ],
    [
      {
        chainId: 138,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: true,
        isNative: false,
        address: "0xB5D77DB2cd614e0Da80D07E47fEB9Cf118bc6979",
      },
      {
        chainId: 101,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: false,
        isNative: false,
        address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      },
      {
        chainId: 109,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: false,
        isNative: false,
        address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
      },
      {
        chainId: 111,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: false,
        isNative: false,
        address: "0x68f180fcce6836688e9084f035309e29bf0a2095",
      },
      {
        chainId: 110,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: false,
        isNative: false,
        address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
      },
      {
        chainId: 184,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: false,
        isNative: false,
        address: "0x0555e30da8f98308edb960aa94c0db47230d2b9c",
      },
      {
        chainId: 102,
        decimals: 8,
        symbol: "WBTC",
        name: "Wrapped BTC",
        isBridged: false,
        isNative: false,
        address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
      },
    ],
  ],
};
