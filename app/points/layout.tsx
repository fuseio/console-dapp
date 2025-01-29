import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Points - Fuse Console',
  description: 'Join the Fuse Points! Get into the Fuse, connect your wallet and earn Rewards with ease',
}

export default function AirdropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
