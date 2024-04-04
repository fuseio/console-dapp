import { CoinConfigLike } from "./types";
import usdc from "@/public/usdc.png";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";
import eth from "@/public/eth.png";

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
    name: "Fuse",
    symbol: "FUSE",
    decimals: 18,
    icon: sFuse,
    coinGeckoId: "fuse-network-token",
  },
];
