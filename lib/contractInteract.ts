import {
  Address,
  createPublicClient,
  formatEther,
  formatUnits,
  http,
  parseEther,
} from "viem";
import { CONFIG } from "./config";
import { Consensus } from "./abi/Consensus";
import { getAccount, getWalletClient, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { hex } from "./helpers";
import { fuse } from "viem/chains";
import { PaymasterAbi } from "./abi/Paymaster";
import { config } from "./web3Auth";

const contractProperties = {
  address: CONFIG.consensusAddress,
  abi: Consensus,
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

export const getTotalStakeAmount = async () => {
  const totalStakeAmount = await publicClient().readContract({
    ...contractProperties,
    functionName: "totalStakeAmount",
    args: []
  });
  return formatEther(totalStakeAmount);
};

export const getValidators = async () => {
  const validatorsMap = await publicClient().readContract({
    ...contractProperties,
    functionName: "getValidators",
    args: []
  });
  const validators: string[] = [];
  validatorsMap.forEach((value, _) => {
    validators.push(value);
  });
  return validators;
};

export const getJailedValidators = async () => {
  const validatorsMap = await publicClient().readContract({
    ...contractProperties,
    functionName: "jailedValidators",
    args: []
  });
  const validators: string[] = [];
  validatorsMap.forEach((value, _) => {
    validators.push(value.toLowerCase());
  });
  return validators;
};

export const getPendingValidators = async () => {
  const validatorsMap = await publicClient().readContract({
    ...contractProperties,
    functionName: "pendingValidators",
    args: []
  });
  const validators: string[] = [];
  validatorsMap.forEach((value, _) => {
    validators.push(value.toLowerCase());
  });
  return validators;
};

export const fetchValidatorData = async (address: Address) => {
  const stakeAmount = await publicClient().readContract({
    ...contractProperties,
    functionName: "stakeAmount",
    args: [address],
  });
  const fee = await publicClient().readContract({
    ...contractProperties,
    functionName: "validatorFee",
    args: [address],
  });
  let delegators: [Address, string][] = [];
  const delegatorsMap = await publicClient().readContract({
    ...contractProperties,
    functionName: "delegators",
    args: [address],
  });
  delegatorsMap.forEach((value, _) => {
    delegators.push([value, "0"]);
  });
  return {
    stakeAmount: formatEther(stakeAmount),
    fee: formatUnits(fee, 16),
    delegatorsLength: delegators.length.toString(),
    delegators,
  };
};

export const getStake = async (
  address: Address,
  wallet: Address | undefined
) => {
  let delegatedAmount = BigInt(0);
  if (wallet && wallet !== hex) {
    delegatedAmount = await publicClient().readContract({
      ...contractProperties,
      functionName: "delegatedAmount",
      args: [wallet, address],
    });
  }
  return formatEther(delegatedAmount);
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
      connector
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
      connector
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

export const getDelegatedAmount = async (
  delegator: Address,
  validator: Address
) => {
  const delegatedAmount = await publicClient().readContract({
    ...contractProperties,
    functionName: "delegatedAmount",
    args: [delegator, validator],
  });
  return formatEther(delegatedAmount);
};

export const getMaxStake = async () => {
  const maxStake = await publicClient().readContract({
    ...contractProperties,
    functionName: "getMaxStake",
    args: []
  });
  return formatEther(maxStake);
};

export const getMinStake = async () => {
  const minStake = await publicClient().readContract({
    ...contractProperties,
    functionName: "getMinStake",
    args: []
  });
  return formatEther(minStake);
};

export const getSponsorIdBalance = async (sponsorId: string) => {
  const balance = await publicClient().readContract({
    ...paymasterContractProperties,
    functionName: "getBalance",
    args: [sponsorId],
  });
  return formatEther(balance as bigint);
};
