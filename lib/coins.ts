import { CoinConfigLike } from "./types";
import usdc from "@/public/usdc.png";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";
import eth from "@/public/eth.png";
import fdm from "@/assets/fdm.svg";
import bnb from "@/assets/bnb.svg";
import pol from "@/assets/pol-token.svg";
import maker from "@/assets/maker-token.svg";
import dai from "@/assets/dai-logo.svg";
import steth from "@/assets/steth-logo.svg";
import eeth from "@/assets/eeth.webp";
import ezeth from "@/assets/ezeth.webp";
import mETH from "@/assets/meth.png";
import pzeth from "@/assets/pzeth.webp";
import reth from "@/assets/reth.svg";
import ultraeths from "@/assets/ultraeths.webp";
import wbeth from "@/assets/wbeth.webp";
import weeth from "@/assets/weeth.webp";
import ethx from "@/assets/ethx.png";
import wstETH from "@/assets/wstETH.png";

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
    coinGeckoId: "weth",
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
    coinGeckoId: "freedom-coin",
  },
  {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
    icon: bnb,
    coinGeckoId: "binancecoin",
  },
  {
    name: "Pol Token",
    symbol: "POL",
    decimals: 18,
    icon: pol,
    coinGeckoId: "polygon-ecosystem-token",
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
    coinGeckoId: "ether-fi-staked-eth",
  },
  {
    name: "ezETH",
    symbol: "ezETH",
    decimals: 18,
    icon: ezeth,
    coinGeckoId: "renzo-restaked-eth",
  },
  {
    name: "mETH",
    symbol: "mETH",
    decimals: 18,
    icon: mETH,
    coinGeckoId: "mantle-staked-ether",
  },
  {
    name: "pzETH",
    symbol: "pzETH",
    decimals: 18,
    icon: pzeth,
    coinGeckoId: "renzo-restaked-lst",
  },
  {
    name: "rETH",
    symbol: "rETH",
    decimals: 18,
    icon: reth,
    coinGeckoId: "rocket-pool-eth",
  },
  {
    name: "ultraETH",
    symbol: "ultraETH",
    decimals: 18,
    icon: ultraeths,
    coinGeckoId: "affine-ultraeths-2-0",
  },
  {
    name: "ultraETHs",
    symbol: "ultraETHs",
    decimals: 18,
    icon: ultraeths,
    coinGeckoId: "affine-ultraeths-2-0",
  },
  {
    name: "wBETH",
    symbol: "wBETH",
    decimals: 18,
    icon: wbeth,
    coinGeckoId: "wrapped-beacon-eth",
  },
  {
    name: "weETH",
    symbol: "weETH",
    decimals: 18,
    icon: weeth,
    coinGeckoId: "wrapped-eeth",
  },
  {
    name: "ETHx",
    symbol: "ETHx",
    decimals: 18,
    icon: ethx,
    coinGeckoId: "stader-ethx",
  },
  {
    name: "Wrapped liquid staked Ether 2.0",
    symbol: "wstETH",
    decimals: 18,
    icon: wstETH,
    coinGeckoId: "wrapped-steth",
  },
];
