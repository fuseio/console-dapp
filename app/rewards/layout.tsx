import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rewards - Fuse Console',
  description: 'Join the Fuse Rewards! Get into the Fuse, connect your wallet and earn Rewards with ease',
}

export default function AirdropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
