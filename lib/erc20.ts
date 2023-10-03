import { ERC20ABI } from "@/lib/abi/ERC20";
import { Address, createPublicClient, http, parseUnits } from "viem";
import { getWalletClient } from "wagmi/actions";
import { hex } from "./helpers";
import { waitForTransaction } from "@wagmi/core";

const publicClient = (rpcUrl: string) => {
  return createPublicClient({
    transport: http(rpcUrl),
  });
};

export const getERC20Balance = async (
  contractAddress: Address,
  address: Address,
  rpcUrl: string
) => {
  const balance = await publicClient(rpcUrl).readContract({
    address: contractAddress,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [address],
  });
  return balance;
};

export const getERC20Allowance = async (
  contractAddress: Address,
  address: Address,
  spender: Address,
  rpcUrl: string
) => {
  const allowance = await publicClient(rpcUrl).readContract({
    address: contractAddress,
    abi: ERC20ABI,
    functionName: "allowance",
    args: [address, spender],
  });
  return allowance;
};

export const approveSpend = async (
  address: Address,
  spender: Address,
  amount: string,
  decimals: number = 18,
  selectedChainId: number
) => {
  const walletClient = await getWalletClient({ chainId: selectedChainId });
  let tx: Address = hex;
  if (walletClient) {
    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    tx = await walletClient.writeContract({
      account,
      address,
      abi: ERC20ABI,
      functionName: "approve",
      args: [spender, parseUnits(amount, decimals)],
    });
  }
  const txWait = await waitForTransaction({
    hash: tx,
  });
  return txWait.transactionHash;
};
