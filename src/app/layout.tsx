import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Enakko Stock Dashboard',
  description: 'Ayam Guling Enakko Bali — Stock Monitoring Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}