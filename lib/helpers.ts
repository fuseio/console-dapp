import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TransactionType } from "@/store/transactionsSlice";
import { AirdropUser, NodesUser, WalletType } from "./types";

export const eclipseAddress = (address: string): string => {
  return (
    address.substring(0, 6) +
    "..." +
    address.substring(address.length - 4, address.length)
  );
};

export const fetchTransactionsFromLocalStorage = (
  address: string
): TransactionType[] => {
  const transactions = localStorage.getItem("transactions");
  if (!transactions) return [];

  const allTransactions: TransactionType[] = JSON.parse(transactions);
  return allTransactions.filter(
    (transaction: TransactionType) => transaction.address === address
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

export const IS_ETHEREUM_OBJECT_DETECTED = typeof window !== "undefined" && typeof window.ethereum !== "undefined";

export const walletType: WalletType = {
  "injected": "MetaMask",
  "metaMaskSDK": "MetaMaskSDK",
  "walletConnect": "WalletConnect",
  "coinbaseWallet": "Coinbase",
  "google": "Google",
  "facebook": "Facebook",
  "twitter": "Twitter",
  "discord": "Discord",
  "twitch": "Twitch",
  "github": "GitHub",
  "email_passwordless": "Email"
}

export const detectDevice = () => {
  if (IS_SERVER) {
    return { isIos: null, isAndroid: null, isMobile: null };
  }

  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIos || isAndroid;

  return { isIos, isAndroid, isMobile };
}

export const signDataMessage = 'Verify your wallet ownership to create an Operator account';

export const path = {
  HOME: "/",
  WALLET: "/wallet",
  BUILD: "/build",
  BRIDGE: "/bridge",
  STAKING: "/staking",
  DASHBOARD: "/dashboard",
  AIRDROP: "/rewards",
  AIRDROP_LEADERBOARD: "/rewards/leaderboard",
  AIRDROP_ECOSYSTEM: "/rewards/ecosystem",
  AIRDROP_GRANT: "/rewards/grant",
  NODES: "/nodes",
  TESTNET_NODES: "/nodes/testnet",
  EMBER_NODES: "/nodes/ember",
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
    secretLastFourChars: secretKey.slice(secretKey.length - 4, secretKey.length)
  }
}

export const evmDecimals = 18;

export const screenMediumWidth = 768;

export const defaultReferralCode = "EMBER";

export function convertTimestampToUTC(timestamp: string) {
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = new Date(timestamp);
  const day = date.getUTCDate().toString().padStart(2, '0');
  const monthName = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hour = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  return `${day} ${monthName}, ${year} ${hour}:${minutes} UTC`;
}

export function isFloat(value: unknown) {
  return !Number.isInteger(value) && Number.isFinite(value);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isSocialFollowed = (user: AirdropUser) => {
  const socialQuests = ["followFuseOnTwitter"];
  
  return user
  .completedQuests
  ?.filter((quest) => socialQuests.includes(quest.type))
  .length === socialQuests.length;
}

export const getUserNodes = (user: NodesUser) => {
  const balance = user.licences.reduce((acc, licence) => acc + licence.balance, 0);
  const delegated = user.delegations.reduce((acc, node) => acc + node.NFTAmount, 0);
  const canDelegate = balance > delegated
  return {
    balance,
    delegated,
    canDelegate
  }
}
