import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stake - Fuse Console',
  description: 'View information about current validator node on the Fuse Network',
}

export default function StakeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
