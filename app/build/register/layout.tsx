import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Build - Fuse Console',
  description: 'Your all-in-one solution for effortlessly launching your decentralized Web3 application',
}

export default function BuildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
