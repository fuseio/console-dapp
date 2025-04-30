"use client";
import {useEffect, useState} from "react";
import ReactGA from "react-ga4";
import {Provider} from "react-redux";
import {YMInitializer} from "react-yandex-metrika";
import {WagmiProvider} from "wagmi";

import DelegateLicenseModal from "@/components/nodes/DelegateLicenseModal";
import RevokeLicenseModal from "@/components/nodes/RevokeLicenseModal";
import ReDelegationModal from "@/components/nodes/ReDelegationModal";
import {
  NEXT_PUBLIC_AMPLITUDE_API_KEY,
  NEXT_PUBLIC_AMPLITUDE_SERVER_URL,
  NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_YANDEX_METRICA_ID,
} from "@/lib/config";
import {config, evmNetworks} from "@/lib/wagmi";
import store from "@/store/store";
import * as amplitude from "@amplitude/analytics-browser";
import {EthereumWalletConnectors} from "@dynamic-labs/ethereum";
import {
  DynamicContextProvider,
  mergeNetworks,
} from "@dynamic-labs/sdk-react-core";
import {DynamicWagmiConnector} from "@dynamic-labs/wagmi-connector";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import WalletModal from "./WalletModal";
import TransfiModal from "./wallet/TransfiModal";

export function Providers({children}: {children: React.ReactNode}) {
  const [isClient, setIsClient] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const queryClient = new QueryClient();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      ReactGA.initialize(NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string);
      amplitude.init(NEXT_PUBLIC_AMPLITUDE_API_KEY as string, {
        serverUrl: NEXT_PUBLIC_AMPLITUDE_SERVER_URL,
      });
    }
  }, [isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <DynamicContextProvider
      theme="auto"
      settings={{
        environmentId: NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID,
        walletConnectors: [EthereumWalletConnectors],
        overrides: {
          evmNetworks: (networks) => mergeNetworks(evmNetworks, networks),
        },
        initialAuthenticationMode: "connect-only",
        events: {
          onLogout: () => {
            setIsDisconnected(true);
          },
        },
      }}
    >
      <Provider store={store}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <YMInitializer
              accounts={[parseInt(NEXT_PUBLIC_YANDEX_METRICA_ID)]}
              options={{
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true,
                webvisor: true,
              }}
            />
            <DynamicWagmiConnector>
              <WalletModal isDisconnected={isDisconnected} />
              <TransfiModal />
              <DelegateLicenseModal />
              <RevokeLicenseModal />
              <ReDelegationModal />
              {children}
            </DynamicWagmiConnector>
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </DynamicContextProvider>
  );
}
