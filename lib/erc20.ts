import { ERC20ABI } from "@/lib/abi/ERC20";
import { Address, createPublicClient, http, parseAbi, parseUnits } from "viem";
import { getWalletClient, waitForTransactionReceipt } from "wagmi/actions";
import { hex } from "./helpers";
import { config } from "./wagmi";

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
  const walletClient = await getWalletClient(config, {
    chainId: selectedChainId,
  });
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

export const sendNative = async (
  to: Address,
  amount: string,
  selectedChainId: number
) => {
  const walletClient = await getWalletClient(config, {
    chainId: selectedChainId,
  });
  let tx: Address = hex;
  if (walletClient) {
    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    tx = await walletClient.sendTransaction({
      account,
      to,
      value: parseUnits(amount, 18),
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

export const transferToken = async (
  tokenAddress: Address,
  to: Address,
  amount: string,
  decimals: number = 18,
  selectedChainId: number
) => {
  const walletClient = await getWalletClient(config, {
    chainId: selectedChainId,
  });
  let tx: Address = hex;
  if (walletClient) {
    tx = await walletClient.writeContract({
      address: tokenAddress,
      abi: parseAbi([
        "function transfer(address to, uint256 amount) external returns (bool)",
      ]),
      functionName: "transfer",
      args: [to, parseUnits(amount, decimals)],
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
