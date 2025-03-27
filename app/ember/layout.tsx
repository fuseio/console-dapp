import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ember - Fuse Console',
  description: 'Join the Fuse Ember! Get into the Fuse, connect your wallet and earn rewards with ease',
}

export default function AirdropLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
