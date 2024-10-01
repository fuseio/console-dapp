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
    name: "Pol Token",
    symbol: "POL",
    decimals: 18,
    icon: pol,
    coinGeckoId: "pol-network",
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
];
