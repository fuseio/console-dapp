import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bridge - Fuse Console',
  description: 'Move funds from different networks and centralised exchanges to Fuse',
}

export default function BridgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
