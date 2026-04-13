import { getLatestSnapshots } from '@/lib/data'
import { OutletSnapshot } from '@/lib/types'
import {
  Package, PackageX, EyeOff, Store, Calendar,
  TrendingUp, AlertTriangle, CheckCircle2, ShieldCheck,
  Info
} from 'lucide-react'

const TOTAL_MENU_ITEMS = 28
const GOFOOD_LOGO_URL = 'https://i.gojekapi.com/darkroom/gofood-id/v2/images/uploads/f9546f29-23c3-4384-adf9-03bb59a89136_gofood-logo.png?auto=format'
const GRABFOOD_LOGO_URL = 'https://food.grab.com/static/images/logo-grabfood-white2.svg'

type Platform = 'GoFood' | 'GrabFood'

function formatDate(dateStr: string): string {
  if (dateStr === 'No data yet') return 'Belum ada data'
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function getPlatform(outletName: string): Platform {
  return outletName.startsWith('GrabFood - ') ? 'GrabFood' : 'GoFood'
}

function cleanOutletName(outletName: string): string {
  return outletName.startsWith('GrabFood - ') ? outletName.replace('GrabFood - ', '') : outletName
}

function PlatformBadge({ platform }: { platform: Platform }) {
  const isGrab = platform === 'GrabFood'
  const logoSrc = isGrab ? GRABFOOD_LOGO_URL : GOFOOD_LOGO_URL

  return (
    <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 ${isGrab ? 'border-emerald-600 bg-emerald-500' : 'border-rose-200 bg-rose-50'}`}>
      <img src={logoSrc} alt={`${platform} logo`} className={`${isGrab ? 'h-3 w-auto' : 'h-3.5 w-auto'}`} />
    </span>
  )
}

/* ==================================================================
   STAT CARD — KPI display, data-dense, mono numbers
   ================================================================== */
function StatCard({ icon: Icon, label, value, accent, symbol }: {
  icon: React.ElementType, label: string, value: number, accent: 'ok' | 'error' | 'neutral', symbol: string
}) {
  const styles = {
    ok: { bg: 'card-ok', iconColor: 'text-emerald-600', valueColor: 'text-emerald-700' },
    error: { bg: 'card-error', iconColor: 'text-red-600', valueColor: 'text-red-700' },
    neutral: { bg: 'card card', iconColor: 'text-slate-500', valueColor: 'text-slate-700' },
  }
  const s = styles[accent]

  return (
    <div className={`${s.bg} flex flex-col justify-between`} role="status" aria-label={`${label}: ${value}`}>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3.5 h-3.5 ${s.iconColor}`} aria-hidden="true" />
        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`stat-value ${s.valueColor}`}>{value}</span>
        <span className="text-[10px] text-slate-400 uppercase">{symbol}</span>
      </div>
    </div>
  )
}

/* ==================================================================
   OUTLET CARD — Data-dense, expandable, WCAG AAA
   ================================================================== */
function OutletCard({ data }: { data: OutletSnapshot }) {
  const hasIssues = data.offStock.length > 0 || data.inactiveMenu.length > 0
  const totalIssues = data.offStock.length + data.inactiveMenu.length
  const platform = getPlatform(data.outlet.name)
  const displayName = cleanOutletName(data.outlet.name)

  return (
    <article
      className={`card ${hasIssues ? 'border-l-[3px] border-l-red-500' : 'border-l-[3px] border-l-emerald-500'}`}
      role="region"
      aria-label={`Outlet ${data.outlet.name}`}
    >
      {/* Header row — data dense */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-slate-500 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-semibold text-slate-900 leading-tight">{displayName}</h3>
            <div className="mt-0.5 flex items-center gap-1.5">
              <PlatformBadge platform={platform} />
              <p className="text-[11px] text-slate-500">{TOTAL_MENU_ITEMS} menu</p>
            </div>
          </div>
        </div>
        {hasIssues ? (
          <span className="badge-error" aria-label={`${totalIssues} masalah`}>
            <AlertTriangle className="w-3 h-3" aria-hidden="true" />
            {totalIssues}
          </span>
        ) : (
          <span className="badge-ok" aria-label="Semua baik">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            OK
          </span>
        )}
      </div>

      {/* Data section */}
      {data.items.length === 0 ? (
        <div className="flex items-center gap-2 py-2 text-slate-400">
          <TrendingUp className="w-4 h-4" aria-hidden="true" />
          <p className="text-xs">Menunggu data snapshot</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Stock status row */}
          {data.offStock.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <PackageX className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-red-600">
                  Stok Habis
                </span>
                <span className="ml-auto text-[11px] font-mono text-red-400">{data.offStock.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.offStock.map((item) => (
                  <span key={item.id} className="tag-error">
                    {item.item_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Inactive menu row */}
          {data.inactiveMenu.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <EyeOff className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Menu Nonaktif
                </span>
                <span className="ml-auto text-[11px] font-mono text-slate-400">{data.inactiveMenu.length}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {data.inactiveMenu.map((item) => (
                  <span key={item.id} className="tag-neutral">
                    {item.item_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All good */}
          {data.offStock.length === 0 && data.inactiveMenu.length === 0 && (
            <div className="flex items-center gap-1.5 py-0.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" aria-hidden="true" />
              <span className="text-xs font-medium text-emerald-600">Semua item tersedia</span>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

/* ==================================================================
   COMPACT GOOD OUTLET — inline row
   ================================================================== */
function GoodOutletRow({ data }: { data: OutletSnapshot }) {
  const platform = getPlatform(data.outlet.name)
  const displayName = cleanOutletName(data.outlet.name)

  return (
    <div
      className="data-row cursor-default"
      role="listitem"
      aria-label={`${displayName}: semua baik, ${TOTAL_MENU_ITEMS} item`}
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium text-slate-800 ml-2 truncate">{displayName}</span>
      <span className="ml-2">
        <PlatformBadge platform={platform} />
      </span>
      <span className="ml-auto text-[11px] text-emerald-500 font-mono font-medium">✓ {TOTAL_MENU_ITEMS}/{TOTAL_MENU_ITEMS}</span>
    </div>
  )
}

/* ==================================================================
   MAIN DASHBOARD PAGE
   ================================================================== */
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
      <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[var(--bg-page)]" role="alert">
        <div className="card text-center max-w-sm animate-in">
          <div className="w-14 h-14 rounded-lg bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-red-500" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-semibold text-slate-900 mb-1">Akses Ditolak</h1>
          <p className="text-sm text-slate-500">{error || 'Link tidak valid'}</p>
        </div>
      </div>
    )
  }

  const sortByPlatformAndName = (a: OutletSnapshot, b: OutletSnapshot) => {
    const pa = getPlatform(a.outlet.name)
    const pb = getPlatform(b.outlet.name)
    if (pa !== pb) return pa === 'GoFood' ? -1 : 1
    return cleanOutletName(a.outlet.name).localeCompare(cleanOutletName(b.outlet.name), 'id-ID')
  }

  const outletsWithIssues = outlets
    .filter(o => o.offStock.length > 0 || o.inactiveMenu.length > 0)
    .sort(sortByPlatformAndName)
  const outletsAllGood = outlets
    .filter(o => o.snapshot !== null && o.offStock.length === 0 && o.inactiveMenu.length === 0)
    .sort(sortByPlatformAndName)
  const outletsNoData = outlets.filter(o => o.snapshot === null).sort(sortByPlatformAndName)
  const totalItems = outlets.filter(o => o.snapshot !== null).length * TOTAL_MENU_ITEMS
  const totalOff = outlets.reduce((sum, o) => sum + o.offStock.length, 0)
  const totalInactive = outlets.reduce((sum, o) => sum + o.inactiveMenu.length, 0)

  return (
    <div className="min-h-[100dvh] bg-[var(--bg-page)]">
      {/* Skip Link (WCAG) */}
      <a href="#main-content" className="skip-link">Langsung ke konten utama</a>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10" role="banner">
        <div className="max-w-2xl mx-auto px-4" style={{ height: 'var(--header-height)' }}>
          <div className="flex items-center gap-3 h-full">
            <img
              src="https://ayamgulingenakko.com/images/095c0779e56422e1839838ffbe2abe86.png"
              alt="Logo Enakko"
              className="w-9 h-9 object-contain shrink-0"
            />
            <div className="min-w-0">
              <h1 className="text-[var(--font-size-lg)] font-bold text-slate-900 leading-tight">Enakko Stock Monitor</h1>
              <div className="mt-1 flex items-center gap-1.5" aria-label="Platform monitor: GoFood dan GrabFood">
                <span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-1.5 py-0.5">
                  <img src={GOFOOD_LOGO_URL} alt="GoFood" className="h-4 w-auto" />
                </span>
                <span className="inline-flex items-center rounded-md border border-emerald-600 bg-emerald-500 px-1.5 py-0.5">
                  <img src={GRABFOOD_LOGO_URL} alt="GrabFood" className="h-3.5 w-auto" />
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                <time>{formatDate(date)}</time>
                <span className="text-slate-300" aria-hidden="true">·</span>
                <Store className="w-3 h-3" aria-hidden="true" />
                <span>{outlets.length} gerai</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5 text-[11px] text-slate-400" aria-label="Ayam Guling Enakko Bali">
              <Info className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Enakko Bali</span>
            </div>
          </div>
        </div>
      </header>

      {/* KPI Stats Row — data-dense, compact grid */}
      <nav className="max-w-2xl mx-auto px-4 pt-4" aria-label="Ringkasan status">
        <div className="grid grid-cols-3 gap-[var(--grid-gap)]">
          <StatCard icon={Package} label="Total Item" value={totalItems} accent="ok" symbol="item tersedia" />
          <StatCard icon={PackageX} label="Stok Habis" value={totalOff} accent="error" symbol="off" />
          <StatCard icon={EyeOff} label="Nonaktif" value={totalInactive} accent="neutral" symbol="menu" />
        </div>
      </nav>

      {/* Main Content */}
      <main id="main-content" className="max-w-2xl mx-auto px-4 pt-4 pb-8 space-y-5" role="main">
        {/* Issues */}
        {outletsWithIssues.length > 0 && (
          <section aria-label="Outlet dengan masalah">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">
                Perlu Perhatian
              </h2>
              <span className="text-[11px] font-mono text-slate-400 ml-1">
                {outletsWithIssues.length}/{outlets.length}
              </span>
            </div>
            <div className="space-y-2 stagger" role="list">
              {outletsWithIssues.map((o) => (
                <OutletCard key={o.outlet.id} data={o} />
              ))}
            </div>
          </section>
        )}

        {/* All Good */}
        {outletsAllGood.length > 0 && (
          <section aria-label="Outlet tanpa masalah">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">
                Semua Baik
              </h2>
              <span className="text-[11px] font-mono text-slate-400 ml-1">
                {outletsAllGood.length}/{outlets.length}
              </span>
            </div>
            <div className="card overflow-hidden" role="list">
              {outletsAllGood.map((o) => (
                <GoodOutletRow key={o.outlet.id} data={o} />
              ))}
            </div>
          </section>
        )}

        {/* No Data */}
        {outletsNoData.length > 0 && (
          <section aria-label="Outlet menunggu data">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              </div>
              <h2 className="text-sm font-semibold text-slate-500">
                Menunggu Data
              </h2>
              <span className="text-[11px] font-mono text-slate-300 ml-1">
                {outletsNoData.length}/{outlets.length}
              </span>
            </div>
            <div className="card overflow-hidden opacity-60">
              {outletsNoData.map((o) => {
                const platform = getPlatform(o.outlet.name)
                const displayName = cleanOutletName(o.outlet.name)
                return (
                  <div key={o.outlet.id} className="data-row" role="listitem" aria-label={displayName}>
                    <Store className="w-4 h-4 text-slate-300" aria-hidden="true" />
                    <span className="text-sm text-slate-400 ml-2">{displayName}</span>
                    <span className="ml-2 opacity-60">
                      <PlatformBadge platform={platform} />
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 pb-6 text-center" role="contentinfo">
        <p className="text-[11px] text-slate-400">
          Auto-updated daily at 15:00 WITA &middot; Powered by Hermes
        </p>
      </footer>
    </div>
  )
}