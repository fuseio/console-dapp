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
  isStargate?: boolean;
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
  isStargate?: boolean;
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
      isStargate?: boolean;
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
      isStargate?: boolean;
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
    isStargate?: boolean;
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
          isStargate?: boolean;
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
                isStargate: coin.isStargate,
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
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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

export interface OperatorWallet {
  ownerId: string;
  smartWalletAddress: Address;
  isActivated?: boolean;
  etherspotSmartWalletAddress?: Address;
}

export interface Withdraw {
  amount: string;
  token: string;
  coinGeckoId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  auth0Id: string;
  smartWalletAddress: Address;
  isActivated: boolean;
  createdAt: string;
  etherspotSmartWalletAddress?: Address;
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

export enum Reaction {
  LIKE = "like",
  DISLIKE = "dislike",
}

export type TextResponse = {
  text: string;
  user: 'user' | 'Fuse Network';
  action?: string;
  hash?: string;
  reaction?: Reaction;
  [key: string]: unknown;
};

export interface Invoice {
  ownerId: string;
  amount: string;
  amountUsd?: string;
  currency: string;
  txHash: string;
  createdAt: string
  updatedAt: string
}

export interface SubscriptionInfo {
  payment: number,
  advance: number,
  decimals: number
  usdcAddress: Address,
}

export enum BillingCycle {
  MONTHLY = "monthly",
  YEARLY = "yearly"
}

export interface OperatorCheckout {
  successUrl: string
  cancelUrl: string
  billingCycle: BillingCycle
}

export enum OperatorCheckoutPaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded'
}

export interface OperatorCheckoutSession {
  billingCycle: BillingCycle
  status: string
  paymentStatus: OperatorCheckoutPaymentStatus
  createdAt: string
  updatedAt: string
  amount: number
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
  newLicences: NodeLicense[];
  delegations: Node[];
  newDelegations?: Node[];
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
  NFTTokenID: number;
}

export type DelegateLicenseModal = {
  open: boolean;
  address?: Address;
}

export type OperatorRegistrationClassNames = {
  pricingSection?: string;
  pricingArticle?: string;
  pricingBillingContainer?: string;
  pricingBilling?: string;
  pricingBillingRadio?: string;
}

export type TokenBalance = {
  value: number;
  formatted: string;
}

export type TokenUsdBalance = {
  coin: TokenBalance;
  token: TokenBalance;
  usd: TokenBalance;
}

export type ChargeToken = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coinGeckoId: string;
  isNative: boolean;
  icon: string;
};

export type ChargeBridgeToken = ChargeToken & {
  recieveTokens: ChargeToken[];
};

export type ChargeBridgeSupportedTokens = {
  [chainId: string]: ChargeBridgeToken[];
};

export type ChargeBridge = {
  chainId: string;
  amount: string;
};

export type ChargeBridgeResponse = {
  walletAddress: Address;
  startTime: number;
  endTime: number;
}

export type WithdrawModalInput = {
  title?: string;
  address?: Address;
}

export type WithdrawModal = {
  open: boolean;
  title?: string;
  description?: string;
  from?: WithdrawModalInput;
  to?: WithdrawModalInput;
}

export type ChatMessageProps = {
  message: TextResponse;
};
