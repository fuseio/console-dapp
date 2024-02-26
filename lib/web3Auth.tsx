import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  OpenloginAdapter,
  LOGIN_PROVIDER_TYPE,
  LOGIN_PROVIDER,
  UX_MODE,
} from "@web3auth/openlogin-adapter";
import { WalletServicesPlugin } from "@web3auth/wallet-services-plugin";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { createConfig, http } from "wagmi";
import {
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
} from "./config";
import { arbitrum, polygon, fuse, optimism, mainnet, bsc, Chain } from "wagmi/chains";
import { coinbaseWallet } from '@wagmi/connectors';
import { injected } from '@wagmi/connectors';
import { walletConnect } from '@wagmi/connectors';
import { hex, isIos } from "./helpers";
import { Web3AuthSocialConnector } from "./connectors/social";
import { Web3AuthEmailConnector } from "./connectors/email";

const chains: readonly [Chain, ...Chain[]] = [
  fuse,
  polygon,
  optimism,
  arbitrum,
  mainnet,
  bsc,
]

export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      showQrModal: true,
    }),
    coinbaseWallet({
      appName: "wagmi",
    }),
    Web3AuthConnectorInstance(Web3AuthSocialConnector, LOGIN_PROVIDER.GOOGLE),
    Web3AuthConnectorInstance(Web3AuthSocialConnector, LOGIN_PROVIDER.FACEBOOK),
    Web3AuthConnectorInstance(Web3AuthSocialConnector, LOGIN_PROVIDER.TWITTER),
    Web3AuthConnectorInstance(Web3AuthSocialConnector, LOGIN_PROVIDER.DISCORD),
    Web3AuthConnectorInstance(Web3AuthSocialConnector, LOGIN_PROVIDER.TWITCH),
    Web3AuthConnectorInstance(Web3AuthSocialConnector, LOGIN_PROVIDER.GITHUB),
    Web3AuthConnectorInstance(Web3AuthEmailConnector, LOGIN_PROVIDER.EMAIL_PASSWORDLESS),
  ],
  transports: {
    [fuse.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
})

export default function Web3AuthConnectorInstance(
  LoginConnector: any,
  loginProvider: LOGIN_PROVIDER_TYPE,
  chain: Chain = fuse,
) {
  const name = "Fuse Console";
  const iconUrl = "https://news.fuse.io/wp-content/uploads/2023/12/fuse.svg";
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: hex + chain.id.toString(16),
    rpcTarget: chain.rpcUrls.default.http[0],
    displayName: chain.name,
    tickerName: chain.nativeCurrency?.name,
    ticker: chain.nativeCurrency?.symbol,
    blockExplorerUrl: chain.blockExplorers?.default.url ?? "https://etherscan.io",
    logo: iconUrl,
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const web3AuthInstance = new Web3AuthNoModal({
    clientId: NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    chainConfig,
    privateKeyProvider,
    uiConfig: {
      appName: name,
      defaultLanguage: "en",
      logoLight: iconUrl,
      logoDark: iconUrl,
      mode: "light",
    },
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
    enableLogging: true,
  });

  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      // see https://web3auth.io/community/t/iphone-safari-social-logins-dont-work/5662
      uxMode: isIos ? UX_MODE.REDIRECT : UX_MODE.POPUP
    }
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const walletServicesPlugin = new WalletServicesPlugin({
    walletInitOptions: {
      whiteLabel: {
        showWidgetButton: true,
      },
    }
  });
  web3AuthInstance.addPlugin(walletServicesPlugin);

  return LoginConnector({
    web3AuthInstance,
    loginParams: {
      loginProvider,
    },
  }, loginProvider);
}
