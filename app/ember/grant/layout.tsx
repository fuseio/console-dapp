import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Builder Grant - Fuse Console Ember',
  description: 'Join our bounty program rewarding developers for building apps on Ember.',
}

export default function AirdropFlashLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
