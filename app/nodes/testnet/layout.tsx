import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Testnet Nodes - Fuse Console',
  description: 'Testnet reward distribution portal to delegate license to node operator and claim rewards',
}

export default function TestnetNodesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
