import { getDashboardToken } from '@/lib/data'
import { redirect } from 'next/navigation'

export default async function Home() {
  const token = await getDashboardToken()
  if (token) {
    redirect(`/${token}`)
  }
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
        <div className="text-6xl mb-4">🐔</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Enakko Stock Dashboard</h1>
        <p className="text-gray-500 text-sm">Dashboard belum dikonfigurasi. Hubungi admin.</p>
      </div>
    </div>
  )
}