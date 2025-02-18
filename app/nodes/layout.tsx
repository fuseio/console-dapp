import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nodes - Fuse Console',
  description: 'Reward distribution portal to delegate license to node operator and claim rewards',
}

export default function NodesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
