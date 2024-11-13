import {
  Address,
  createPublicClient,
  formatEther,
  http,
  parseEther,
} from "viem";
import { CONFIG } from "./config";
import { Consensus } from "./abi/Consensus";
import { MULTICALL_ABI } from "./abi/MultiCall";
import { getAccount, getWalletClient, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { fuse } from "viem/chains";
import { PaymasterAbi } from "./abi/Paymaster";
import { config } from "./web3Auth";
import { Contract, providers } from "ethers";
import { Interface } from "ethers/lib/utils";
import { BlockReward } from "./abi/BlockReward";

const provider = new providers.JsonRpcProvider(CONFIG.fuseRPC);

export const contractInterface = new Interface(Consensus);
export const multicallContract = new Contract(CONFIG.multiCallAddress, MULTICALL_ABI, provider);

const contractProperties = {
  address: CONFIG.consensusAddress,
  abi: Consensus,
};

const blockRewardContractProperties = {
  address: CONFIG.blockRewardAddress,
  abi: BlockReward,
};

const paymasterContractProperties = {
  address: CONFIG.paymasterAddress,
  abi: PaymasterAbi,
};

const publicClient = () => {
  return createPublicClient({
    chain: fuse,
    transport: http(CONFIG.fuseRPC),
  });
};

export const delegate = async (amount: string, validator: Address) => {
  const walletClient = await getWalletClient(config, { chainId: fuse.id });
  const { connector } = getAccount(config);
  if (walletClient) {
    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    const tx = await writeContract(config, {
      ...contractProperties,
      account,
      functionName: "delegate",
      args: [validator],
      value: parseEther(amount),
      connector,
      __mode: "prepared",
    });
    try {
      await waitForTransactionReceipt(config, {
        chainId: fuse.id,
        hash: tx,
      });
    } catch (e) {
      console.log(e);
    }
    return tx;
  }
};

export const withdraw = async (amount: string, validator: Address) => {
  const walletClient = await getWalletClient(config, { chainId: fuse.id });
  const { connector } = getAccount(config);
  if (walletClient) {
    const accounts = await walletClient.getAddresses();
    const account = accounts[0];
    const tx = await writeContract(config, {
      ...contractProperties,
      account,
      functionName: "withdraw",
      args: [validator, parseEther(amount)],
      connector,
      __mode: "prepared",
    });
    try {
      await waitForTransactionReceipt(config, {
        chainId: fuse.id,
        hash: tx,
      });
    } catch (e) {
      console.log(e);
    }
    return tx;
  }
};

export const getSponsorIdBalance = async (sponsorId: string) => {
  const balance = await publicClient().readContract({
    ...paymasterContractProperties,
    functionName: "getBalance",
    args: [sponsorId],
  });
  return formatEther(balance as bigint);
};

export const getInflation = async () => {
  const getInflation = await publicClient().readContract({
    ...blockRewardContractProperties,
    functionName: "getInflation",
    args: []
  });
  const divisor = 10000
  return Number(getInflation) / divisor;
};
