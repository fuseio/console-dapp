import { ExchangeConfigLike } from "./types";
import binance from "@/public/binance.png";
import coinbase from "@/public/coinbase.png";
import kucoin from "@/public/kucoin.png";
import huobi from "@/public/huobi.png";
import layerswap from "@/public/layerswap.png";

export const exchanges: ExchangeConfigLike[] = [
  {
    name: "Binance",
    icon: binance,
    website: "https://www.binance.com",
    bridges: [
      {
        name: "LayerSwap",
        website: "https://layerswap.io",
        icon: layerswap,
      },
    ],
  },
  {
    name: "Coinbase",
    icon: coinbase,
    website: "https://www.coinbase.com",
    bridges: [
      {
        name: "LayerSwap",
        website: "https://layerswap.io",
        icon: layerswap,
      },
    ],
  },
  {
    name: "KuCoin",
    icon: kucoin,
    website: "https://www.kucoin.com",
    bridges: [
      {
        name: "LayerSwap",
        website: "https://layerswap.io",
        icon: layerswap,
      },
    ],
  },
  {
    name: "Huobi Global",
    icon: huobi,
    website: "https://www.huobi.com",
    bridges: [
      {
        name: "LayerSwap",
        website: "https://layerswap.io",
        icon: layerswap,
      },
    ],
  },
];
