import { TransactionType } from "@/store/transactionsSlice";
import { WalletType } from "./types";
import { chains, fuseChain } from "./chains";

export const eclipseAddress = (address: string): string => {
  return (
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

export const fetchAllTransactionsFromLocalStorage = (): TransactionType[] => {
  const transactions = localStorage.getItem("transactions");
  return transactions ? JSON.parse(transactions) : [];
};

export const insertTransactionToLocalStorage = (
  transaction: TransactionType
): void => {
  const transactions = fetchAllTransactionsFromLocalStorage();
  localStorage.setItem(
    "transactions",
    JSON.stringify([transaction, ...transactions])
  );
};

export const hex = "0x";

export const IS_SERVER = typeof window === "undefined";

export const IS_ETHEREUM_OBJECT_DETECTED =
  typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export const walletType: WalletType = {
  injected: "MetaMask",
  metaMaskSDK: "MetaMaskSDK",
  walletConnect: "WalletConnect",
  coinbaseWallet: "Coinbase",
  google: "Google",
  facebook: "Facebook",
  twitter: "Twitter",
  discord: "Discord",
  twitch: "Twitch",
  github: "GitHub",
  email_passwordless: "Email",
};

export const detectDevice = () => {
  if (IS_SERVER) {
    return { isIos: null, isAndroid: null, isMobile: null };
  }

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIos || isAndroid;

  return { isIos, isAndroid, isMobile };
};

export const signDataMessage =
  "Verify your wallet ownership to create an Operator account";

export const path = {
  HOME: "/",
  WALLET: "/wallet",
  BUILD: "/build",
  BRIDGE: "/bridge",
  STAKING: "/staking",
  DASHBOARD: "/dashboard",
  AI_AGENT: "/ai-agent",
  AI_AGENT_CHAT: "/ai-agent/chat",
};

export const buildSubMenuItems = [
  {
    title: "Welcome",
    link: "/build",
  },
  {
    title: "Dashboard",
    link: "/dashboard",
  },
];

export const splitSecretKey = (secretKey: string) => {
  return {
    secretPrefix: secretKey.split("_")[0] + "_",
    secretLastFourChars: secretKey.slice(
      secretKey.length - 4,
      secretKey.length
    ),
  };
};

export const getChain = (chainId: number) => {
  return chains.concat(fuseChain).find((chain) => chain.chainId == chainId);
};

export const evmDecimals = 18;

export const screenMediumWidth = 768;
