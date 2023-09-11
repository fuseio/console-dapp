import { EIP1193Provider } from "@web3-onboard/core";
import { ethers } from "ethers";
import { CONFIG } from "@/lib/config";

export let web3OnboardProvider:
  | ethers.providers.Provider
  | ethers.Signer
  | undefined;

export const setWeb3OnboardProvider = async (
  provider: EIP1193Provider | undefined | null
) => {
  if (provider) {
    let web3OnboardProviderTemp = new ethers.providers.Web3Provider(
      provider,
      "any"
    );
    web3OnboardProvider = await web3OnboardProviderTemp.getSigner();
  } else
    web3OnboardProvider = new ethers.providers.JsonRpcProvider(
      CONFIG.fuseRPC,
      "any"
    );
};
