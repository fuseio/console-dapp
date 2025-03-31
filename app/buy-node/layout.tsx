import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Buy Node - Fuse Console',
  description: 'Purchase a license to operate an Ember L2 node and earn rewards by securing the network',
}

export default function BuyNodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
