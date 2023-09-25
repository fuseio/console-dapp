import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter, OPENLOGIN_NETWORK, LOGIN_PROVIDER, LOGIN_PROVIDER_TYPE, ExtraLoginOptions } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { configureChains, createConfig } from "wagmi";
import { NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID, NEXT_PUBLIC_WEB3AUTH_CLIENT_ID } from "./config";
import { mainnet, arbitrum, polygon } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";
import { LedgerConnector } from "wagmi/connectors/ledger";

const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet, arbitrum, polygon], [publicProvider()]);

export const config = createConfig({
  autoConnect: true,
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
    new LedgerConnector({
      chains,
      options: {
        projectId: NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
      }
    }),
    Web3AuthConnectorInstance(LOGIN_PROVIDER.FACEBOOK),
    Web3AuthConnectorInstance(LOGIN_PROVIDER.TWITTER),
    Web3AuthConnectorInstance(LOGIN_PROVIDER.DISCORD),
    Web3AuthConnectorInstance(LOGIN_PROVIDER.GOOGLE),
    Web3AuthConnectorInstance(LOGIN_PROVIDER.TWITCH),
    Web3AuthConnectorInstance(LOGIN_PROVIDER.GITHUB),
  ],
  publicClient,
  webSocketPublicClient,
});


export default function Web3AuthConnectorInstance(loginProvider: LOGIN_PROVIDER_TYPE, extraLoginOptions?: ExtraLoginOptions) {
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x" + chains[0].id.toString(16),
    rpcTarget: chains[0].rpcUrls.default.http[0],
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url[0] as string,
  }

  const web3AuthInstance = new Web3AuthNoModal({
    clientId: NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
    chainConfig,
    web3AuthNetwork: OPENLOGIN_NETWORK.SAPPHIRE_MAINNET,
  });

  const privateKeyProvider = new EthereumPrivateKeyProvider({ config: { chainConfig } });

  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
  });
  web3AuthInstance.configureAdapter(openloginAdapterInstance);

  return new Web3AuthConnector({
    chains: chains,
    options: {
      web3AuthInstance,
      loginParams: {
        loginProvider,
        extraLoginOptions,
      },
    },
  });
}
