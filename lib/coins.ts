import { CoinConfigLike } from "./types";
import usdc from "@/public/usdc.png";
import sFuse from "@/assets/sFuse.svg";
import weth from "@/assets/weth.svg";
import usdt from "@/assets/usdt-logo.svg";

export const coins: CoinConfigLike[] = [
  {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    icon: usdc.src,
    coinGeckoId: "usd-coin",
  },
  {
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    icon: weth.src,
    coinGeckoId: "weth",
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    icon: usdt.src,
    coinGeckoId: "tether",
  },
  {
    name: "Fuse",
    symbol: "FUSE",
    decimals: 18,
    icon: sFuse.src,
    coinGeckoId: "fuse-network-token",
  },
];
