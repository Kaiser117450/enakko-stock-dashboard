export interface Outlet {
  id: string
  name: string
  gofood_merchant_id: string
  restaurant_id: string
  menu_group_id: string
  created_at: string
}

export interface Snapshot {
  id: string
  outlet_id: string
  snapshot_date: string
  created_at: string
}

export interface SnapshotItem {
  id: string
  snapshot_id: string
  item_name: string
  stock_status: 'ON' | 'OFF'
  menu_status: 'active' | 'inactive'
  created_at: string
}

export interface OutletSnapshot {
  outlet: Outlet
  snapshot: Snapshot | null
  items: SnapshotItem[]
  offStock: SnapshotItem[]
  inactiveMenu: SnapshotItem[]
}