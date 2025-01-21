import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leaderboard - Fuse Console Points',
  description: 'View all participants ranks in the Fuse Points Leaderboard!',
}

export default function AirdropLeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
