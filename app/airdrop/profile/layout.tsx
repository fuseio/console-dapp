import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Airdrop Profile - Fuse Console',
  description: 'Complete quests and invite friends to earn XP',
}

export default function AirdropProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
