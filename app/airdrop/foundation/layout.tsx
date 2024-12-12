import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Airdrop Foundation - Fuse Console',
  description: 'Complete quests and invite friends to earn XP',
}

export default function AirdropFoundationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
