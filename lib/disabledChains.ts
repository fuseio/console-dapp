import eth from "@/public/eth.png";
import bnb from "@/public/bnb.png";
import voltage from "@/public/voltage.png";
import { DisabledChainConfigLike } from "./types";

export const disabledChains: DisabledChainConfigLike[] = [
  {
    chainName: "Ethereum",
    icon: eth.src,
    appLogo: voltage.src,
    appName: "Voltage Finance",
    appURL: "https://app.voltage.finance/#/bridge",
  },
  {
    chainName: "BNB",
    icon: bnb.src,
    appLogo: voltage.src,
    appName: "Voltage Finance",
    appURL: "https://app.voltage.finance/#/bridge",
  },
];
