import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0c29',
}

export const metadata: Metadata = {
  title: 'Enakko Stock Dashboard',
  description: 'Ayam Guling Enakko Bali — Stock Monitoring System',
  icons: {
    icon: 'https://ayamgulingenakko.com/images/095c0779e56422e1839838ffbe2abe86.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}