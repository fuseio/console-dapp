import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TransactionType } from "@/store/transactionsSlice";
import { AirdropUser, BillingCycle, Invoice, NodesUser, WalletType } from "./types";
import { getDate, getDaysInMonth } from 'date-fns'
import { monthsInYear } from "date-fns/constants";
import { Address } from "viem";

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
  DASHBOARD: "/build/overview",
  AI_AGENT: "/build/edison",
  AI_AGENT_CHAT: "/build/edison/chat",
  BUILD_API_KEYS: "/build/keys",
  BUILD_BILLING: "/build/billing",
  AIRDROP_ECOSYSTEM: "/ember/points",
  AIRDROP_GRANT: "/ember/grant",
  NODES: "/nodes",
  TESTNET_NODES: "/nodes/testnet",
  EMBER_NODES: "/nodes/ember",
  AIRDROP_FLASH: "/ember/flash",
  BUILD_REGISTER: "/build/register",
};

export const buildVisitorSubMenuItems = [
  {
    title: "Welcome",
    link: path.BUILD,
  },
  {
    title: "Register",
    link: path.BUILD_REGISTER,
  },
];

export const buildSubMenuItems = [
  {
    title: "Overview",
    link: path.DASHBOARD,
  },
  {
    title: "Use Edison AI",
    link: path.AI_AGENT,
  },
  {
    title: "API Keys",
    link: path.BUILD_API_KEYS,
  },
  {
    title: "Billing & Usage",
    link: path.BUILD_BILLING,
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

export const subscriptionInformation = () => {
  const payment = 50
  const decimals = 18
  const advance = 12
  const tokenAddress: Address = "0x0BE9e53fd7EDaC9F859882AfdDa116645287C629"

  const today = new Date()
  const daysInMonth = getDaysInMonth(today)
  const dayOfMonth = getDate(today)
  const remainingDays = daysInMonth - dayOfMonth + 1
  const proratedFactor = remainingDays / daysInMonth

  const tiers = {
    [BillingCycle.YEARLY]: {
      percentageOff: 30,
      multiplier: monthsInYear
    },
    [BillingCycle.MONTHLY]: {
      percentageOff: 0,
      multiplier: 1
    }
  }

  function calculateAmount(billingCycle: BillingCycle) {
    const { percentageOff, multiplier } = tiers[billingCycle]
    const discount = payment * (percentageOff / 100)
    return (payment - discount) * multiplier
  }

  function calculateProrated(billingCycle: BillingCycle) {
    const calculatedAmount = calculateAmount(billingCycle)
    return Math.round(payment * proratedFactor + calculatedAmount - payment)
  }

  return {
    payment,
    decimals,
    advance,
    tokenAddress,
    calculateAmount,
    calculateProrated
  }
}

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

export const needsRedelegation = (user: NodesUser): boolean => {
  if (!user) {
    console.log("No user data, no redelegation needed");
    return false;
  }

  if (!user.licences || !user.delegations) {
    console.log("Missing licences or delegations data, no redelegation needed");
    return false;
  }

  if (!user.newLicences) {
    console.log("No newLicences data, no redelegation needed");
    return false;
  }

  const hasOldLicenses = user.licences.some(license => license.balance > 0);
  if (!hasOldLicenses) {
    console.log("No old NFTs with balance, no redelegation needed");
    return false;
  }

  const oldDelegations = user.delegations.filter(
    delegation => delegation.NFTAmount > 0
  );

  if (oldDelegations.length === 0) {
    console.log("No old delegated NFTs, no redelegation needed");
    return false;
  }

  const newDelegations = user.newDelegations || [];

  const hasNewLicensesWithBalance = user.newLicences.some(license => license.balance > 0);

  if (!hasNewLicensesWithBalance && newDelegations.length === 0) {
    console.log("No new licenses with balance, can't redelegate");
    return false;
  }


  if (newDelegations.length > 0) {
    const oldDelegationsByTokenId = new Map<number, number>();
    for (const oldDel of oldDelegations) {
      const tokenId = oldDel.NFTTokenID;
      const currentAmount = oldDelegationsByTokenId.get(tokenId) || 0;
      oldDelegationsByTokenId.set(tokenId, currentAmount + oldDel.NFTAmount);
    }

    const newDelegationsByTokenId = new Map<number, number>();
    for (const newDel of newDelegations) {
      const tokenId = newDel.NFTTokenID;
      const currentAmount = newDelegationsByTokenId.get(tokenId) || 0;
      newDelegationsByTokenId.set(tokenId, currentAmount + newDel.NFTAmount);
    }

    let allTokenIdsRedelegated = true;
    for (const [tokenId, oldAmount] of oldDelegationsByTokenId.entries()) {
      const newAmount = newDelegationsByTokenId.get(tokenId) || 0;
      if (newAmount < oldAmount) {
        allTokenIdsRedelegated = false;
        break;
      }
    }

    if (allTokenIdsRedelegated) {
      console.log("All token IDs redelegated in sufficient amounts, no redelegation needed");
      return false;
    }
  }

  console.log("Redelegation needed");
  return true;
}

export const getTotalTransaction = (isActivated: boolean) => {
  return isActivated ? 1_000_000 : 1000;
}

export const operatorPricing = () => {
  const percentageOff = 30;
  const basicPrice = 50;
  const premiumPrice = 500;
  const prices = {
    [BillingCycle.MONTHLY]: {
      free: 0,
      basic: basicPrice,
      premium: premiumPrice
    },
    [BillingCycle.YEARLY]: {
      free: 0,
      basic: basicPrice - (basicPrice * percentageOff / 100),
      premium: premiumPrice - (premiumPrice * percentageOff / 100)
    }
  }
  return prices;
}

export const operatorInvoiceUntilTime = (createdAt: string | number, billingCycle: BillingCycle) => {
  const date = new Date(createdAt);
  date.setDate(1);
  if (billingCycle === BillingCycle.MONTHLY) {
    return new Date(date.setMonth(date.getMonth() + 1));
  }
  return new Date(date.setFullYear(date.getFullYear() + 1));
}

export const operatorLastInvoice = (invoices: Invoice[]) => {
  const paid = invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  const valid = paid ? operatorInvoiceUntilTime(paid.createdAt, BillingCycle.MONTHLY) > new Date() : false;
  return {
    paid,
    valid
  };
}

export const consoleV2LaunchDate = new Date("2025-02-01")
