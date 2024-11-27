import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Airdrop Leaderboard - Fuse Console',
  description: 'View all participants ranks in the Fuse Airdrop Leaderboard!',
}

export default function AirdropLeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
