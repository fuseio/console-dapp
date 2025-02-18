import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ember Nodes - Fuse Console',
  description: 'Ember reward distribution portal to delegate license to node operator and claim rewards',
}

export default function EmberNodesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
