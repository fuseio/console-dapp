import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard - Fuse Console Rewards',
  description: 'View all participants ranks in the Fuse Rewards Leaderboard!',
}

export default function AirdropLeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
