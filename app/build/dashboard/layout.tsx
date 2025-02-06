import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Fuse Console Build',
  description: 'Get your API key and top up your smart contract account to interact with FuseBox',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
