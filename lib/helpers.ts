import { TransactionType } from "@/store/transactionsSlice";
import { WalletType } from "./types";

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
  let transactions = localStorage.getItem("transactions");
  let transactionsParsed: TransactionType[] = JSON.parse(
    transactions as string
  );
  if (transactionsParsed) {
    transactionsParsed = transactionsParsed.filter(
      (transaction: TransactionType) => transaction.address === address
    );
  } else {
    transactionsParsed = [];
  }
  return transactionsParsed;
};

export const fetchAllTransactionsFromLocalStorage = () => {
  let transactions = localStorage.getItem("transactions");
  let transactionsParsed: TransactionType[] = JSON.parse(
    transactions as string
  );
  return transactionsParsed || [];
};

export const insertTransactionToLocalStorage = (
  transaction: TransactionType
) => {
  let transactions = fetchAllTransactionsFromLocalStorage();
  transactions = [transaction, ...transactions];
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

export const hex = "0x";

export const IS_SERVER = typeof window === "undefined";

export const walletType: WalletType = {
  "injected": "MetaMask",
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

export const isIos = !IS_SERVER && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const signDataMessage = 'Verify your wallet ownership to create an Operator account';

export const path = {
  HOME: "/",
  WALLET: "/wallet",
  BUILD: "/build",
  BRIDGE: "/bridge",
  STAKING: "/staking",
  DASHBOARD: "/dashboard",
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
