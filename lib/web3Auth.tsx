import { Options } from "@web3auth/web3auth-wagmi-connector";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import {
  OpenloginAdapter,
  OPENLOGIN_NETWORK,
  LOGIN_PROVIDER_TYPE,
  LOGIN_PROVIDER,
  UX_MODE,
} from "@web3auth/openlogin-adapter";
import { TorusWalletConnectorPlugin } from "@web3auth/torus-wallet-connector-plugin";
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
import { Chain, Connector, configureChains, createConfig } from "wagmi";
import {
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
} from "./config";
import { arbitrum, polygon, fuse, optimism, mainnet, bsc } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { IS_SERVER, hex, isIos } from "./helpers";
import { Web3AuthGoogleConnector } from "./connectors/google";
import { Web3AuthEmailConnector } from "./connectors/email";
import { Web3AuthFacebookConnector } from "./connectors/facebook";
import { Web3AuthTwitterConnector } from "./connectors/twitter";
import { Web3AuthDiscordConnector } from "./connectors/discord";
import { Web3AuthTwitchConnector } from "./connectors/twitch";
import { Web3AuthGithubConnector } from "./connectors/github";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    { ...fuse, rpcUrls: { ...fuse.rpcUrls, public: fuse.rpcUrls.default } },
    polygon,
    optimism,
    arbitrum,
    mainnet,
    bsc,
  ],
  [publicProvider()]
);

export const config = createConfig({
  // Checking wagmi.connected is a workaround, as Web3Auth keeps opening
  // last connected social login even after disconnecting it, see:
  // https://web3auth.io/community/t/using-web3auth-wagmi-connector-setting-autoconnect-opens-the-web3authmodal-on-page-load/5279
  autoConnect: !IS_SERVER && !!localStorage.getItem("wagmi.connected"),
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    Web3AuthConnectorInstance(Web3AuthGoogleConnector, LOGIN_PROVIDER.GOOGLE),
    Web3AuthConnectorInstance(
      Web3AuthFacebookConnector,
      LOGIN_PROVIDER.FACEBOOK
    ),
    Web3AuthConnectorInstance(Web3AuthTwitterConnector, LOGIN_PROVIDER.TWITTER),
    Web3AuthConnectorInstance(Web3AuthDiscordConnector, LOGIN_PROVIDER.DISCORD),
    Web3AuthConnectorInstance(Web3AuthTwitchConnector, LOGIN_PROVIDER.TWITCH),
    Web3AuthConnectorInstance(Web3AuthGithubConnector, LOGIN_PROVIDER.GITHUB),
    Web3AuthConnectorInstance(
      Web3AuthEmailConnector,
      LOGIN_PROVIDER.EMAIL_PASSWORDLESS
    ),
  ],
  publicClient,
  webSocketPublicClient,
});

type LoginConnectorArgs = {
  chains?: Chain[];
  options: Options;
};

export default function Web3AuthConnectorInstance<
  T extends Connector<SafeEventEmitterProvider, Options>
>(
  LoginConnector: new (args: LoginConnectorArgs) => T,
  loginProvider: LOGIN_PROVIDER_TYPE,
  chain: Chain = fuse
) {
  const iconUrl =
    "https://news.fuse.io/wp-content/uploads/2023/12/fuse.svg";
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: hex + chain.id.toString(16),
    rpcTarget: chain.rpcUrls.default.http[0],
    displayName: chain.name,
    tickerName: chain.nativeCurrency?.name,
    ticker: chain.nativeCurrency?.symbol,
    blockExplorer: chain.blockExplorers?.default.url ?? "https://etherscan.io",
  };

  const web3AuthInstance = new Web3AuthNoModal({
    clientId: NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    chainConfig,
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
  });

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const openloginAdapterInstance = new OpenloginAdapter({
    adapterSettings: {
      // see https://web3auth.io/community/t/iphone-safari-social-logins-dont-work/5662
      uxMode: isIos ? UX_MODE.REDIRECT : UX_MODE.POPUP
    },
    privateKeyProvider,
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  const torusPlugin = new TorusWalletConnectorPlugin({
    torusWalletOpts: {
      buttonPosition: "bottom-left",
    },
    walletInitOptions: {
      whiteLabel: {
        theme: { isDark: false, colors: { torusBrand1: "#B4F9BA" } },
        logoDark: iconUrl,
        logoLight: iconUrl,
      },
      useWalletConnect: true,
      enableLogging: true,
    },
  });
  web3AuthInstance.addPlugin(torusPlugin);

  return new LoginConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider,
      },
    },
  });
}
