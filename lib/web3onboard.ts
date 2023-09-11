import { init } from "@web3-onboard/react";
import fuseConsoleLogo from '@/assets/fuse-console-logo.svg'
import fuseIcon from "@/public/fuse.png";
import fuseToken from "@/assets/tokenLogo";
import coinbaseWalletModule from "@web3-onboard/coinbase";
import ledgerModule from "@web3-onboard/ledger";
import torusModule from "@web3-onboard/torus";
import trezorModule from "@web3-onboard/trezor";
import walletConnectModule from "@web3-onboard/walletconnect";
import transactionPreviewModule from "@web3-onboard/transaction-preview";
import injectedModule from "@web3-onboard/injected-wallets";
import {
  NEXT_PUBLIC_BLOCKNATIVE_API_KEY,
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  chainConfig
} from "@/lib/config";
import { ThemingMap } from '@web3-onboard/core/dist/types'

const transactionPreview = transactionPreviewModule({
  requireTransactionApproval: true,
});

const walletConnect = walletConnectModule({
  version: 2,
  projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  requiredChains: [122],
});

const trezor = trezorModule({
  email: "hello@fuse.io",
  appUrl: "https://staking.fuse.io",
});

const torus = torusModule();
const ledger = ledgerModule();
const coinbaseWalletSdk = coinbaseWalletModule();

const fuse = {
  id: "0x7A",
  token: "Fuse",
  label: "Fuse Mainnet",
  rpcUrl: "https://rpc.fuse.io",
  icon: fuseToken,
};

const otherChains = chainConfig.chains.map((chain) => {
  return {
    id: "0x" + chain.chainId.toString(16),
    token: chain.chainName,
    label: chain.chainName,
    rpcUrl: chain.rpc,
    icon: chain.logo,
  };
});

const chains = [fuse, ...otherChains];

const wallets = [
  injectedModule(),
  walletConnect,
  coinbaseWalletSdk,
  ledger,
  trezor,
  torus,
];

const customTheme: ThemingMap = {
  '--w3o-background-color': 'rgba(255, 255, 255, 1)',
  '--w3o-foreground-color': 'linear-gradient(180deg, #E0FFDD 0%, rgba(242, 242, 242, 0) 100%)',
  '--w3o-text-color': 'var(--primary-text-color)',
  '--w3o-border-radius': '8px'
}

export const web3Onboard = init({
  theme: customTheme,
  transactionPreview,
  apiKey: NEXT_PUBLIC_BLOCKNATIVE_API_KEY,
  wallets,
  chains,
  appMetadata: {
    name: "Fuse Bridge",
    icon: fuseIcon.src,
    logo: fuseConsoleLogo.src,
    description:
      "The Fuse Bridge allows you to move funds from different networks and centralized exchanges to Fuse.",
  },
  accountCenter: {
    desktop: {
      enabled: true,
      minimal: false,
    },
    mobile: {
      enabled: true,
    }
  },
  connect: {
    iDontHaveAWalletLink: "https://fuse.io/ecosystem",
    disableUDResolution: true,
    autoConnectLastWallet: true,
  },
});

export const updateAllBalances = async () => {
  await web3Onboard.state.actions.updateBalances();
};
