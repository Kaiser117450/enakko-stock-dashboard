import { supabase } from '@/lib/supabase'
import { Outlet, Snapshot, SnapshotItem, OutletSnapshot } from '@/lib/types'

export async function getLatestSnapshots(token: string): Promise<{
  date: string
  outlets: OutletSnapshot[]
}> {
  // Verify dashboard token
  const { data: config } = await supabase
    .from('dashboard_config')
    .select('access_token')
    .eq('access_token', token)
    .single()

  if (!config) {
    throw new Error('Invalid dashboard token')
  }

  // Get all outlets
  const { data: outlets } = await supabase
    .from('outlets')
    .select('*')
    .order('name')

  if (!outlets) {
    throw new Error('Failed to fetch outlets')
  }

  // Get latest snapshot date
  const { data: latestSnap } = await supabase
    .from('snapshots')
    .select('snapshot_date')
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single()

  if (!latestSnap) {
    return { date: 'No data yet', outlets: outlets.map((o: Outlet) => ({
      outlet: o, snapshot: null, items: [], offStock: [], inactiveMenu: []
    }))}
  }

  const snapshotDate = latestSnap.snapshot_date

  // Get all snapshots for that date
  const { data: snapshots } = await supabase
    .from('snapshots')
    .select('*')
    .eq('snapshot_date', snapshotDate)

  // Get all items for those snapshots
  const snapshotIds = (snapshots || []).map((s: Snapshot) => s.id)
  
  const { data: items } = snapshotIds.length > 0
    ? await supabase
        .from('snapshot_items')
        .select('*')
        .in('snapshot_id', snapshotIds)
    : { data: [] }

  // Build response
  const result: OutletSnapshot[] = outlets.map((outlet: Outlet) => {
    const snapshot = (snapshots || []).find((s: Snapshot) => s.outlet_id === outlet.id) || null
    const outletItems = (items || []).filter((i: SnapshotItem) => i.snapshot_id === snapshot?.id)
    
    return {
      outlet,
      snapshot,
      items: outletItems,
      offStock: outletItems.filter((i: SnapshotItem) => i.stock_status === 'OFF'),
      inactiveMenu: outletItems.filter((i: SnapshotItem) => i.menu_status === 'inactive'),
    }
  })

  return { date: snapshotDate, outlets: result }
}

export async function getDashboardToken(): Promise<string | null> {
  const { data } = await supabase
    .from('dashboard_config')
    .select('access_token')
    .eq('id', 1)
    .single()
  
  return data?.access_token || null
}