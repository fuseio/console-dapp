import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Points - Fuse Console Ember',
  description: 'Complete quests and invite friends to earn XP',
}

export default function AirdropEcosystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
