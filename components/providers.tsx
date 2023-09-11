"use client";

import { useEffect } from "react";
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

export function Providers({ children }: { children: React.ReactNode }) {
  if(!window || typeof window === 'undefined') {
    return
  }

  ReactGA.initialize(NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string);
  amplitude.init(NEXT_PUBLIC_AMPLITUDE_API_KEY as string);

  return (
    <Provider store={store}>
      <YMInitializer
        accounts={[parseInt(NEXT_PUBLIC_YANDEX_METRICA_ID)]}
      />
      {children}
    </Provider>
  )
}
