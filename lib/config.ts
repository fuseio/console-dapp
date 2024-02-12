import { bridgeConfig } from "./bridge";
import {
  createAppConfig,
  createChainConfig,
  createCoinConfig,
  createExchangeConfig,
} from "./types";
import { chains } from "./chains";
import { coins } from "./coins";
import { exchanges } from "./exchanges";
import { Address } from "wagmi";
import { Variables } from "@fuseio/fusebox-web-sdk/dist/src/constants/variables";

type CONFIG = {
  fuseRPC: string;
  consensusAddress: Address;
  blockRewardAddress: Address;
  bootApi: string;
  paymasterAddress: Address;
}

export const CONFIG: CONFIG = {
  fuseRPC: "https://fuse.liquify.com",
  consensusAddress: "0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79",
  blockRewardAddress: "0x63D4efeD2e3dA070247bea3073BCaB896dFF6C9B",
  bootApi: "https://bot.fuse.io/api/v1",
  paymasterAddress: "0xEA1Ba4305A07cEd2bB5e42224D71aBE0BC3C3f28"
,};

export const chainConfig = createChainConfig(chains);
export const exchangeConfig = createExchangeConfig(exchanges);
export const coinConfig = createCoinConfig(coins);
export const appConfig = createAppConfig(bridgeConfig, chainConfig, coinConfig);

export const NODE_ENV = process.env.NODE_ENV ?? ""
export const GENERATE_SOURCEMAP = process.env.GENERATE_SOURCEMAP ?? ""
export const NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ""
export const NEXT_PUBLIC_YANDEX_METRICA_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID ?? ""
export const NEXT_PUBLIC_BLOCKNATIVE_API_KEY = process.env.NEXT_PUBLIC_BLOCKNATIVE_API_KEY ?? ""
export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? ""
export const NEXT_PUBLIC_AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? ""
export const NEXT_PUBLIC_TRANSFI_API_KEY = process.env.NEXT_PUBLIC_TRANSFI_API_KEY ?? ""
export const NEXT_PUBLIC_WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ""
export const NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL = process.env.NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL ?? ""
export const NEXT_PUBLIC_FUSE_API_BASE_URL = process.env.NEXT_PUBLIC_FUSE_API_BASE_URL ?? ""

Variables.BASE_URL = NEXT_PUBLIC_FUSE_API_BASE_URL;
export const NEXT_PUBLIC_COIN_GECKO_API_KEY = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY ?? ""
