import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing & Usage - Fuse Console Build',
  description: 'Get details about your Operator account billing, usage, current plan, and invoices',
}

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
