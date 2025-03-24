import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Agent - Fuse Console',
  description: 'Ask the Fuse AI Agent to handle your Fuse Network transactions, manage assets, and navigate DeFi services.',
}

export default function AiAgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
