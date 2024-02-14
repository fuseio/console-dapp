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
    chainName: "BNB",
    lzChainId: 102,
    icon: bnb.src,
    chainId: 56,
    rpc: "https://weathered-side-brook.bsc.quiknode.pro/f11b337cb3411c96e514504308b95f17288330f4/",
    logo: "",
    tokenId: "binancecoin"
  },
];
