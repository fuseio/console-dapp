import { Signer, ethers } from "ethers";
import { ERC20ABI } from "@/lib/abi/ERC20";
import { web3OnboardProvider } from "./provider";

const getERC20Contract = (
  address: string,
  signerOrProvider: Signer | ethers.providers.Provider | undefined
) => {
  const contract = new ethers.Contract(address, ERC20ABI, signerOrProvider);
  return contract;
};

const getERC20ContractWithoutSigner = (address: string, rpcUrl: string) => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(address, ERC20ABI, provider);
  return contract;
};

export const getERC20Balance = async (
  contractAddress: string,
  address: string,
  rpcUrl: string
) => {
  const contract = getERC20ContractWithoutSigner(contractAddress, rpcUrl);
  const balance = await contract.balanceOf(address);
  return balance;
};

export const getERC20Allowance = async (
  contractAddress: string,
  address: string,
  spender: string,
  rpcUrl: string
) => {
  const contract = getERC20ContractWithoutSigner(contractAddress, rpcUrl);
  const allowance = await contract.allowance(address, spender);
  return allowance;
};

export const approveSpend = async (
  address: string,
  spender: string,
  amount: string,
  decimals: number = 18
) => {
  const contract = getERC20Contract(address, web3OnboardProvider);
  const tx = await contract.approve(
    spender,
    ethers.utils.parseUnits(amount, decimals)
  );
  await tx.wait();
  return tx.hash;
};
