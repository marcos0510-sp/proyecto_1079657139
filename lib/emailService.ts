import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!

export async function sendInvitation(to: string, token: string, farmName: string, role: string): Promise<void> {
  const activationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/activate?token=${token}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Invitación a AgroStock Pro - ${farmName}`,
    html: `
      <h1>¡Bienvenido a AgroStock Pro!</h1>
      <p>Has sido invitado a unirte a la finca <strong>${farmName}</strong> como <strong>${role}</strong>.</p>
      <p>Haz clic en el siguiente enlace para activar tu cuenta:</p>
      <a href="${activationUrl}">Activar cuenta</a>
      <p>Este enlace expira en 24 horas.</p>
    `
  })
}

export async function sendStockAlert(responsable: string, admin: string, data: any): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: [responsable, admin],
    subject: 'Alerta de stock bajo - AgroStock Pro',
    html: `
      <h1>Alerta de Stock Bajo</h1>
      <p>El producto <strong>${data.productName}</strong> en <strong>${data.warehouseName}</strong> tiene stock bajo.</p>
      <p>Stock actual: ${data.currentStock} ${data.unit}</p>
      <p>Stock mínimo: ${data.minStock} ${data.unit}</p>
    `
  })
}

export async function sendTransferNotification(adminEmail: string, data: any): Promise<void> {
  const approveUrl = `${process.env.NEXT_PUBLIC_APP_URL}/farms/${data.farmDestId}/transfers`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: adminEmail,
    subject: 'Nueva transferencia pendiente de aprobación - AgroStock Pro',
    html: `
      <h1>Transferencia Pendiente</h1>
      <p>Se ha solicitado una transferencia de <strong>${data.quantity} ${data.unit}</strong> del producto <strong>${data.productName}</strong>.</p>
      <p>De: ${data.warehouseOriginName} (${data.farmOriginName})</p>
      <p>A: ${data.warehouseDestName} (${data.farmDestName})</p>
      <p><a href="${approveUrl}">Revisar y aprobar</a></p>
    `
  })
}

export async function sendTransferResolution(initiatorEmail: string, data: any): Promise<void> {
  const statusText = data.status === 'aprobada' ? 'aprobada' : 'rechazada'

  await resend.emails.send({
    from: FROM_EMAIL,
    to: initiatorEmail,
    subject: `Transferencia ${statusText} - AgroStock Pro`,
    html: `
      <h1>Transferencia ${statusText}</h1>
      <p>Tu solicitud de transferencia de <strong>${data.quantity} ${data.unit}</strong> del producto <strong>${data.productName}</strong> ha sido ${statusText}.</p>
      ${data.rejectionReason ? `<p>Motivo: ${data.rejectionReason}</p>` : ''}
    `
  })
}