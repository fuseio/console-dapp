import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Overview - Fuse Console Build',
  description: 'All-in-one platform for building decentralized apps with account abstraction, gasless transactions, and smart contract wallets',
}

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
