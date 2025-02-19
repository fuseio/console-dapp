import { ethers } from "ethers";
import { OriginalTokenBridgeAbi } from "@/lib/abi/OriginalTokenBridge";
import { AdapterParams } from "@layerzerolabs/ui-core";
import { serializeAdapterParams } from "@layerzerolabs/ui-evm";
import {
  getPublicClient,
  getWalletClient,
  waitForTransactionReceipt,
} from "wagmi/actions";
import { Address } from "abitype";
import { createPublicClient, http, parseEther, parseUnits } from "viem";
import { hex } from "./helpers";
import { config } from "./wagmi";

const publicClient = (rpcUrl: string) => {
  return createPublicClient({
    transport: http(rpcUrl),
  });
};

export const bridgeOriginal = async (
  bridgeAddress: Address,
  address: Address,
  tokenAddres: Address,
  amount: string,
  decimals: number,
  dstChainId: number,
  selectedChainId: number
) => {
  const publicClient = getPublicClient(config, {
    chainId: selectedChainId,
  });
  if (!publicClient) {
    return;
  }
  const dstGasLimit = await publicClient.readContract({
    address: bridgeAddress,
    abi: OriginalTokenBridgeAbi,
    functionName: "minDstGasLookup",
    args: [dstChainId, 0],
  });
  const adapterParams = AdapterParams.forV1(Number(dstGasLimit));
  const nativeFee = (
    await publicClient.readContract({
      address: bridgeAddress,
      abi: OriginalTokenBridgeAbi,
      functionName: "estimateBridgeFee",
      args: [false, serializeAdapterParams(adapterParams) as Address],
    })
  )[0];
  const increasedNativeFee = (Number(nativeFee) * 1.2).toFixed(0);
  const amt = parseUnits(amount, decimals);
  const callParams = {
    refundAddress: address,
    zroPaymentAddress: ethers.constants.AddressZero as Address,
  };
  const walletClient = await getWalletClient(config, {
    chainId: selectedChainId,
  });
  let tx: Address = hex;
  if (walletClient) {
    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    tx = await walletClient.writeContract({
      account,
      address: bridgeAddress,
      abi: OriginalTokenBridgeAbi,
      functionName: "bridge",
      args: [
        tokenAddres,
        amt,
        address,
        callParams,
        serializeAdapterParams(adapterParams) as Address,
      ],
      value: BigInt(increasedNativeFee),
    });
  }
  try {
    await waitForTransactionReceipt(config, {
      chainId: selectedChainId,
      hash: tx,
    });
  } catch (e) {
    console.log(e);
  }
  return tx;
};

export const bridgeNative = async (
  bridgeAddress: Address,
  address: Address,
  amount: string,
  decimals: number,
  dstChainId: number,
  selectedChainId: number
) => {
  const publicClient = getPublicClient(config, {
    chainId: selectedChainId,
  });
  if (!publicClient) {
    return;
  }
  const dstGasLimit = await publicClient.readContract({
    address: bridgeAddress,
    abi: OriginalTokenBridgeAbi,
    functionName: "minDstGasLookup",
    args: [dstChainId, 0],
  });
  const adapterParams = AdapterParams.forV1(Number(dstGasLimit));
  const nativeFee = (
    await publicClient.readContract({
      address: bridgeAddress,
      abi: OriginalTokenBridgeAbi,
      functionName: "estimateBridgeFee",
      args: [false, serializeAdapterParams(adapterParams) as Address],
    })
  )[0];
  const increasedNativeFee = (BigInt(nativeFee) * BigInt(12)) / BigInt(10);
  const amt = parseEther(amount);
  const callParams = {
    refundAddress: address,
    zroPaymentAddress: ethers.constants.AddressZero as Address,
  };
  const walletClient = await getWalletClient(config, {
    chainId: selectedChainId,
  });
  let tx: Address = hex;
  if (walletClient) {
    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    tx = await walletClient.writeContract({
      account,
      address: bridgeAddress,
      abi: OriginalTokenBridgeAbi,
      functionName: "bridgeNative",
      args: [
        amt,
        address,
        callParams,
        serializeAdapterParams(adapterParams) as Address,
      ],
      value: amt + BigInt(increasedNativeFee),
    });
  }
  try {
    await waitForTransactionReceipt(config, {
      chainId: selectedChainId,
      hash: tx,
    });
  } catch (e) {
    console.log(e);
  }
  return tx;
};

export const estimateOriginalNativeFee = async (
  bridgeAddress: Address,
  rpcUrl: string
) => {
  const dstGasLimit = await publicClient(rpcUrl).readContract({
    address: bridgeAddress,
    abi: OriginalTokenBridgeAbi,
    functionName: "minDstGasLookup",
    args: [138, 0],
  });
  const adapterParams = AdapterParams.forV1(Number(dstGasLimit));
  const nativeFee = (
    await publicClient(rpcUrl).readContract({
      address: bridgeAddress,
      abi: OriginalTokenBridgeAbi,
      functionName: "estimateBridgeFee",
      args: [false, serializeAdapterParams(adapterParams) as Address],
    })
  )[0];
  const increasedNativeFee = (Number(nativeFee) * 1.2).toFixed(0);
  return increasedNativeFee;
};
