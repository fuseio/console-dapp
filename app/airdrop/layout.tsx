import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Airdrop - Fuse Console',
  description: 'Join the Fuse Airdrop! Get into the Fuse, connect your wallet and earn Rewards with ease',
}

export default function AirdropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
