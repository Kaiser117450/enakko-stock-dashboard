import { getLatestSnapshots } from '@/lib/data'
import { OutletSnapshot } from '@/lib/types'
import {
  Package, PackageX, EyeOff, Store, Calendar,
  TrendingUp, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Shield, AlignLeft
} from 'lucide-react'

function formatDate(dateStr: string): string {
  if (dateStr === 'No data yet') return 'Belum ada data'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function StatCard({ icon: Icon, label, value, accent }: { icon: React.ElementType, label: string, value: number, accent: 'ok' | 'error' | 'neutral' }) {
  const accentMap = {
    ok: { icon: 'text-emerald-400', bg: 'glass-ok', border: 'border-emerald-500/20' },
    error: { icon: 'text-red-400', bg: 'glass-error', border: 'border-red-500/20' },
    neutral: { icon: 'text-white/50', bg: 'glass-neutral', border: 'border-white/10' },
  }
  const style = accentMap[accent]

  return (
    <div className={`${style.bg} p-4 flex flex-col gap-1.5 transition-all duration-200 hover:scale-[1.02]`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${style.icon}`} />
        <span className="text-[11px] font-medium tracking-wide uppercase text-white/50">{label}</span>
      </div>
      <div className="text-3xl font-bold tabular-nums tracking-tight text-white">{value}</div>
    </div>
  )
}

function OutletCard({ data, index }: { data: OutletSnapshot, index: number }) {
  const hasIssues = data.offStock.length > 0 || data.inactiveMenu.length > 0
  const totalIssues = data.offStock.length + data.inactiveMenu.length

  return (
    <div
      className={`animate-float-up overflow-hidden transition-all duration-300 hover:scale-[1.005] ${
        hasIssues ? 'glass-error' : 'glass-ok'
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Card Header */}
      <div className={`px-5 py-3.5 flex items-center justify-between border-b ${
        hasIssues ? 'border-red-500/15' : 'border-emerald-500/15'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            hasIssues
              ? 'bg-red-500/15'
              : 'bg-emerald-500/15'
          }`}>
            <Store className={`w-[18px] h-[18px] ${hasIssues ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-[15px] text-white/95 leading-tight">{data.outlet.name}</h3>
            <p className="text-xs text-white/40 mt-0.5">{data.items.length} menu items</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
          hasIssues ? 'badge-error' : 'badge-ok'
        }`}>
          {hasIssues ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5" />
              {totalIssues} issue{totalIssues > 1 ? 's' : ''}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              All Good
            </>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4">
        {data.items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-3 opacity-50">
            <TrendingUp className="w-6 h-6 text-white/30" />
            <p className="text-sm text-white/40">Menunggu data snapshot</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Out of Stock */}
            {data.offStock.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PackageX className="w-4 h-4 text-red-400" />
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Stok Habis</span>
                  <span className="ml-auto text-xs text-red-400/70 font-mono">{data.offStock.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.offStock.map((item) => (
                    <span key={item.id} className="tag-error inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium">
                      {item.item_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Menu */}
            {data.inactiveMenu.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-4 h-4 text-white/40" />
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">Menu Nonaktif</span>
                  <span className="ml-auto text-xs text-white/30 font-mono">{data.inactiveMenu.length}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.inactiveMenu.map((item) => (
                    <span key={item.id} className="tag-neutral inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium">
                      {item.item_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* All Good */}
            {data.offStock.length === 0 && data.inactiveMenu.length === 0 && (
              <div className="flex items-center justify-center gap-2 py-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">Semua item tersedia</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function GoodOutletBadge({ data, index }: { data: OutletSnapshot, index: number }) {
  return (
    <div
      className="glass-neutral glass-hover flex items-center gap-3 px-4 py-3 animate-float-up cursor-pointer"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/12">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/90 truncate">{data.outlet.name}</p>
        <p className="text-xs text-white/40">{data.items.length} items</p>
      </div>
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
      <div className="min-h-[100dvh] flex items-center justify-center p-4">
        <div className="glass p-8 text-center max-w-sm animate-float-up">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Akses Ditolak</h1>
          <p className="text-sm text-white/50">{error || 'Link tidak valid'}</p>
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
    <div className="min-h-[100dvh]">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3.5">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
              <img
                src="https://ayamgulingenakko.com/images/095c0779e56422e1839838ffbe2abe86.png"
                alt="Enakko"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-[17px] font-bold text-white leading-tight">Enakko Stock Monitor</h1>
              <p className="text-xs text-white/45 mt-0.5">Ayam Guling Enakko Bali</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(date)}
            </span>
            <span className="text-white/15">·</span>
            <span className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              {outlets.length} gerai
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-lg mx-auto px-4 pt-5">
        <div className="grid grid-cols-3 gap-2.5">
          <StatCard icon={Package} label="Total Items" value={totalItems} accent="ok" />
          <StatCard icon={PackageX} label="Stok Habis" value={totalOff} accent="error" />
          <StatCard icon={EyeOff} label="Nonaktif" value={totalInactive} accent="neutral" />
        </div>
      </div>

      {/* Issues Section */}
      <main className="max-w-lg mx-auto px-4 py-5 space-y-5">
        {outletsWithIssues.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <h2 className="text-sm font-semibold text-red-400">Perlu Perhatian <span className="text-white/30 font-normal">({outletsWithIssues.length})</span></h2>
            </div>
            <div className="space-y-3 stagger">
              {outletsWithIssues.map((o, i) => (
                <OutletCard key={o.outlet.id} data={o} index={i} />
              ))}
            </div>
          </section>
        )}

        {outletsAllGood.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h2 className="text-sm font-semibold text-emerald-400">Semua Baik <span className="text-white/30 font-normal">({outletsAllGood.length})</span></h2>
            </div>
            <div className="space-y-2 stagger">
              {outletsAllGood.map((o, i) => (
                <GoodOutletBadge key={o.outlet.id} data={o} index={i} />
              ))}
            </div>
          </section>
        )}

        {outletsNoData.length > 0 && (
          <section>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white/40" />
              </div>
              <h2 className="text-sm font-semibold text-white/50">Menunggu Data <span className="text-white/25 font-normal">({outletsNoData.length})</span></h2>
            </div>
            <div className="space-y-2 stagger">
              {outletsNoData.map((o, i) => (
                <div key={o.outlet.id}
                  className="glass-neutral flex items-center gap-3 px-4 py-3 opacity-50 animate-float-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Store className="w-4 h-4 text-white/30" />
                  <p className="text-sm text-white/40">{o.outlet.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-xs text-white/25">
          Auto-updated daily at 15:00 WITA &middot; Powered by Hermes
        </p>
      </footer>
    </div>
  )
}