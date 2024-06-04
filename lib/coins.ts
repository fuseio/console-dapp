import { CoinConfigLike } from "./types";
import usdc from "@/public/usdc.png";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";
import eth from "@/public/eth.png";
import fdm from "@/assets/fdm.svg";
import bnb from "@/assets/bnb.svg";
import matic from "@/assets/matic-token.svg";

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
];
