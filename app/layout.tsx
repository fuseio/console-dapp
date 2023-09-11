import { Providers } from '@/components/providers'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
 
const monaSans = localFont({
  src: './MonaSans.woff2',
  display: 'swap',
  variable: '--font-mona-sans',
}) 

export const metadata: Metadata = {
  title: 'Fuse Console',
  description: 'Combines Staking and Bridge',
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
    </html>
  )
}
