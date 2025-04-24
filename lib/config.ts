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
import { Address } from "abitype";

type CONFIG = {
  multiCallAddress: Address;
  fuseRPC: string;
  consensusAddress: Address;
  blockRewardAddress: Address;
  bootApi: string;
  paymasterAddress: Address;
  delegateRegistryAddress: Address;
  nodeLicenseAddress: Address;
  delegateRegistryAddressV2: Address;
  nodeLicenseAddressV2: Address;
}

export const CONFIG: CONFIG = {
  fuseRPC: "https://rpc.fuse.io",
  multiCallAddress: "0x3CE6158b7278Bf6792e014FA7B4f3c6c46fe9410",
  consensusAddress: "0x3014ca10b91cb3D0AD85fEf7A3Cb95BCAc9c0f79",
  blockRewardAddress: "0x63D4efeD2e3dA070247bea3073BCaB896dFF6C9B",
  bootApi: "https://bot.fuse.io/api/v1",
  paymasterAddress: "0xEA1Ba4305A07cEd2bB5e42224D71aBE0BC3C3f28",
  delegateRegistryAddress: "0xf9689022f129aEb4495f6C33bacF4bCabA1F8fca",
  nodeLicenseAddress: "0xB42F66f690816D2B076D26B20697Aa594dc1Fd2f",
  delegateRegistryAddressV2: "0x8f50b06ABE999DC3Da94b97a0AeEcD6CBe55210E",
  nodeLicenseAddressV2: "0xd4A5D16Fa00D3057A4A96197Db4bc1Ec5a3a5910"
};

export const chainConfig = createChainConfig(chains);
export const exchangeConfig = createExchangeConfig(exchanges);
export const coinConfig = createCoinConfig(coins);
export const appConfig = createAppConfig(bridgeConfig, chainConfig, coinConfig);

export const GENERATE_SOURCEMAP = process.env.GENERATE_SOURCEMAP ?? ""
export const NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? ""
export const NEXT_PUBLIC_YANDEX_METRICA_ID = process.env.NEXT_PUBLIC_YANDEX_METRICA_ID ?? ""
export const NEXT_PUBLIC_BLOCKNATIVE_API_KEY = process.env.NEXT_PUBLIC_BLOCKNATIVE_API_KEY ?? ""
export const NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? ""
export const NEXT_PUBLIC_AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? ""
export const NEXT_PUBLIC_AMPLITUDE_SERVER_URL = process.env.NEXT_PUBLIC_AMPLITUDE_SERVER_URL ?? ""
export const NEXT_PUBLIC_TRANSFI_API_KEY = process.env.NEXT_PUBLIC_TRANSFI_API_KEY ?? ""
export const NEXT_PUBLIC_WEB3AUTH_CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ""
export const NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL = process.env.NEXT_PUBLIC_FUSE_ACCOUNT_API_BASE_URL ?? ""
export const NEXT_PUBLIC_FUSE_API_BASE_URL = process.env.NEXT_PUBLIC_FUSE_API_BASE_URL ?? ""
export const NEXT_PUBLIC_COIN_GECKO_API_KEY = process.env.NEXT_PUBLIC_COIN_GECKO_API_KEY ?? ""
export const NEXT_PUBLIC_AGENT_ID = process.env.NEXT_PUBLIC_AGENT_ID ?? ""
export const NEXT_PUBLIC_AGENT_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL ?? ""
export const NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? ""
export const NEXT_PUBLIC_PAYMASTER_FUNDER_ADDRESS = process.env.NEXT_PUBLIC_PAYMASTER_FUNDER_ADDRESS ?? ""
export const NEXT_PUBLIC_AIRDROP_API_BASE_URL = process.env.NEXT_PUBLIC_AIRDROP_API_BASE_URL ?? ""
export const NEXT_PUBLIC_AVAIL_MONITORING_API_URL = process.env.NEXT_PUBLIC_AVAIL_MONITORING_API_URL ?? ""
export const NEXT_PUBLIC_AVAIL_REWARD_API_URL = process.env.NEXT_PUBLIC_AVAIL_REWARD_API_URL ?? ""
export const NEXT_PUBLIC_CHARGE_PAYMENTS_API_BASE_URL = process.env.NEXT_PUBLIC_CHARGE_PAYMENTS_API_BASE_URL ?? ""
