import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Staking - Fuse Console',
  description: 'Participate in the consensus of Fuse network by staking FUSE tokens',
}

export default function StakingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}