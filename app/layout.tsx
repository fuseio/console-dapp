import {Providers} from "@/components/providers";
import "@/styles/globals.css";
import type {Metadata} from "next";
import localFont from "next/font/local";
import Script from "next/script";
import HolyLoader from "holy-loader";

import DelegateLicenseModal from "@/components/nodes/DelegateLicenseModal";
import RevokeLicenseModal from "@/components/nodes/RevokeLicenseModal";
import ReDelegationModal from "@/components/nodes/ReDelegationModal";

const monaSans = localFont({
  src: "./MonaSans.woff2",
  display: "swap",
  variable: "--font-mona-sans",
});

export const metadata: Metadata = {
  title: "Fuse Console",
  description: "One-stop-shop for all Fuse token holders",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <Script
          src="https://cdn.markfi.xyz/scripts/analytics/0.11.21/cookie3.analytics.min.js"
          integrity="sha384-wtYmYhbRlAqGwxc5Vb9GZVyp/Op3blmJICmXjRiJu2/TlPze5dHsmg2gglbH8viT"
          crossOrigin="anonymous"
          async
          strategy="lazyOnload"
          site-id="ee6ada1d-4284-40df-abbf-94a0730f7954"
        />
      </head>
      <body className={monaSans.className}>
        <HolyLoader color="#A3F5AA" />
        <Providers>
          {children}
          <DelegateLicenseModal />
          <RevokeLicenseModal />
          <ReDelegationModal />
        </Providers>
      </body>
      <Script
        src="https://widget.mava.app"
        widget-version="v2"
        id="MavaWebChat"
        data-token="6cc157a59efb2fcc926d3337298206bcbdaccd8ee26c09b374bcda0ad561f8fb"
      />
    </html>
  );
}
