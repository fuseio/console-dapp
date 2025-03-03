import { ERC20ABI } from "@/lib/abi/ERC20";
import { Address, createPublicClient, http, parseUnits } from "viem";
import { getWalletClient, waitForTransactionReceipt } from "wagmi/actions";
import { hex } from "./helpers";
import { config } from "./wagmi";
import { fuse } from "viem/chains";

const publicClient = (rpcUrl: string) => {
  return createPublicClient({
    transport: http(rpcUrl),
  });
};

export const getERC20Balance = async (
  contractAddress: Address,
  address: Address,
  rpcUrl: string = fuse.rpcUrls.default.http[0]
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
  const walletClient = await getWalletClient(config, { chainId: selectedChainId });
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
