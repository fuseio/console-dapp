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
    rpc: "https://polygon-mainnet.infura.io/v3/25d92ff45be9484f8a8b67525a8e6313",
    chainId: 137,
    logo: maticLogo,
    tokenId: "matic-network"
  },
  {
    chainName: "Arbitrum",
    lzChainId: 110,
    icon: arbi.src,
    chainId: 42161,
    rpc: "https://rpc.tornadoeth.cash/arbitrum",
    logo: arbiLogo,
    tokenId: "arbitrum"
  },
  {
    chainName: "Optimism",
    lzChainId: 111,
    icon: optimism.src,
    rpc: "https://optimism-mainnet.infura.io/v3/feb624522609433abbaef05c015eeae3",
    chainId: 10,
    logo: optimismLogo,
    tokenId: "optimism"
  },
  {
    chainName: "Ethereum",
    lzChainId: 101,
    icon: eth.src,
    chainId: 1,
    rpc: "https://rpc.eth.gateway.fm",
    logo: "",
    tokenId: "ethereum"
  },
  {
    chainName: "BNB",
    lzChainId: 102,
    icon: bnb.src,
    chainId: 56,
    rpc: "https://weathered-side-brook.bsc.quiknode.pro/f11b337cb3411c96e514504308b95f17288330f4/",
    logo: "",
    tokenId: "binancecoin"
  },
];
