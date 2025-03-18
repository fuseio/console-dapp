import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Flash Testnet - Fuse Console Rewards',
  description: 'FUSE Flash is the testnet for FUSE Ember, a ZKEVM Layer 2 blockchain. Join our bounty program rewarding developers for building apps on Ember.',
}

export default function AirdropFlashLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
