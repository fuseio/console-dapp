import { ERC20ABI } from "@/lib/abi/ERC20";
import { Address, createPublicClient, http, parseUnits } from "viem";
import { getWalletClient } from "wagmi/actions";

const publicClient = (rpcUrl: string) => {
  return createPublicClient({
    transport: http(rpcUrl)
  })
}

export const getERC20Balance = async (
  contractAddress: Address,
  address: Address,
  rpcUrl: string
) => {
  const balance = await publicClient(rpcUrl).readContract({
    address: contractAddress,
    abi: ERC20ABI,
    functionName: "balanceOf",
    args: [address]
  })
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
    args: [address, spender]
  })
  return allowance;
};

export const approveSpend = async (
  address: Address,
  spender: Address,
  amount: string,
  decimals: number = 18
) => {
  const walletClient = await getWalletClient()
  if (walletClient) {
    const tx = await walletClient.writeContract({
      address,
      abi: ERC20ABI,
      functionName: 'approve',
      args: [spender, parseUnits(amount, decimals)],
    })
    return tx
  }
};
