import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Airdrop Profile - Fuse Console',
  description: 'Join the Fuse Airdrop! Get into the Fuse, connect your wallet and earn Rewards with ease',
}

export default function AirdropProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
