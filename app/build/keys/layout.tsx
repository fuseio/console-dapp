import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Keys - Fuse Console Build',
  description: 'Get your API keys and start building decentralized applications with FuseBox SDKs',
}

export default function KeysLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
