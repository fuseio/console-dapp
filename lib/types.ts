import { Address } from "abitype";
import { disabledChains } from "./disabledChains";
import { StaticImageData } from "next/image";
import { thirdPartyChains } from "./thirdPartyChains";

export interface ChainConfigLike {
  lzChainId: number;
  chainName: string;
  icon: StaticImageData;
  rpc: string;
  chainId: number;
  logo: string;
  tokenId: string;
  gasTokenId?: string;
}

export interface DisabledChainConfigLike {
  chainName: string;
  icon: StaticImageData;
  appName: string;
  appLogo: string;
  appURL: string;
}

export interface ThirdPartyChainConfigLike {
  chainName: string;
  icon: StaticImageData;
  appName: string;
  appLogo: StaticImageData;
  domain: string;
  appDepositURL: string;
  appWithdrawURL: string;
}

export interface ChainConfig {
  chains: ChainConfigLike[];
}

export interface ExchangeConfig {
  exchanges: ExchangeConfigLike[];
}

export const createChainConfig = (config: ChainConfigLike[]): ChainConfig => {
  return {
    chains: config,
  };
};

export const createExchangeConfig = (
  config: ExchangeConfigLike[]
): ExchangeConfig => {
  return {
    exchanges: config,
  };
};

export interface CoinConfigLike {
  name: string;
  symbol: string;
  decimals: number;
  icon: StaticImageData;
  coinGeckoId: string;
  isDisabled?: boolean;
  isWithdrawStargate?: boolean;
}

export interface ExchangeConfigLike {
  name: string;
  icon: StaticImageData;
  website: string;
  bridges: {
    name: string;
    icon: StaticImageData;
    website: string;
  }[];
}

export interface CoinConfig {
  coins: CoinConfigLike[];
}

export const createCoinConfig = (config: CoinConfigLike[]): CoinConfig => {
  return {
    coins: config,
  };
};

export interface BridgeConfigLike {
  version: number;
  original: {
    chainId: number;
    address: Address;
  }[];
  wrapped: {
    chainId: number;
    address: Address;
  }[];
  originalFuse: {
    chainId: number;
    address: Address;
  }[];
  fuse: {
    chainId: number;
    wrapped: Address;
  };
  tokens: TokenStateType[][];
}
interface TokenStateType {
  chainId: number;
  decimals: number;
  symbol: string;
  name: string;
  address: Address;
  isNative: boolean;
  isBridged: boolean;
  receiveToken?: {
    symbol: string;
    name: string;
  };
  isDepositPaused?: boolean;
}
interface WrappedBridgeConfig {
  version: number;
  fuse: {
    lzChainId: number;
    wrapped: Address;
    tokens: {
      decimals: number;
      symbol: string;
      name: string;
      address: Address;
      icon: StaticImageData;
      coinGeckoId: string;
      receiveToken?: {
        symbol: string;
        name: string;
      };
      isNative: boolean;
      isBridged: boolean;
      isDisabled?: boolean;
      isWithdrawStargate?: boolean;
    }[];
  };
  disabledChains: DisabledChainConfigLike[];
  thirdPartyChains: ThirdPartyChainConfigLike[];
  chains: {
    lzChainId: number;
    chainId: number;
    name: string;
    icon: StaticImageData;
    original: Address;
    wrapped: Address;
    originalFuse: Address;
    rpcUrl: string;
    tokenId: string;
    gasTokenId?: string;
    tokens: {
      decimals: number;
      symbol: string;
      name: string;
      address: Address;
      icon: StaticImageData;
      isNative: boolean;
      isBridged: boolean;
      coinGeckoId: string;
      receiveToken?: {
        symbol: string;
        name: string;
      };
      isDepositPaused?: boolean;
      isDisabled?: boolean;
      isWithdrawStargate?: boolean;
    }[];
  }[];
}

export interface BridgeConfig {
  wrappedBridge: WrappedBridgeConfig;
}

export const createAppConfig = (
  bridgeConfig: BridgeConfigLike,
  chainConfig: ChainConfig,
  tokenConfig: CoinConfig
): BridgeConfig => {
  const wrappedTokens: {
    decimals: number;
    symbol: string;
    name: string;
    address: Address;
    icon: StaticImageData;
    coinGeckoId: string;
    receiveToken?: {
      symbol: string;
      name: string;
    };
    isNative: boolean;
    isBridged: boolean;
    isDisabled?: boolean;
    isWithdrawStargate?: boolean;
  }[] = [];
  if (bridgeConfig.tokens.length > 0) {
    tokenConfig.coins.forEach((coin) => {
      const token = bridgeConfig.tokens
        .find((token) => token[0].symbol === coin.symbol)
        ?.find((token) => token.chainId === bridgeConfig.fuse.chainId);
      if (token) {
        wrappedTokens.push({
          ...token,
          icon: coin.icon,
          coinGeckoId: coin.coinGeckoId,
        });
      }
    });
  }
  return {
    wrappedBridge: {
      version: bridgeConfig.version,
      fuse: {
        lzChainId: bridgeConfig.fuse.chainId,
        wrapped: bridgeConfig.fuse.wrapped,
        tokens: wrappedTokens,
      },
      disabledChains: disabledChains,
      thirdPartyChains: thirdPartyChains,
      chains: chainConfig.chains.map((chain) => {
        const tokens: {
          decimals: number;
          symbol: string;
          name: string;
          address: Address;
          icon: StaticImageData;
          isNative: boolean;
          isBridged: boolean;
          coinGeckoId: string;
          receiveToken?: {
            symbol: string;
            name: string;
          };
          isDepositPaused?: boolean;
          isDisabled?: boolean;
          isWithdrawStargate?: boolean;
        }[] = [];
        if (bridgeConfig.tokens.length > 0) {
          tokenConfig.coins.forEach((coin) => {
            const token = bridgeConfig.tokens
              .find((token) => token[0].symbol === coin.symbol)
              ?.find((token) => token.chainId === chain.lzChainId);
            if (token) {
              tokens.push({
                address: token.address,
                decimals: token.decimals,
                name: token.name,
                symbol: token.symbol,
                icon: coin.icon,
                isNative: token.isNative,
                isBridged: token.isBridged,
                coinGeckoId: coin.coinGeckoId,
                receiveToken: token.receiveToken,
                isDepositPaused: token.isDepositPaused,
                isDisabled: coin.isDisabled,
                isWithdrawStargate: coin.isWithdrawStargate,
              });
            }
          });
        }
        return {
          chainId: chain.chainId,
          lzChainId: chain.lzChainId,
          name: chain.chainName,
          icon: chain.icon,
          original: bridgeConfig.original.find(
            (bridge) => bridge.chainId === chain.lzChainId
          )?.address as Address,
          wrapped: bridgeConfig.wrapped.find(
            (bridge) => bridge.chainId === chain.lzChainId
          )?.address as Address,
          originalFuse: bridgeConfig.originalFuse.find(
            (bridge) => bridge.chainId === chain.lzChainId
          )?.address as Address,
          tokens: tokens,
          rpcUrl: chain.rpc,
          tokenId: chain.tokenId,
          gasTokenId: chain.gasTokenId,
        };
      }),
    },
  };
};

export type MenuItem = {
  title: string;
  link: string;
  submenu?: MenuItem[];
}

export type MenuItems = MenuItem[];

export type WalletType = {
  [k: string]: string;
}

export interface SignData {
  externallyOwnedAccountAddress: Address;
  message: string;
  signature: string;
}

export interface OperatorContactDetail {
  firstName: string;
  lastName: string;
  email: string;
  name?: string;
}

export interface Withdraw {
  amount: string;
  token: string;
  coinGeckoId: string;
}

export interface User {
  name: string;
  email: string;
  auth0Id: string;
  smartWalletAddress: Address;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  publicKey: string;
  secretKey: string;
  secretPrefix: string;
  secretLastFourChars: string;
  sponsorId: string;
}

export interface Operator {
  user: User;
  project: Project;
}

export interface Paymaster {
  paymasterAddress: string;
  paymasterVersion: string;
  entrypointAddress: string;
  projectId: string;
  sponsorId: string;
  isActive: boolean;
  environment: string;
}

export interface DelegatedAmountsRequest {
  validator: Address;
  delegators: Address[];
}

export type DelegatedAmount = {
  address: Address;
  amountFormatted: string;
  amount: string;
};

export type DelegatedAmountsByDelegators = Record<Address, DelegatedAmount>;

export interface ValidatorType {
  address: Address
  stakeAmount: string
  fee: string
  delegatorsLength: string
  delegators: [Address, string][]
  selfStakeAmount?: string
  name: string
  website?: string
  firstSeen?: string
  status?: string
  image?: string
  forDelegation?: boolean
  totalValidated?: number
  uptime?: number
  description?: string
  isPending?: boolean
  isJailed?: boolean
}

export type ValidatorTypeResponse = Omit<ValidatorType, 'delegators'> & { delegators: DelegatedAmountsByDelegators };

export interface ValidatorResponse {
  totalStakeAmount: string
  totalSupply: number
  maxStake: string
  minStake: string
  totalDelegators: number
  allValidators: Address[]
  activeValidators: Address[]
  jailedValidators: Address[]
  pendingValidators: Address[]
  validatorsMetadata: Record<Address, ValidatorTypeResponse>
}

export interface CompletedQuest {
  type: string;
  stakingType?: string;
}

export type CompletedQuests = CompletedQuest[];

export interface AirdropUser {
  id: string,
  walletAddress: Address,
  twitterAccountId: string,
  points: number,
  referrals: number,
  referralCode: string,
  leaderboardPosition: number
  pointsLastUpdatedAt: string;
  createdAt: string;
  completedQuests: CompletedQuests;
  walletAgeInDays?: number;
  seasonOnePoints: number;
  nextRewardDistributionTime: string;
}

export type AirdropButton = {
  text: string;
  link?: string;
  isFunction?: boolean;
  endpoint?: string;
  isLoading?: boolean;
  success?: string;
}

export type AirdropQuest = {
  id: string;
  title: string;
  point: string;
  image: string | StaticImageData;
  frequency?: string;
  description?: string;
  completed?: boolean;
  isEcosystem?: boolean;
  buttons?: AirdropButton[];
  comingSoon?: boolean;
  isCustom?: boolean;
}

export type AirdropQuests = AirdropQuest[];

export interface AirdropLeaderboardUser {
  id: string;
  walletAddress: Address;
  twitterAccountId: string;
  points: number;
  referralCode: string;
  walletAgeInDays?: number;
}

export type AirdropLeaderboardUsers = AirdropLeaderboardUser[];

export interface AirdropLeaderboard {
  users: AirdropLeaderboardUser[];
}

export type CreateAirdropUser = {
  walletAddress: Address;
  referralCode: string;
}

export type NodeLicense = {
  tokenId: number;
  balance: number;
}

export interface NodesUser {
  licences: NodeLicense[];
  delegations: Node[];
}

export enum Status {
  IDLE = "idle",
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
}

export type Node = {
  Address: Address;
  TotalTime: number;
  LastHeartbeat: Date;
  CreatedAt: Date;
  NFTAmount: number;
  CommissionRate: number;
  Status: string;
  AllUptimePercentage: number;
  WeeklyUptimePercentage: number;
}

export type DelegateLicenseModal = {
  open: boolean;
  address?: Address;
}
