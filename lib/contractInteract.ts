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
import { getAccount, getWalletClient, readContract, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { fuse } from "viem/chains";
import { PaymasterAbi } from "./abi/Paymaster";
import { config } from "./wagmi";
import { Contract, providers } from "ethers";
import { Interface } from "ethers/lib/utils";
import { BlockReward } from "./abi/BlockReward";
import { DelegateRegistryABI } from "./abi/DelegateRegistry";
import { ERC1155ABI } from "./abi/ERC1155";

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

export const delegateNodeLicense = async (to: Address, tokenId: number, amount: number) => {
  const walletClient = await getWalletClient(config, { chainId: fuse.id });
  if (!walletClient) {
    return;
  }
  const accounts = await walletClient.getAddresses();
  const account = accounts[0];
  const rights: Address = "0x4675736520456d626572204e6f6465204c6963656e7365000000000000000000"
  const tx = await writeContract(config, {
    account,
    address: CONFIG.delegateRegistryAddress,
    abi: DelegateRegistryABI,
    functionName: "delegateERC1155",
    args: [to, CONFIG.nodeLicenseAddress, BigInt(tokenId), rights, BigInt(amount)],
  });
  await waitForTransactionReceipt(config, {
    hash: tx,
  });
  return tx;
};

export const delegateNewNodeLicense = async (to: Address, tokenId: number, amount: number) => {
  const walletClient = await getWalletClient(config, { chainId: fuse.id });
  if (!walletClient) {
    return;
  }
  const accounts = await walletClient.getAddresses();
  const account = accounts[0];
  const rights: Address = "0x4675736520456d626572204e6f6465204c6963656e7365000000000000000000"
  const tx = await writeContract(config, {
    account,
    address: CONFIG.delegateRegistryAddressV2,
    abi: DelegateRegistryABI,
    functionName: "delegateERC1155",
    args: [to, CONFIG.nodeLicenseAddressV2, BigInt(tokenId), rights, BigInt(amount)],
  });
  console.log("tx", tx);

  await waitForTransactionReceipt(config, {
    hash: tx,
  });
  return tx;
};

export const getOutgoingDelegations = async () => {
  const walletClient = await getWalletClient(config, { chainId: fuse.id });
  if (!walletClient) {
    return;
  }
  const accounts = await walletClient.getAddresses();
  const account = accounts[0];
  const tx = await readContract(config, {
    account,
    address: CONFIG.delegateRegistryAddressV2,
    abi: DelegateRegistryABI,
    functionName: "getOutgoingDelegations",
    args: [account],
  });

  return await tx;
};

export const getNodeLicenseBalances = async (accounts: Address[], tokenIds: bigint[]) => {
  const balances = await publicClient().readContract({
    address: CONFIG.nodeLicenseAddressV2,
    abi: ERC1155ABI,
    functionName: "balanceOfBatch",
    args: [accounts, tokenIds],
  });
  return balances;
};

export const getNewNodeLicenseBalances = async (accounts: Address[], tokenIds: bigint[]) => {
  const balances = await publicClient().readContract({
    address: CONFIG.nodeLicenseAddressV2,
    abi: ERC1155ABI,
    functionName: "balanceOfBatch",
    args: [accounts, tokenIds],
  });
  return balances;
};

const delegationCache = new Map();
const CACHE_EXPIRY = 10 * 1000;


export const getDelegationsFromContract = async (
  address: Address,
  useNewContract: boolean = false
): Promise<Array<{
  to: Address;
  from: Address;
  contract_: Address;
  tokenId: number;
  rights: string;
  amount: number;
  type_: number;
}>> => {
  try {
    if (!address) {
      throw new Error("No wallet address provided");
    }

    const cacheKey = `${address.toLowerCase()}_${useNewContract ? 'new' : 'old'}`;

    const cachedData = delegationCache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
      return cachedData.data;
    }

    const delegationContractAddress = useNewContract
      ? CONFIG.delegateRegistryAddressV2
      : CONFIG.delegateRegistryAddress;

    const rawDelegations = await readContract(config, {
      address: delegationContractAddress,
      abi: DelegateRegistryABI,
      functionName: "getOutgoingDelegations",
      args: [address],
    });

    if (!rawDelegations || !Array.isArray(rawDelegations)) {
      return [];
    }

    const result = rawDelegations.map((delegation: any) => {
      return {
        type_: Number(delegation.type_),
        to: delegation.to as Address,
        from: delegation.from as Address,
        rights: delegation.rights as string,
        contract_: delegation.contract_ as Address,
        tokenId: Number(delegation.tokenId),
        amount: Number(delegation.amount),
      };
    });

    delegationCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    return result;
  } catch (error) {
    console.error("Error fetching delegations from contract:", error);
    throw error;
  }
};

