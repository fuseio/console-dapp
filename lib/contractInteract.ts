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
import { MULTICALL_ABI } from "./abi/MultiCall";
import { getAccount, getWalletClient, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { hex } from "./helpers";
import { fuse } from "viem/chains";
import { PaymasterAbi } from "./abi/Paymaster";
import { config } from "./web3Auth";
import { Contract, providers } from "ethers";
import { Interface } from "ethers/lib/utils";

const provider = new providers.JsonRpcProvider(CONFIG.fuseRPC);

export const contractInterface = new Interface(Consensus);
export const multicallContract = new Contract(CONFIG.multiCallAddress, MULTICALL_ABI, provider);

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
  const stakeAmountCallData = contractInterface.encodeFunctionData("stakeAmount", [address]);
  const validatorFeeCallData = contractInterface.encodeFunctionData("validatorFee", [address]);
  const delegatorsCallData = contractInterface.encodeFunctionData("delegators", [address]);
  const isJailedCallData = contractInterface.encodeFunctionData("isJailed", [address]);

  const calls = [
    [CONFIG.consensusAddress, stakeAmountCallData],
    [CONFIG.consensusAddress, validatorFeeCallData],
    [CONFIG.consensusAddress, delegatorsCallData],
    [CONFIG.consensusAddress, isJailedCallData],
  ];

  const data = await multicallContract.aggregate(calls);
  const [, results] = data
  const [stakeAmount] = contractInterface.decodeFunctionResult(contractInterface.getFunction('stakeAmount'), results[0]);
  const [fee] = contractInterface.decodeFunctionResult(contractInterface.getFunction('validatorFee'), results[1]);
  const [delegatorsMap] = contractInterface.decodeFunctionResult(contractInterface.getFunction('delegators'), results[2]);
  const [isJailed] = contractInterface.decodeFunctionResult(contractInterface.getFunction('isJailed'), results[3]);

  const delegators = delegatorsMap.map((value: any) => [value, "0"]);

  return {
    stakeAmount: formatEther(stakeAmount),
    fee: formatUnits(fee, 16),
    delegatorsLength: delegators.length.toString(),
    delegators,
    isJailed
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
