// AgroStock Pro Types

export type SystemMode = 'seed' | 'live'

export interface User {
  id: string
  name: string
  email: string
  password_hash?: string
  is_active: boolean
  login_attempts: number
  locked_until?: string
  must_change_password: boolean
  last_login_at?: string
  created_at: string
}

export interface SafeUser {
  id: string
  name: string
  email: string
  is_active: boolean
  last_login_at?: string
}

export interface Farm {
  id: string
  owner_id: string
  name: string
  location?: string
  area_ha?: number
  is_active: boolean
  created_at: string
}

export interface Warehouse {
  id: string
  farm_id: string
  name: string
  description?: string
  capacity_max?: number
  responsible_id?: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  farm_id: string
  name: string
  description?: string
  parent_id?: string
  is_active: boolean
}

export interface Product {
  id: string
  farm_id: string
  category_id?: string
  code: string
  name: string
  unit: string
  price_ref?: number
  expiry_date?: string
  notes?: string
  is_active: boolean
  created_at: string
}

export interface Stock {
  id: string
  product_id: string
  warehouse_id: string
  current_stock: number
  reserved_stock: number
  min_stock: number
}

export interface StockItem {
  product_id: string
  product_code: string
  product_name: string
  category_name?: string
  warehouse_id: string
  warehouse_name: string
  current_stock: number
  reserved_stock: number
  min_stock: number
  unit: string
  price_ref: number
  last_movement?: string
}

export interface Movement {
  id: string
  stock_id: string
  farm_id: string
  warehouse_id: string
  user_id: string
  type: 'entrada' | 'salida' | 'ajuste' | 'transferencia_salida' | 'transferencia_entrada'
  subtype?: string
  quantity: number
  balance_after: number
  reason: string
  transfer_id?: string
  created_at: string
  product_code?: string
  product_name?: string
  warehouse_name?: string
  user_name?: string
}

export interface Transfer {
  id: string
  initiator_id: string
  farm_origin_id: string
  warehouse_origin_id: string
  farm_dest_id: string
  warehouse_dest_id: string
  product_id: string
  quantity: number
  status: 'pendiente' | 'aprobada' | 'rechazada'
  reason?: string
  rejection_reason?: string
  approver_id?: string
  approved_at?: string
  is_intrafarm: boolean
  created_at: string
  farm_origin?: { name: string }
  farm_dest?: { name: string }
  warehouse_origin?: { name: string }
  warehouse_dest?: { name: string }
  user?: { full_name: string }
  transfer_items?: Array<{
    quantity: number
    product: { code: string; name: string }
  }>
}

export interface StockAlert {
  id: string
  stock_id: string
  farm_id: string
  warehouse_id: string
  current_val: number
  min_val: number
  is_resolved: boolean
  notified_at?: string
  created_at: string
}

export interface UserFarmAccess {
  id: string
  user_id: string
  farm_id: string
  role: 'propietario' | 'admin' | 'supervisor' | 'trabajador'
  is_active: boolean
  created_at: string
}

export interface UserFarmAccessWithFarm extends UserFarmAccess {
  farm_name: string
}

export interface InvitationToken {
  id: string
  user_id: string
  token: string
  farm_id?: string
  role?: string
  expires_at: string
  used_at?: string
  created_at: string
}

export interface AuditEntry {
  id: string
  timestamp: string
  user_id: string
  user_email: string
  user_role: 'propietario' | 'admin' | 'supervisor' | 'trabajador'
  farm_id?: string
  farm_name?: string
  action: string
  entity: string
  entity_id?: string
  summary: string
  metadata?: Record<string, unknown>
}

export interface DashboardData {
  farms_count: number
  warehouses_count: number
  products_count: number
  total_stock_value: number
  low_stock_alerts: number
  pending_transfers: number
  recent_movements: Movement[]
}

export interface DashboardKPIs {
  farms_count: number
  warehouses_count: number
  products_count: number
  total_stock_value: number
  low_stock_alerts: number
  pending_transfers: number
  recent_movements: Movement[]
}

export interface InventoryFilters {
  farm_id?: string
  warehouse_id?: string
  category_id?: string
  product_id?: string
  product_code?: string
  low_stock_only?: boolean
  user_id: string
}

export interface MovementFilters {
  farm_id?: string
  warehouse_id?: string
  type?: string
  from_date?: string
  to_date?: string
  limit?: number
  offset?: number
  user_id: string
}

export interface ReportFilters {
  farm_id: string
  warehouse_id?: string
  from_date?: string
  to_date?: string
  user_id: string
}

export interface TransferFilters {
  farm_id?: string
  status?: string
  from_date?: string
  to_date?: string
  limit?: number
  offset?: number
}

export interface InventoryReportRow {
  product_code: string
  product_name: string
  category_name?: string
  warehouse_name: string
  current_stock: number
  reserved_stock: number
  available_stock: number
  min_stock: number
  unit: string
  last_movement_date?: string
}

export interface MovementsReportRow {
  date: string
  type: string
  subtype?: string
  product_name: string
  warehouse_name: string
  quantity: number
  balance_after: number
  reason: string
  user_name: string
}

// Request types
export interface CreateUserRequest {
  name: string
  email: string
  password_hash: string
  role?: string
}

export interface CreateFarmRequest {
  name: string
  location?: string
  area_ha?: number
}

export interface UpdateFarmRequest {
  name?: string
  location?: string
  area_ha?: number
  is_active?: boolean
}

export interface CreateWarehouseRequest {
  farm_id: string
  name: string
  description?: string
  capacity_max?: number
}

export interface UpdateWarehouseRequest {
  name?: string
  description?: string
  capacity_max?: number
  is_active?: boolean
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parent_id?: string
}

export interface CreateProductRequest {
  farm_id: string
  category_id?: string
  code: string
  name: string
  unit: string
  price_ref?: number
  expiry_date?: string
  notes?: string
  initial_stock?: number
  warehouse_id?: string
  min_stock?: number
}

export interface UpdateProductRequest {
  category_id?: string
  name?: string
  unit?: string
  price_ref?: number
  expiry_date?: string
  notes?: string
  is_active?: boolean
}

export interface RegisterMovementRequest {
  farm_id: string
  warehouse_id: string
  product_id: string
  type: 'entrada' | 'salida' | 'ajuste'
  subtype?: string
  quantity: number
  reason: string
}

export interface InitiateTransferRequest {
  farm_origin_id: string
  warehouse_origin_id: string
  farm_dest_id: string
  warehouse_dest_id: string
  product_id: string
  quantity: number
  reason?: string
}

export interface CreateInvitationRequest {
  email: string
  farm_id: string
  role: 'admin' | 'supervisor' | 'trabajador'
}

export interface GrantFarmAccessRequest {
  user_id: string
  farm_id: string
  role: 'admin' | 'supervisor' | 'trabajador'
}
