import { Address } from "abitype";
import { disabledChains } from "./disabledChains";

export interface ChainConfigLike {
  lzChainId: number;
  chainName: string;
  icon: string;
  rpc: string;
  chainId: number;
  logo: string;
}

export interface DisabledChainConfigLike {
  chainName: string;
  icon: string;
  appName: string;
  appLogo: string;
  appURL: string;
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
  icon: string;
  coinGeckoId: string;
}

export interface ExchangeConfigLike {
  name: string;
  icon: string;
  website: string;
  bridges: {
    name: string;
    icon: string;
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
      icon: string;
      coinGeckoId: string;
    }[];
  };
  disabledChains: DisabledChainConfigLike[];
  chains: {
    lzChainId: number;
    chainId: number;
    name: string;
    icon: string;
    original: Address;
    wrapped: Address;
    originalFuse: Address;
    rpcUrl: string;
    tokens: {
      decimals: number;
      symbol: string;
      name: string;
      address: Address;
      icon: string;
      isNative: boolean;
      isBridged: boolean;
      coinGeckoId: string;
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
  let wrappedTokens: {
    decimals: number;
    symbol: string;
    name: string;
    address: Address;
    icon: string;
    coinGeckoId: string;
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
      chains: chainConfig.chains.map((chain) => {
        let tokens: {
          decimals: number;
          symbol: string;
          name: string;
          address: Address;
          icon: string;
          isNative: boolean;
          isBridged: boolean;
          coinGeckoId: string;
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
        };
      }),
    },
  };
};

export type MenuItem = {
  title: string;
  link: string;
}

export type MenuItems = MenuItem[];
