import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Builder Grants - Fuse Console Points',
  description: 'A bounty program rewarding developers for building apps on Ember',
}

export default function AirdropGrantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
