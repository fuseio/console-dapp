import { Signer, ethers } from "ethers";
import { OriginalTokenBridgeAbi } from "@/lib/abi/OriginalTokenBridge";
import { web3OnboardProvider } from "./provider";
import { AdapterParams } from "@layerzerolabs/ui-core";
import { serializeAdapterParams } from "@layerzerolabs/ui-evm";

const getOriginalTokenBridge = (
  contractAddress: string,
  signerOrProvider: Signer | ethers.providers.Provider | undefined
) => {
  const contract = new ethers.Contract(
    contractAddress,
    OriginalTokenBridgeAbi,
    signerOrProvider
  );
  return contract;
};

export const bridgeOriginal = async (
  bridgeAddress: string,
  address: string,
  tokenAddres: string,
  amount: string,
  decimals: number,
  dstChainId: number
) => {
  const contract = getOriginalTokenBridge(bridgeAddress, web3OnboardProvider);
  const dstGasLimit = await contract.minDstGasLookup(dstChainId, 0);
  const adapterParams = AdapterParams.forV1(Number(dstGasLimit));
  const nativeFee = (
    await contract.estimateBridgeFee(
      false,
      serializeAdapterParams(adapterParams)
    )
  ).nativeFee;
  const increasedNativeFee = (Number(nativeFee) * 1.2).toFixed(0)
  const amt = ethers.utils.parseUnits(amount, decimals);
  const callParams = {
    refundAddress: address,
    zroPaymentAddress: ethers.constants.AddressZero,
  };
  const tx = await contract.bridge(
    tokenAddres,
    amt,
    address,
    callParams,
    serializeAdapterParams(adapterParams),
    { value: increasedNativeFee }
  );
  await tx.wait();
  return tx.hash;
};

export const bridgeNative = async (
  bridgeAddress: string,
  address: string,
  amount: string,
  decimals: number,
  dstChainId: number
) => {
  const contract = getOriginalTokenBridge(bridgeAddress, web3OnboardProvider);
  const dstGasLimit = await contract.minDstGasLookup(dstChainId, 0);
  const adapterParams = AdapterParams.forV1(Number(dstGasLimit));
  const nativeFee = (
    await contract.estimateBridgeFee(
      false,
      serializeAdapterParams(adapterParams)
    )
  ).nativeFee;
  const increasedNativeFee = (Number(nativeFee) * 1.2).toFixed(0);
  const amt = ethers.utils.parseEther(amount);
  const callParams = {
    refundAddress: address,
    zroPaymentAddress: ethers.constants.AddressZero,
  };
  const tx = await contract.bridgeNative(
    amt,
    address,
    callParams,
    serializeAdapterParams(adapterParams),
    { value: amt.add(increasedNativeFee) }
  );
  await tx.wait();
  return tx.hash;
};

export const estimateOriginalNativeFee = async (
  bridgeAddress: string,
  rpcUrl: string
) => {
  let provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = getOriginalTokenBridge(bridgeAddress, provider);
  const dstGasLimit = await contract.minDstGasLookup(138, 0);
  const adapterParams = AdapterParams.forV1(Number(dstGasLimit));
  const nativeFee = parseInt(
    (
      await contract.estimateBridgeFee(
        false,
        serializeAdapterParams(adapterParams)
      )
    ).nativeFee
  );
  const increasedNativeFee = (Number(nativeFee) * 1.2).toFixed(0);
  return increasedNativeFee;
};
