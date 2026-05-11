const { Resend } = require('resend')
require('dotenv').config()

const resend = new Resend(process.env.RESEND_API_KEY)

const enviarEmailNuevoPedido = async (pedido) => {
  try {
    const itemsHTML = pedido.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.nombre}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${Number(item.precio * item.cantidad).toLocaleString()}</td>
      </tr>
    `).join('')

    await resend.emails.send({
      from: 'Marcecos <onboarding@resend.dev>',
      to: 'leandro_buchini@outlook.com',
      subject: `🛒 Nuevo pedido #${pedido.id} - $${Number(pedido.total).toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          
          <div style="background: #1a1a2e; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Marcecos</h1>
            <p style="color: #aaa; margin: 5px 0 0;">Juguetería</p>
          </div>

          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">🎉 Nuevo pedido recibido!</h2>
            <p style="color: #666;">Se realizó un nuevo pedido en Marcecos.</p>

            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Pedido #${pedido.id}</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 8px; text-align: left;">Producto</th>
                    <th style="padding: 8px; text-align: center;">Cantidad</th>
                    <th style="padding: 8px; text-align: right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                </tbody>
              </table>

              <div style="border-top: 2px solid #eee; margin-top: 15px; padding-top: 15px; text-align: right;">
                <strong style="font-size: 18px; color: #2563eb;">Total: $${Number(pedido.total).toLocaleString()}</strong>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #666; font-size: 14px;">Entrá al panel admin para ver y gestionar el pedido</p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 12px;">Marcecos — Juguetería · Envíos a todo el país</p>
            </div>
          </div>

        </div>
      `
    })

    console.log('Email enviado correctamente!')
  } catch (error) {
    console.log('Error al enviar email:', error.message)
  }
}

module.exports = { enviarEmailNuevoPedido }