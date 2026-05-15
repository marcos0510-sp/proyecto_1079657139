import { z } from 'zod'

// User schemas
export const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password_hash: z.string(),
  role: z.enum(['propietario', 'admin', 'supervisor', 'trabajador']).optional()
})

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

export const RegisterSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8)
})

export const ActivateUserSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
})

export const ChangePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z.string().min(8)
})

// Farm schemas
export const CreateFarmSchema = z.object({
  name: z.string().min(1).max(150),
  location: z.string().max(300).optional(),
  area_ha: z.number().positive().optional()
})

export const UpdateFarmSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  location: z.string().max(300).optional(),
  area_ha: z.number().positive().optional(),
  is_active: z.boolean().optional()
})

// Warehouse schemas
export const CreateWarehouseSchema = z.object({
  farm_id: z.string().uuid(),
  name: z.string().min(1).max(150),
  description: z.string().optional(),
  capacity_max: z.number().positive().optional()
})

export const UpdateWarehouseSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().optional(),
  capacity_max: z.number().positive().optional(),
  is_active: z.boolean().optional()
})

// Category schemas
export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  parent_id: z.string().uuid().optional()
})

// Product schemas
export const CreateProductSchema = z.object({
  farm_id: z.string().uuid(),
  category_id: z.string().uuid().optional(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  unit: z.string().min(1).max(30),
  price_ref: z.number().positive().optional(),
  expiry_date: z.string().optional(),
  notes: z.string().optional(),
  initial_stock: z.number().min(0).optional(),
  warehouse_id: z.string().uuid().optional(),
  min_stock: z.number().min(0).optional()
})

export const UpdateProductSchema = z.object({
  category_id: z.string().uuid().optional(),
  name: z.string().min(1).max(200).optional(),
  unit: z.string().min(1).max(30).optional(),
  price_ref: z.number().positive().optional(),
  expiry_date: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().optional()
})

// Movement schemas
export const RegisterMovementSchema = z.object({
  farm_id: z.string().uuid(),
  warehouse_id: z.string().uuid(),
  product_id: z.string().uuid(),
  type: z.enum(['entrada', 'salida', 'ajuste']),
  subtype: z.string().optional(),
  quantity: z.number().positive(),
  reason: z.string().min(1)
})

// Transfer schemas
export const InitiateTransferSchema = z.object({
  farm_origin_id: z.string().uuid(),
  warehouse_origin_id: z.string().uuid(),
  farm_dest_id: z.string().uuid(),
  warehouse_dest_id: z.string().uuid(),
  product_id: z.string().uuid(),
  quantity: z.number().positive(),
  reason: z.string().optional()
})

// Invitation schemas
export const CreateInvitationSchema = z.object({
  email: z.string().email(),
  farm_id: z.string().uuid(),
  role: z.enum(['admin', 'supervisor', 'trabajador'])
})

// Filters
export const InventoryFiltersSchema = z.object({
  farm_id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  product_id: z.string().uuid().optional()
})

export const MovementFiltersSchema = z.object({
  farm_id: z.string().uuid().optional(),
  warehouse_id: z.string().uuid().optional(),
  type: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional()
})

export const ReportFiltersSchema = z.object({
  farm_id: z.string().uuid(),
  warehouse_id: z.string().uuid().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional()
})

export const TransferFiltersSchema = z.object({
  farm_id: z.string().uuid().optional(),
  status: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional()
})