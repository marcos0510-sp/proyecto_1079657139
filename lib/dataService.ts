import fs from 'fs'
import path from 'path'
import { supabase } from './supabase'
import { readSeedData, readConfig } from './seedReader'
import { recordAuditEntry } from './blobAudit'
import { sendTransferNotification } from './emailService'
import type {
  SystemMode, User, SafeUser, Farm, Warehouse, Category, Product, Stock, StockItem,
  Movement, Transfer, StockAlert, UserFarmAccess, AuditEntry, DashboardData, DashboardKPIs,
  InventoryFilters, MovementFilters, ReportFilters, TransferFilters, InventoryReportRow, MovementsReportRow,
  CreateUserRequest, CreateFarmRequest, UpdateFarmRequest, CreateWarehouseRequest,
  UpdateWarehouseRequest, CreateCategoryRequest, CreateProductRequest, UpdateProductRequest,
  RegisterMovementRequest, InitiateTransferRequest, CreateInvitationRequest, GrantFarmAccessRequest
} from './types'

export function readJsonFile<T>(filename: string): T {
  const filePath = path.join(process.cwd(), 'data', filename)
  const raw = fs.readFileSync(filePath, 'utf8')
  return JSON.parse(raw) as T
}

function writeSeedData(data: any): void {
  const filePath = path.join(process.cwd(), 'data', 'seed.json')
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

function normalizeSeedUser(user: any): User {
  return {
    id: user.id || `seed-user-${Buffer.from(user.email).toString('hex')}`,
    name: user.name,
    email: user.email,
    password_hash: user.password_hash,
    is_active: user.is_active ?? false,
    login_attempts: user.login_attempts ?? 0,
    locked_until: user.locked_until ?? undefined,
    must_change_password: user.must_change_password ?? false,
    last_login_at: user.last_login_at ?? undefined,
    created_at: user.created_at ?? new Date().toISOString()
  }
}

// System functions
export async function getSystemMode(): Promise<SystemMode> {
  try {
    const { data } = await supabase.from('_migrations').select('id').limit(1)
    return data && data.length > 0 ? 'live' : 'seed'
  } catch {
    return 'seed'
  }
}

// Auth and users
export async function getUserByEmail(email: string): Promise<User | null> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const user = seed.users.find((u: any) => u.email === email)
    return user ? normalizeSeedUser(user) : null
  }

  const { data } = await supabase.from('users').select('*').eq('email', email).single()
  return data
}

export async function getUserById(id: string): Promise<User | null> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const user = seed.users.find((u: any) => u.id === id)
    return user ? normalizeSeedUser(user) : null
  }

  const { data } = await supabase.from('users').select('*').eq('id', id).single()
  return data
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const existing = seed.users.find((u: any) => u.email === data.email)
    if (existing) {
      throw new Error('User already exists')
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      is_active: true,
      login_attempts: 0,
      locked_until: null,
      must_change_password: false,
      last_login_at: null,
      created_at: new Date().toISOString()
    }

    seed.users.push(newUser)
    writeSeedData(seed)
    return normalizeSeedUser(newUser)
  }

  const { data: user, error } = await supabase.from('users').insert(data).select().single()
  if (error) throw error
  return user
}

export async function activateUser(token: string, passwordHash: string): Promise<User> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot activate users in seed mode')
  }

  // Find token
  const { data: tokenData } = await supabase
    .from('invitation_tokens')
    .select('*')
    .eq('token', token)
    .eq('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!tokenData) throw new Error('Invalid or expired token')

  // Update user
  const { data: user } = await supabase
    .from('users')
    .update({ password_hash: passwordHash, is_active: true })
    .eq('id', tokenData.user_id)
    .select()
    .single()

  // Mark token as used
  await supabase
    .from('invitation_tokens')
    .update({ used_at: new Date().toISOString() })
    .eq('id', tokenData.id)

  return user
}

export async function getUserFarmAccess(userId: string): Promise<UserFarmAccess[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const accesses = seed.user_farm_access || []
    return accesses
      .filter((a: any) => a.user_id === userId && a.is_active !== false)
      .map((a: any) => ({
        id: a.id,
        user_id: a.user_id,
        farm_id: a.farm_id,
        role: a.role,
        is_active: a.is_active ?? true,
        created_at: a.created_at ?? new Date().toISOString()
      }))
  }

  const { data } = await supabase
    .from('user_farm_access')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
  return data || []
}

export async function getUserFarmAccessWithFarm(userId: string): Promise<Array<UserFarmAccess & { farm_name: string }>> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const accesses = seed.user_farm_access || []
    const farms = seed.farms || []

    return accesses
      .filter((a: any) => a.user_id === userId && a.is_active !== false)
      .map((a: any) => {
        const farm = farms.find((f: any) => f.id === a.farm_id)
        return {
          id: a.id,
          user_id: a.user_id,
          farm_id: a.farm_id,
          farm_name: farm?.name || 'Finca',
          role: a.role,
          is_active: a.is_active ?? true,
          created_at: a.created_at ?? new Date().toISOString()
        }
      })
  }

  const { data } = await supabase
    .from('user_farm_access')
    .select('*, farms(name)')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (!data) return []

  return data.map((access: any) => ({
    ...access,
    farm_name: access.farms?.name || 'Finca'
  }))
}

export async function grantFarmAccess(data: GrantFarmAccessRequest): Promise<void> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot grant access in seed mode')
  }

  const { error } = await supabase.from('user_farm_access').insert(data)
  if (error) throw error
}

export async function revokeUserFarmAccess(userId: string, farmId: string): Promise<void> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot revoke access in seed mode')
  }

  const { error } = await supabase
    .from('user_farm_access')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('farm_id', farmId)
  if (error) throw error
}

export async function listUsersInFarm(farmId: string): Promise<SafeUser[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  const { data } = await supabase
    .from('user_farm_access')
    .select(`users!inner(id, name, email, is_active, last_login_at), role`)
    .eq('farm_id', farmId)
    .eq('is_active', true)

  const rows = data as Array<{ users: any }>
  return rows.map(item => ({
    id: item.users.id,
    name: item.users.name,
    email: item.users.email,
    is_active: item.users.is_active,
    last_login_at: item.users.last_login_at
  }))
}

export async function createInvitation(data: CreateInvitationRequest): Promise<string> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot create invitations in seed mode')
  }

  // Create user if not exists
  let { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('email', data.email)
    .single()

  if (!user) {
    const { data: newUser } = await supabase
      .from('users')
      .insert({ name: data.email.split('@')[0], email: data.email })
      .select('id')
      .single()
    user = newUser
  }

  // Create token
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('invitation_tokens')
    .insert({
      user_id: user.id,
      token,
      farm_id: data.farm_id,
      role: data.role,
      expires_at: expiresAt
    })

  if (error) throw error
  return token
}

// Farms
export async function getMyFarms(userId: string): Promise<Farm[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const accessFarmIds = new Set(
      (seed.user_farm_access || [])
        .filter((a: any) => a.user_id === userId && a.is_active !== false)
        .map((a: any) => a.farm_id)
    )

    const farms = seed.farms.filter((f: any) => f.owner_id === userId || accessFarmIds.has(f.id))
    return farms.map((f: any) => ({
      ...f,
      created_at: f.created_at ?? new Date().toISOString()
    }))
  }

  const accesses = await getUserFarmAccess(userId)
  if (accesses.length === 0) {
    return []
  }

  const farmIds = accesses.map(a => a.farm_id)
  const { data } = await supabase
    .from('farms')
    .select('*')
    .in('id', farmIds)
    .eq('is_active', true)
  return data || []
}

export async function getFarmById(id: string, userId: string): Promise<Farm | null> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    const farm = seed.farms.find((f: any) => f.id === id)
    if (!farm) return null

    const hasAccess =
      farm.owner_id === userId ||
      (seed.user_farm_access || []).some(
        (a: any) => a.farm_id === id && a.user_id === userId && a.is_active !== false
      )

    if (!hasAccess) return null

    return {
      ...farm,
      created_at: farm.created_at ?? new Date().toISOString()
    }
  }

  const accesses = await getUserFarmAccess(userId)
  if (!accesses.some(a => a.farm_id === id)) {
    return null
  }

  const { data } = await supabase
    .from('farms')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function createFarm(userId: string, data: CreateFarmRequest): Promise<Farm> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot create farms in seed mode')
  }

  const { data: farm, error } = await supabase
    .from('farms')
    .insert({ ...data, owner_id: userId })
    .select()
    .single()
  if (error) throw error
  return farm
}

export async function updateFarm(id: string, userId: string, data: UpdateFarmRequest): Promise<Farm> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot update farms in seed mode')
  }

  const { data: farm, error } = await supabase
    .from('farms')
    .update(data)
    .eq('id', id)
    .eq('owner_id', userId)
    .select()
    .single()
  if (error) throw error
  return farm
}

export async function archiveFarm(id: string, userId: string): Promise<Farm> {
  return updateFarm(id, userId, { is_active: false })
}

// Warehouses
export async function getWarehouses(farmId: string, userId: string): Promise<Warehouse[]> {
  // Assume access checked by caller
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    return seed.warehouses.map((w: any) => ({
      ...w,
      id: 'seed-warehouse-id',
      farm_id: farmId,
      is_active: true,
      created_at: new Date().toISOString()
    }))
  }

  const { data } = await supabase
    .from('warehouses')
    .select('*')
    .eq('farm_id', farmId)
    .eq('is_active', true)
  return data || []
}

export async function getWarehouseById(id: string, userId: string): Promise<Warehouse | null> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return null
  }

  const { data } = await supabase
    .from('warehouses')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function createWarehouse(userId: string, data: CreateWarehouseRequest): Promise<Warehouse> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot create warehouses in seed mode')
  }

  const { data: warehouse, error } = await supabase
    .from('warehouses')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return warehouse
}

export async function updateWarehouse(id: string, userId: string, data: UpdateWarehouseRequest): Promise<Warehouse> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot update warehouses in seed mode')
  }

  const { data: warehouse, error } = await supabase
    .from('warehouses')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return warehouse
}

export async function deactivateWarehouse(id: string, userId: string): Promise<Warehouse> {
  return updateWarehouse(id, userId, { is_active: false })
}

// Categories
export async function getCategories(farmId: string): Promise<Category[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    const seed = readSeedData()
    return seed.categories.map((c: any, i: number) => ({
      ...c,
      id: `seed-category-${i}`,
      farm_id: farmId,
      is_active: true
    }))
  }

  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('farm_id', farmId)
    .eq('is_active', true)
  return data || []
}

export async function createCategory(farmId: string, userId: string, data: CreateCategoryRequest): Promise<Category> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot create categories in seed mode')
  }

  const { data: category, error } = await supabase
    .from('categories')
    .insert({ ...data, farm_id: farmId })
    .select()
    .single()
  if (error) throw error
  return category
}

// Products and Stock
export async function getInventory(filters: InventoryFilters): Promise<StockItem[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  let query = supabase
    .from('stock')
    .select(`
      *,
      products!inner(code, name, unit, category_id, price_ref),
      categories(name),
      warehouses!inner(name),
      movements(created_at)
    `)
    .eq('products.farm_id', filters.farm_id)

  if (filters.warehouse_id) {
    query = query.eq('warehouse_id', filters.warehouse_id)
  }
  if (filters.category_id) {
    query = query.eq('products.category_id', filters.category_id)
  }
  if (filters.product_id) {
    query = query.eq('product_id', filters.product_id)
  }
  if (filters.product_code) {
    query = query.ilike('products.code', `%${filters.product_code}%`)
  }
  if (filters.low_stock_only) {
    query = query.filter('current_stock', 'lte', 'min_stock')
  }

  const { data } = await query
  return data?.map(item => ({
    product_id: item.product_id,
    product_code: item.products.code,
    product_name: item.products.name,
    category_name: item.categories?.name,
    warehouse_id: item.warehouse_id,
    warehouse_name: item.warehouses.name,
    current_stock: item.current_stock,
    reserved_stock: item.reserved_stock,
    min_stock: item.min_stock,
    unit: item.products.unit,
    price_ref: item.products.price_ref,
    last_movement: item.movements?.[0]?.created_at
  })) || []
}

export async function getProductById(id: string, userId: string): Promise<Product | null> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return null
  }

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export async function getProducts(farmId: string): Promise<Product[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('farm_id', farmId)
    .order('name')
  return data || []
}

export async function createProduct(userId: string, data: CreateProductRequest): Promise<Product> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot create products in seed mode')
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert(data)
    .select()
    .single()
  if (error) throw error

  // Create stock if initial_stock provided
  if (data.initial_stock && data.warehouse_id) {
    await supabase
      .from('stock')
      .insert({
        product_id: product.id,
        warehouse_id: data.warehouse_id,
        current_stock: data.initial_stock,
        min_stock: data.min_stock || 0
      })
  }

  return product
}

export async function updateProduct(id: string, userId: string, data: UpdateProductRequest): Promise<Product> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot update products in seed mode')
  }

  const { data: product, error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return product
}

export async function getStockItem(productId: string, warehouseId: string): Promise<Stock | null> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return null
  }

  const { data } = await supabase
    .from('stock')
    .select('*')
    .eq('product_id', productId)
    .eq('warehouse_id', warehouseId)
    .single()
  return data
}

// Movements
export async function registerMovement(userId: string, data: RegisterMovementRequest): Promise<Movement> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot register movements in seed mode')
  }

  // Get current stock
  const currentStock = await getStockItem(data.product_id, data.warehouse_id)
  if (!currentStock) {
    throw new Error('Stock item not found')
  }

  // Calculate new stock level
  let newStock: number
  let balanceAfter: number

  switch (data.type) {
    case 'entrada':
      newStock = currentStock.current_stock + data.quantity
      balanceAfter = newStock
      break
    case 'salida':
      if (currentStock.current_stock < data.quantity) {
        throw new Error(`Insufficient stock. Available: ${currentStock.current_stock}`)
      }
      newStock = currentStock.current_stock - data.quantity
      balanceAfter = newStock
      break
    case 'ajuste':
      newStock = data.quantity
      balanceAfter = newStock
      break
    default:
      throw new Error('Invalid movement type')
  }

  // Update stock
  const { error: stockError } = await supabase
    .from('stock')
    .update({ current_stock: newStock })
    .eq('product_id', data.product_id)
    .eq('warehouse_id', data.warehouse_id)

  if (stockError) throw stockError

  // Create movement record
  const { data: movement, error: movementError } = await supabase
    .from('movements')
    .insert({
      stock_id: currentStock.id,
      farm_id: data.farm_id,
      warehouse_id: data.warehouse_id,
      user_id: userId,
      type: data.type,
      subtype: data.subtype,
      quantity: data.quantity,
      balance_after: balanceAfter,
      reason: data.reason
    })
    .select()
    .single()

  if (movementError) throw movementError

  return movement
}

export async function getMovements(filters: MovementFilters): Promise<Movement[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  let query = supabase
    .from('movements')
    .select(`
      *,
      stock!inner(
        products(code, name),
        warehouses(name)
      ),
      user_profiles!movements_user_id_fkey(full_name)
    `)
    .eq('farm_id', filters.farm_id)

  if (filters.warehouse_id) {
    query = query.eq('warehouse_id', filters.warehouse_id)
  }
  if (filters.type) {
    query = query.eq('type', filters.type)
  }
  if (filters.from_date) {
    query = query.gte('created_at', filters.from_date)
  }
  if (filters.to_date) {
    query = query.lte('created_at', filters.to_date)
  }

  query = query.order('created_at', { ascending: false })

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  const { data } = await query
  return data?.map(item => ({
    ...item,
    product_code: item.stock?.products?.code,
    product_name: item.stock?.products?.name,
    warehouse_name: item.stock?.warehouses?.name,
    user_name: item.user_profiles?.full_name
  })) || []
}

// Transfers
export async function initiateTransfer(userId: string, data: InitiateTransferRequest): Promise<Transfer> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot initiate transfers in seed mode')
  }

  // Check if it's inter-farm or intra-farm
  const isInterFarm = data.farm_origin_id !== data.farm_dest_id

  // Get current stock
  const currentStock = await getStockItem(data.product_id, data.warehouse_origin_id)
  if (!currentStock) {
    throw new Error('Stock item not found in origin warehouse')
  }

  // Check available stock (current - reserved)
  const availableStock = currentStock.current_stock - currentStock.reserved_stock
  if (availableStock < data.quantity) {
    throw new Error(`Insufficient available stock. Available: ${availableStock}`)
  }

  let transferStatus: 'pendiente' | 'aprobada'

  if (isInterFarm) {
    // Inter-farm: reserve stock and set as pending
    transferStatus = 'pendiente'

    // Reserve stock in origin
    const { error: reserveError } = await supabase
      .from('stock')
      .update({ reserved_stock: currentStock.reserved_stock + data.quantity })
      .eq('product_id', data.product_id)
      .eq('warehouse_id', data.warehouse_origin_id)

    if (reserveError) throw reserveError
  } else {
    // Intra-farm: execute immediately
    transferStatus = 'aprobada'

    // Move stock from origin to destination
    const destStock = await getStockItem(data.product_id, data.warehouse_dest_id)

    // Update origin stock
    const { error: originError } = await supabase
      .from('stock')
      .update({ current_stock: currentStock.current_stock - data.quantity })
      .eq('product_id', data.product_id)
      .eq('warehouse_id', data.warehouse_origin_id)

    if (originError) throw originError

    // Update destination stock
    if (destStock) {
      const { error: destError } = await supabase
        .from('stock')
        .update({ current_stock: destStock.current_stock + data.quantity })
        .eq('product_id', data.product_id)
        .eq('warehouse_id', data.warehouse_dest_id)

      if (destError) throw destError
    } else {
      // Create new stock entry in destination
      const { error: createError } = await supabase
        .from('stock')
        .insert({
          product_id: data.product_id,
          warehouse_id: data.warehouse_dest_id,
          current_stock: data.quantity,
          reserved_stock: 0
        })

      if (createError) throw createError
    }
  }

  // Create transfer record
  const { data: transfer, error: transferError } = await supabase
    .from('transfers')
    .insert({
      farm_origin_id: data.farm_origin_id,
      warehouse_origin_id: data.warehouse_origin_id,
      farm_dest_id: data.farm_dest_id,
      warehouse_dest_id: data.warehouse_dest_id,
      user_id: userId,
      product_id: data.product_id,
      quantity: data.quantity,
      status: transferStatus,
      reason: data.reason,
      is_intrafarm: !isInterFarm
    })
    .select()
    .single()

  if (transferError) throw transferError

  // Create movement record for origin
  const { error: movementError } = await supabase
    .from('movements')
    .insert({
      stock_id: currentStock.id,
      farm_id: data.farm_origin_id,
      warehouse_id: data.warehouse_origin_id,
      user_id: userId,
      type: isInterFarm ? 'transferencia_salida' : 'transferencia_salida',
      quantity: data.quantity,
      balance_after: currentStock.current_stock - (isInterFarm ? 0 : data.quantity), // For inter-farm, stock not yet moved
      reason: data.reason || 'Transferencia de salida',
      transfer_id: transfer.id
    })

  if (movementError) throw movementError

  // For intra-farm transfers, also create entry movement
  if (!isInterFarm) {
    const destStock = await getStockItem(data.product_id, data.warehouse_dest_id)
    if (destStock) {
      const { error: entryMovementError } = await supabase
        .from('movements')
        .insert({
          stock_id: destStock.id,
          farm_id: data.farm_dest_id,
          warehouse_id: data.warehouse_dest_id,
          user_id: userId,
          type: 'transferencia_entrada',
          quantity: data.quantity,
          balance_after: destStock.current_stock + data.quantity,
          reason: data.reason || 'Transferencia de entrada',
          transfer_id: transfer.id
        })

      if (entryMovementError) throw entryMovementError
    }
  }

  // For inter-farm transfers, send notification email
  if (isInterFarm) {
    const { data: adminAccess } = await supabase
      .from('user_farm_access')
      .select('users!inner(email)')
      .in('role', ['admin', 'propietario'])
      .eq('farm_id', data.farm_dest_id)
      .eq('is_active', true)

    const adminEmails = (adminAccess || [])
      .map((item: any) => item.users?.email)
      .filter(Boolean)

    if (adminEmails.length > 0) {
      const { data: product } = await supabase
        .from('products')
        .select('name, code, unit')
        .eq('id', data.product_id)
        .single()

      const { data: warehouseOrigin } = await supabase
        .from('warehouses')
        .select('name')
        .eq('id', data.warehouse_origin_id)
        .single()

      const { data: warehouseDest } = await supabase
        .from('warehouses')
        .select('name')
        .eq('id', data.warehouse_dest_id)
        .single()

      const { data: farmOrigin } = await supabase
        .from('farms')
        .select('name')
        .eq('id', data.farm_origin_id)
        .single()

      const { data: farmDest } = await supabase
        .from('farms')
        .select('name')
        .eq('id', data.farm_dest_id)
        .single()

      const transferData = {
        quantity: data.quantity,
        unit: product?.unit || 'unidades',
        productName: product?.name || product?.code || 'producto',
        warehouseOriginName: warehouseOrigin?.name || 'origen',
        warehouseDestName: warehouseDest?.name || 'destino',
        farmOriginName: farmOrigin?.name || 'finca origen',
        farmDestName: farmDest?.name || 'finca destino',
        farmDestId: data.farm_dest_id
      }

      await Promise.all(
        adminEmails.map((email: string) => sendTransferNotification(email, transferData))
      )
    }
  }

  return transfer
}

export async function approveTransfer(id: string, userId: string): Promise<Transfer> {
  const { approveTransfer: approveTransferService } = await import('./transferService')
  return approveTransferService(id, userId)
}

export async function rejectTransfer(id: string, userId: string, reason: string): Promise<Transfer> {
  const { rejectTransfer: rejectTransferService } = await import('./transferService')
  return rejectTransferService(id, userId, reason)
}

export async function getPendingTransfers(farmId: string, userId: string): Promise<Transfer[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  const { data } = await supabase
    .from('transfers')
    .select(`
      *,
      farm_origin:farms!transfers_farm_origin_id_fkey(id, name),
      farm_dest:farms!transfers_farm_dest_id_fkey(id, name),
      warehouse_origin:warehouses!transfers_warehouse_origin_id_fkey(id, name),
      warehouse_dest:warehouses!transfers_warehouse_dest_id_fkey(id, name),
      product:products!transfers_product_id_fkey(code, name),
      user:user_profiles!transfers_user_id_fkey(full_name)
    `)
    .eq('farm_dest_id', farmId)
    .eq('status', 'pendiente')
  return data || []
}

export async function getTransfers(filters: TransferFilters): Promise<Transfer[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  let query = supabase
    .from('transfers')
    .select(`
      *,
      farm_origin:farms!transfers_farm_origin_id_fkey(name),
      farm_dest:farms!transfers_farm_dest_id_fkey(name),
      warehouse_origin:warehouses!transfers_warehouse_origin_id_fkey(name),
      warehouse_dest:warehouses!transfers_warehouse_dest_id_fkey(name),
      user:user_profiles!transfers_user_id_fkey(full_name),
      product:products!transfers_product_id_fkey(code, name),
      transfer_items(
        *,
        product:products(code, name)
      )
    `)

  if (filters.farm_id) {
    query = query.or(`farm_origin_id.eq.${filters.farm_id},farm_dest_id.eq.${filters.farm_id}`)
  }

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.from_date) {
    query = query.gte('created_at', filters.from_date)
  }

  if (filters.to_date) {
    query = query.lte('created_at', filters.to_date)
  }

  query = query.order('created_at', { ascending: false })

  if (filters.limit) {
    query = query.limit(filters.limit)
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  const { data } = await query
  return data || []
}

// Dashboard
export async function getDashboardKPIs(farmIds: string[]): Promise<DashboardKPIs> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return {
      farms_count: 1,
      warehouses_count: 1,
      products_count: 8, // From seed data categories
      total_stock_value: 0,
      low_stock_alerts: 0,
      pending_transfers: 0,
      recent_movements: []
    }
  }

  // Get counts for the specified farms
  const [farmsResult, warehousesResult, productsResult, stockResult, transfersResult, movementsResult] = await Promise.all([
    supabase.from('farms').select('id', { count: 'exact' }).in('id', farmIds),
    supabase.from('warehouses').select('id', { count: 'exact' }).in('farm_id', farmIds),
    supabase.from('products').select('id', { count: 'exact' }).in('farm_id', farmIds),
    supabase.from('stock').select('current_stock, min_stock, products!inner(price_ref)').in('farm_id', farmIds),
    supabase.from('transfers').select('id', { count: 'exact' }).in('farm_id', farmIds).eq('status', 'pendiente'),
    supabase.from('movements').select('*').in('farm_id', farmIds).order('created_at', { ascending: false }).limit(5)
  ])

  // Calculate total stock value
  let totalStockValue = 0
  let lowStockAlerts = 0

  if (stockResult.data) {
    for (const stock of stockResult.data) {
      const price = stock.products?.[0]?.price_ref || 0
      totalStockValue += stock.current_stock * price

      if (stock.current_stock <= stock.min_stock) {
        lowStockAlerts++
      }
    }
  }

  return {
    farms_count: farmsResult.count || 0,
    warehouses_count: warehousesResult.count || 0,
    products_count: productsResult.count || 0,
    total_stock_value: totalStockValue,
    low_stock_alerts: lowStockAlerts,
    pending_transfers: transfersResult.count || 0,
    recent_movements: movementsResult.data || []
  }
}

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return {
      farms_count: 1,
      warehouses_count: 1,
      products_count: 0,
      total_stock_value: 0,
      low_stock_alerts: 0,
      pending_transfers: 0,
      recent_movements: []
    }
  }

  // This would require complex queries, simplified for now
  return {
    farms_count: 0,
    warehouses_count: 0,
    products_count: 0,
    total_stock_value: 0,
    low_stock_alerts: 0,
    pending_transfers: 0,
    recent_movements: []
  }
}

// Reports
export async function getInventoryReportData(filters: ReportFilters): Promise<InventoryReportRow[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  // Simplified implementation
  return []
}

export async function getMovementsReportData(filters: ReportFilters): Promise<MovementsReportRow[]> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    return []
  }

  // Simplified implementation
  return []
}

// Audit
export async function recordAudit(entry: AuditEntry): Promise<void> {
  const filename = `${new Date().toISOString().slice(0, 7)}.json` // YYYY-MM.json
  await recordAuditEntry(filename, entry)
}

export async function readAuditMonth(yyyymm: string): Promise<AuditEntry[]> {
  // Implementation for reading audit
  return []
}