import { getDashboardToken } from '@/lib/data'
import { redirect } from 'next/navigation'
import { AlertTriangle } from 'lucide-react'

export default async function Home() {
  const token = await getDashboardToken()
  if (token) {
    redirect(`/${token}`)
  }
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[var(--bg-page)]" role="main">
      <div className="card text-center max-w-sm animate-in">
        <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
          <img
            src="https://ayamgulingenakko.com/images/095c0779e56422e1839838ffbe2abe86.png"
            alt="Logo Enakko"
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-lg font-semibold text-slate-900">Dashboard Belum Tersedia</h1>
        <p className="text-sm text-slate-500 mt-1">Hubungi admin untuk akses</p>
      </div>
    </div>
  )
}