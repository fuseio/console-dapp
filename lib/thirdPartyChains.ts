import { ThirdPartyChainConfigLike } from "./types";
import solana from "@/assets/solana.svg";
import allbridge from "@/assets/allbridge.png";

export const thirdPartyChains: ThirdPartyChainConfigLike[] = [
  {
    chainName: "Solana",
    icon: solana,
    appLogo: allbridge,
    appName: "Allbridge Classic",
    appDepositURL: "https://app.allbridge.io/bridge?from=SOL&to=FUSE&asset=USDC",
    appWithdrawURL: "https://app.allbridge.io/bridge?from=FUSE&to=SOL&asset=asUSDC",
  },
];
