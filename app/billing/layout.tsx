import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing & Plan - Fuse Console',
  description: 'Upgrade your billing & plan and view your invoices',
}

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
