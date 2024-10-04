import { ChainConfigLike } from "./types";
import pol from "@/public/pol.png";
import arbi from "@/public/arbi.png";
import optimism from "@/public/optimism.png";
import polLogo from "@/assets/pol";
import arbiLogo from "@/assets/arbi";
import optimismLogo from "@/assets/optimism";
import eth from "@/public/eth.png";
import bnb from "@/public/bnb.png";
import base from "@/assets/base.svg";

export const chains: ChainConfigLike[] = [
  {
    chainName: "Polygon",
    lzChainId: 109,
    icon: pol,
    rpc: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_POLYGON_API_KEY}`,
    chainId: 137,
    logo: polLogo,
    tokenId: "pol-network"
  },
  {
    chainName: "Arbitrum",
    lzChainId: 110,
    icon: arbi,
    chainId: 42161,
    rpc: `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ARBITRUM_API_KEY}`,
    logo: arbiLogo,
    tokenId: "arbitrum",
    gasTokenId: "ethereum"
  },
  {
    chainName: "Optimism",
    lzChainId: 111,
    icon: optimism,
    rpc: `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_OPTIMISM_API_KEY}`,
    chainId: 10,
    logo: optimismLogo,
    tokenId: "optimism",
    gasTokenId: "ethereum"
  },
  {
    chainName: "Ethereum",
    lzChainId: 101,
    icon: eth,
    chainId: 1,
    rpc: `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ETHEREUM_API_KEY}`,
    logo: "",
    tokenId: "ethereum"
  },
  {
    chainName: "BNB",
    lzChainId: 102,
    icon: bnb,
    chainId: 56,
    rpc: "https://weathered-side-brook.bsc.quiknode.pro/f11b337cb3411c96e514504308b95f17288330f4/",
    logo: "",
    tokenId: "binancecoin"
  },
  {
    chainName: "Base",
    lzChainId: 184,
    icon: base,
    chainId: 8453,
    rpc: `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_BASE_API_KEY}`,
    logo: "",
    tokenId: "base",
    gasTokenId: "ethereum"
  },
];
