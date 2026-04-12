import { getDashboardToken } from '@/lib/data'
import { redirect } from 'next/navigation'

export default async function Home() {
  const token = await getDashboardToken()
  if (token) {
    redirect(`/${token}`)
  }
  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-4">
      <div className="glass p-10 text-center max-w-sm animate-float-up">
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 mx-auto mb-5 overflow-hidden">
          <img
            src="https://ayamgulingenakko.com/images/095c0779e56422e1839838ffbe2abe86.png"
            alt="Enakko"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h1 className="text-xl font-semibold text-white">Dashboard Belum Tersedia</h1>
        <p className="text-sm text-white/45 mt-2">Hubungi admin untuk akses</p>
      </div>
    </div>
  )
}