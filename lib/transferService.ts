import { supabase } from './supabase'
import { getStockItem, getSystemMode } from './dataService'
import { sendTransferResolution } from './emailService'
import { Transfer } from './types'

/**
 * Approve a pending inter-farm transfer
 * - Register exit movement in origin warehouse
 * - stock.reserved_stock -= quantity in origin warehouse
 * - Register entry movement in destination warehouse
 * - UPDATE transfer status='aprobada'
 */
export async function approveTransfer(id: string, userId: string): Promise<Transfer> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot approve transfers in seed mode')
  }

  // Get transfer details
  const { data: transfer, error: fetchError } = await supabase
    .from('transfers')
    .select(`
      *,
      farm_origin:farms!transfers_farm_origin_id_fkey(id, name),
      farm_dest:farms!transfers_farm_dest_id_fkey(id, name),
      warehouse_origin:warehouses!transfers_warehouse_origin_id_fkey(id, name),
      warehouse_dest:warehouses!transfers_warehouse_dest_id_fkey(id, name),
      product:products!transfers_product_id_fkey(id, code, name, unit)
    `)
    .eq('id', id)
    .single()

  if (fetchError || !transfer) {
    throw new Error('Transfer not found')
  }

  if (transfer.status !== 'pendiente') {
    throw new Error('Transfer is not pending')
  }

  if (transfer.is_intrafarm) {
    throw new Error('Intra-farm transfers should be approved automatically')
  }

  // Verify user has access to destination farm
  const { data: access } = await supabase
    .from('user_farm_access')
    .select('*')
    .eq('user_id', userId)
    .eq('farm_id', transfer.farm_dest_id)
    .eq('is_active', true)
    .single()

  if (!access) {
    throw new Error('Access denied to destination farm')
  }

  // Get origin stock
  const originStock = await getStockItem(transfer.product_id, transfer.warehouse_origin_id)
  if (!originStock) {
    throw new Error('Origin stock not found')
  }

  // Check if reserved stock is still available
  if (originStock.reserved_stock < transfer.quantity) {
    throw new Error('Reserved stock no longer available')
  }

  // Update origin stock: remove from reserved and current
  const { error: originError } = await supabase
    .from('stock')
    .update({
      current_stock: originStock.current_stock - transfer.quantity,
      reserved_stock: originStock.reserved_stock - transfer.quantity
    })
    .eq('product_id', transfer.product_id)
    .eq('warehouse_id', transfer.warehouse_origin_id)

  if (originError) throw originError

  // Update or create destination stock
  const destStock = await getStockItem(transfer.product_id, transfer.warehouse_dest_id)
  if (destStock) {
    const { error: destError } = await supabase
      .from('stock')
      .update({ current_stock: destStock.current_stock + transfer.quantity })
      .eq('product_id', transfer.product_id)
      .eq('warehouse_id', transfer.warehouse_dest_id)

    if (destError) throw destError
  } else {
    // Create new stock entry in destination
    const { error: createError } = await supabase
      .from('stock')
      .insert({
        product_id: transfer.product_id,
        warehouse_id: transfer.warehouse_dest_id,
        current_stock: transfer.quantity,
        reserved_stock: 0
      })

    if (createError) throw createError
  }

  // Create exit movement in origin
  const { error: exitMovementError } = await supabase
    .from('movements')
    .insert({
      stock_id: originStock.id,
      farm_id: transfer.farm_origin_id,
      warehouse_id: transfer.warehouse_origin_id,
      user_id: userId,
      type: 'transferencia_salida',
      quantity: transfer.quantity,
      balance_after: originStock.current_stock - transfer.quantity,
      reason: transfer.reason || 'Transferencia de salida aprobada',
      transfer_id: transfer.id
    })

  if (exitMovementError) throw exitMovementError

  // Create entry movement in destination
  const newDestStock = await getStockItem(transfer.product_id, transfer.warehouse_dest_id)
  if (newDestStock) {
    const { error: entryMovementError } = await supabase
      .from('movements')
      .insert({
        stock_id: newDestStock.id,
        farm_id: transfer.farm_dest_id,
        warehouse_id: transfer.warehouse_dest_id,
        user_id: userId,
        type: 'transferencia_entrada',
        quantity: transfer.quantity,
        balance_after: newDestStock.current_stock,
        reason: transfer.reason || 'Transferencia de entrada aprobada',
        transfer_id: transfer.id
      })

    if (entryMovementError) throw entryMovementError
  }

  // Update transfer status
  const { data: updatedTransfer, error: updateError } = await supabase
    .from('transfers')
    .update({
      status: 'aprobada',
      approver_id: userId,
      approved_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) throw updateError

  const { data: initiator } = await supabase
    .from('users')
    .select('email')
    .eq('id', transfer.user_id)
    .single()

  if (initiator?.email) {
    await sendTransferResolution(initiator.email, {
      status: 'aprobada',
      quantity: transfer.quantity,
      unit: transfer.product?.unit || 'unidades',
      productName: transfer.product?.name || transfer.product_id,
      rejectionReason: null
    })
  }

  return updatedTransfer
}

/**
 * Reject a pending inter-farm transfer
 * - stock.reserved_stock -= quantity in origin warehouse (release reservation)
 * - UPDATE transfer status='rechazada'
 * - Send email to initiator
 */
export async function rejectTransfer(id: string, userId: string, reason: string): Promise<Transfer> {
  const mode = await getSystemMode()
  if (mode === 'seed') {
    throw new Error('Cannot reject transfers in seed mode')
  }

  // Get transfer details
  const { data: transfer, error: fetchError } = await supabase
    .from('transfers')
    .select(`
      *,
      product:products!transfers_product_id_fkey(name, code, unit)
    `)
    .eq('id', id)
    .single()

  if (fetchError || !transfer) {
    throw new Error('Transfer not found')
  }

  if (transfer.status !== 'pendiente') {
    throw new Error('Transfer is not pending')
  }

  if (transfer.is_intrafarm) {
    throw new Error('Intra-farm transfers cannot be rejected')
  }

  // Verify user has access to destination farm
  const { data: access } = await supabase
    .from('user_farm_access')
    .select('*')
    .eq('user_id', userId)
    .eq('farm_id', transfer.farm_dest_id)
    .eq('is_active', true)
    .single()

  if (!access) {
    throw new Error('Access denied to destination farm')
  }

  // Release reserved stock in origin warehouse
  const originStock = await getStockItem(transfer.product_id, transfer.warehouse_origin_id)
  if (!originStock) {
    throw new Error('Origin stock not found')
  }

  const { error: releaseError } = await supabase
    .from('stock')
    .update({ reserved_stock: originStock.reserved_stock - transfer.quantity })
    .eq('product_id', transfer.product_id)
    .eq('warehouse_id', transfer.warehouse_origin_id)

  if (releaseError) throw releaseError

  // Update transfer status
  const { data: updatedTransfer, error: updateError } = await supabase
    .from('transfers')
    .update({
      status: 'rechazada',
      rejection_reason: reason,
      approver_id: userId,
      approved_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) throw updateError

  const { data: initiator } = await supabase
    .from('users')
    .select('email')
    .eq('id', transfer.user_id)
    .single()

  if (initiator?.email) {
    await sendTransferResolution(initiator.email, {
      status: 'rechazada',
      quantity: transfer.quantity,
      unit: transfer.product?.unit || 'unidades',
      productName: transfer.product?.name || transfer.product_id,
      rejectionReason: reason
    })
  }

  return updatedTransfer
}