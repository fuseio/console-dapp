import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wallet - Fuse Console',
  description: 'Easily access affordable Web3 payment & loyalty infrastructure without development hurdles or vendor dependencies',
}

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
