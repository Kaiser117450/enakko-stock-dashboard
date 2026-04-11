import { getLatestSnapshots } from '@/lib/data'
import { OutletSnapshot } from '@/lib/types'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

function StatusBadge({ status, type }: { status: 'ON' | 'OFF' | 'active' | 'inactive', type: 'stock' | 'menu' }) {
  if (type === 'stock') {
    return status === 'ON' 
      ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">ON</span>
      : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">OFF</span>
  }
  return status === 'active'
    ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>
    : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">Inactive</span>
}

function OutletCard({ data }: { data: OutletSnapshot }) {
  const hasIssues = data.offStock.length > 0 || data.inactiveMenu.length > 0
  
  return (
    <div className={`rounded-xl border-2 p-4 mb-4 ${hasIssues ? 'border-red-200 bg-red-50/50' : 'border-emerald-200 bg-emerald-50/50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">
          📍 {data.outlet.name}
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${hasIssues ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {hasIssues ? `⚠️ ${data.offStock.length + data.inactiveMenu.length} masalah` : '✅ All Good'}
        </span>
      </div>

      {data.items.length === 0 ? (
        <p className="text-gray-500 text-sm">Belum ada data snapshot</p>
      ) : (
        <div className="text-sm text-gray-600 mb-2">
          {data.items.length} menu items total
        </div>
      )}

      {data.offStock.length > 0 && (
        <div className="mb-2">
          <p className="text-red-700 font-semibold text-sm mb-1">❌ Stok Habis:</p>
          <div className="flex flex-wrap gap-1">
            {data.offStock.map((item) => (
              <span key={item.id} className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs">
                {item.item_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.inactiveMenu.length > 0 && (
        <div>
          <p className="text-gray-600 font-semibold text-sm mb-1">🔲 Menu Nonaktif:</p>
          <div className="flex flex-wrap gap-1">
            {data.inactiveMenu.map((item) => (
              <span key={item.id} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                {item.item_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {!hasIssues && data.items.length > 0 && (
        <p className="text-emerald-700 text-sm">Semua item tersedia ✨</p>
      )}
    </div>
  )
}

export default async function DashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  
  let date = ''
  let outlets: OutletSnapshot[] = []
  let error = ''

  try {
    const result = await getLatestSnapshots(token)
    date = result.date
    outlets = result.outlets
  } catch (e: unknown) {
    error = e instanceof Error ? e.message : 'Unknown error'
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Tidak Tersedia</h1>
          <p className="text-gray-600">{error || 'Link tidak valid'}</p>
        </div>
      </div>
    )
  }

  const outletsWithIssues = outlets.filter(o => o.offStock.length > 0 || o.inactiveMenu.length > 0)
  const outletsAllGood = outlets.filter(o => o.items.length > 0 && o.offStock.length === 0 && o.inactiveMenu.length === 0)
  const outletsNoData = outlets.filter(o => o.items.length === 0)
  const totalItems = outlets.reduce((sum, o) => sum + o.items.length, 0)
  const totalOff = outlets.reduce((sum, o) => sum + o.offStock.length, 0)
  const totalInactive = outlets.reduce((sum, o) => sum + o.inactiveMenu.length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🐔</span>
            <div>
              <h1 className="text-2xl font-bold">Enakko Stock Dashboard</h1>
              <p className="text-orange-100 text-sm">Ayam Guling Enakko Bali</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">📅 {date !== 'No data yet' ? formatDate(date) : 'Belum ada data'}</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">🏪 {outlets.length} outlets</span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">📊 {totalItems} items</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="max-w-2xl mx-auto px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{totalItems}</div>
            <div className="text-xs text-gray-500">Total Items</div>
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{totalOff}</div>
            <div className="text-xs text-gray-500">Stok Habis</div>
          </div>
          <div className="bg-white rounded-xl shadow p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">{totalInactive}</div>
            <div className="text-xs text-gray-500">Nonaktif</div>
          </div>
        </div>
      </div>

      {/* Outlet Cards */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {outletsWithIssues.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
              ⚠️ Perlu Perhatian ({outletsWithIssues.length})
            </h2>
            {outletsWithIssues.map((o) => (
              <OutletCard key={o.outlet.id} data={o} />
            ))}
          </div>
        )}

        {outletsAllGood.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-emerald-700 mb-3 flex items-center gap-2">
              ✅ Semua Baik ({outletsAllGood.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {outletsAllGood.map((o) => (
                <div key={o.outlet.id} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-emerald-800">{o.outlet.name}</div>
                  <div className="text-xs text-emerald-600">{o.items.length} items ✨</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {outletsNoData.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-500 mb-3">
              ⏳ Belum Ada Data ({outletsNoData.length})
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {outletsNoData.map((o) => (
                <div key={o.outlet.id} className="bg-gray-100 border border-gray-200 rounded-xl p-3 text-center">
                  <div className="text-sm font-semibold text-gray-600">{o.outlet.name}</div>
                  <div className="text-xs text-gray-400">Menunggu snapshot</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto px-4 pb-8 text-center text-xs text-gray-400">
        Auto-updated daily at 15:00 WITA • Powered by Hermes
      </div>
    </div>
  )
}