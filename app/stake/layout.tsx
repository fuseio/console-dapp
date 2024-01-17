import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stake - Fuse Console',
  description: 'Stake FUSE to a validator and stake or unstake your FUSE tokens at any time',
}

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}