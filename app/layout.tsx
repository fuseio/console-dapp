import { Providers } from '@/components/providers'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'

const monaSans = localFont({
  src: './MonaSans.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
})

export const metadata: Metadata = {
  title: 'Fuse Console',
  description: 'One-stop-shop for all Fuse token holders',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={monaSans.className}>
        <Providers>{children}</Providers>
      </body>
      <Script
        src="https://widget.mava.app"
        widget-version="v2"
        id="MavaWebChat"
        data-token="6cc157a59efb2fcc926d3337298206bcbdaccd8ee26c09b374bcda0ad561f8fb"
      />
    </html>
  )
}
