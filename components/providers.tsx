"use client";

import { useEffect, useState } from "react";
import store from "@/store/store";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";
import * as amplitude from '@amplitude/analytics-browser';
import { YMInitializer } from "react-yandex-metrika";
import {
  NEXT_PUBLIC_AMPLITUDE_API_KEY,
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  NEXT_PUBLIC_YANDEX_METRICA_ID
} from "@/lib/config";
import { WagmiConfig } from "wagmi";
import { config } from "@/lib/web3Auth";
import WalletModal from "./WalletModal";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, [])

  if (!isClient) {
    return null;
  }

  ReactGA.initialize(NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string);
  amplitude.init(NEXT_PUBLIC_AMPLITUDE_API_KEY as string);

  return (
    <Provider store={store}>
      <WagmiConfig config={config}>
        <YMInitializer
          accounts={[parseInt(NEXT_PUBLIC_YANDEX_METRICA_ID)]}
          options={{
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          }}
        />
        <WalletModal />
        {children}
      </WagmiConfig>
    </Provider>
  )
}
