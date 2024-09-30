import { CoinConfigLike } from "./types";
import usdc from "@/public/usdc.png";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";
import eth from "@/public/eth.png";
import fdm from "@/assets/fdm.svg";
import bnb from "@/assets/bnb.svg";
import matic from "@/assets/matic-token.svg";
import maker from "@/assets/maker-token.svg";
import dai from "@/assets/dai-logo.svg";
import steth from "@/assets/steth-logo.svg";
import eeth from "@/assets/eeth.webp";
import ezeth from "@/assets/ezeth.webp";
import mETH from "@/assets/meth.svg";
import pzeth from "@/assets/pzeth.webp";
import reth from "@/assets/reth.svg";
import stader from "@/assets/stader.webp";
import ultraeths from "@/assets/ultraeths.webp";
import wbeth from "@/assets/wbeth.webp";
import weeth from "@/assets/weeth.webp";
import ethx from "@/assets/ethx.png";

export const coins: CoinConfigLike[] = [
  {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    icon: usdc,
    coinGeckoId: "usd-coin",
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    icon: usdt,
    coinGeckoId: "tether",
  },
  {
    name: "Fuse",
    symbol: "FUSE",
    decimals: 18,
    icon: sFuse,
    coinGeckoId: "fuse-network-token",
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    icon: weth,
    coinGeckoId: "ethereum",
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    decimals: 18,
    icon: eth,
    coinGeckoId: "ethereum",
  },
  {
    name: "Freedom",
    symbol: "FDM",
    decimals: 18,
    icon: fdm,
    coinGeckoId: "fdm",
  },
  {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    icon: bnb,
    coinGeckoId: "binancecoin",
  },
  {
    name: "Matic Token",
    symbol: "MATIC",
    decimals: 18,
    icon: matic,
    coinGeckoId: "matic-network",
  },
  {
    name: "Maker",
    symbol: "MKR",
    decimals: 18,
    icon: maker,
    coinGeckoId: "maker",
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
    icon: dai,
    coinGeckoId: "dai",
  },
  {
    name: "stETH",
    symbol: "stETH",
    decimals: 18,
    icon: steth,
    coinGeckoId: "staked-ether",
  },
  {
    name: "eETH",
    symbol: "eETH",
    decimals: 18,
    icon: eeth,
    coinGeckoId: "eeth",
  },
  {
    name: "ezETH",
    symbol: "ezETH",
    decimals: 18,
    icon: ezeth,
    coinGeckoId: "ezeth",
  },
  {
    name: "mETH",
    symbol: "mETH",
    decimals: 18,
    icon: mETH,
    coinGeckoId: "meth",
  },
  {
    name: "pzETH",
    symbol: "pzETH",
    decimals: 18,
    icon: pzeth,
    coinGeckoId: "pzeth",
  },
  {
    name: "rETH",
    symbol: "rETH",
    decimals: 18,
    icon: reth,
    coinGeckoId: "reth",
  },
  {
    name: "Stader",
    symbol: "SD",
    decimals: 18,
    icon: stader,
    coinGeckoId: "stader",
  },
  {
    name: "ultraETH",
    symbol: "ultraETH",
    decimals: 18,
    icon: ultraeths,
    coinGeckoId: "ultraeth",
  },
  {
    name: "ultraETHs",
    symbol: "ultraETHs",
    decimals: 18,
    icon: ultraeths,
    coinGeckoId: "ultraeths",
  },
  {
    name: "wBETH",
    symbol: "wBETH",
    decimals: 18,
    icon: wbeth,
    coinGeckoId: "weth",
  },
  {
    name: "weETH",
    symbol: "weETH",
    decimals: 18,
    icon: weeth,
    coinGeckoId: "weeth",
  },
  {
    name: "ETHx",
    symbol: "ETHx",
    decimals: 18,
    icon: ethx,
    coinGeckoId: "ethx",
  },
];
