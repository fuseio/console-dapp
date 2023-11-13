import { ChainConfigLike } from "./types";
import matic from "@/public/matic.png";
import arbi from "@/public/arbi.png";
import optimism from "@/public/optimism.png";
import maticLogo from "@/assets/matic";
import arbiLogo from "@/assets/arbi";
import optimismLogo from "@/assets/optimism";
import eth from "@/public/eth.png";
import bnb from "@/public/bnb.png";

export const chains: ChainConfigLike[] = [
  {
    chainName: "Polygon",
    lzChainId: 109,
    icon: matic.src,
    rpc: "https://rpc-mainnet.maticvigil.com",
    chainId: 137,
    logo: maticLogo,
  },
  {
    chainName: "Arbitrum",
    lzChainId: 110,
    icon: arbi.src,
    chainId: 42161,
    rpc: "https://arb1.arbitrum.io/rpc",
    logo: arbiLogo,
  },
  {
    chainName: "Optimism",
    lzChainId: 111,
    icon: optimism.src,
    rpc: "https://mainnet.optimism.io",
    chainId: 10,
    logo: optimismLogo,
  },
  {
    chainName: "Ethereum",
    lzChainId:101,
    icon: eth.src,
    chainId:1,
    rpc:"https://rpc.eth.gateway.fm",
    logo:""
  },
  {
    chainName: "BNB",
    lzChainId:102,
    icon: bnb.src,
    chainId:56,
    rpc:"https://weathered-side-brook.bsc.quiknode.pro/f11b337cb3411c96e514504308b95f17288330f4/",
    logo:""
  },
];
