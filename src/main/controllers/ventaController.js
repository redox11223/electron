import { DetalleVenta } from '../models/detalleVentaModel'
import { VentaModel } from '../models/ventaModel'

export class VentaController {
  constructor(db) {
    this.ventaModel = new VentaModel(db)
    this.detalleVentaModel = new DetalleVenta(db)
    this.db = db
  }
  register(ipcMain) {
    ipcMain.handle('register-venta-detalle', (event, data) => {
      try {
        const result = this.registerVentaDetalle(data)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al registrar la venta', error)
        return { success: false, error: error.message }
      }
    })
  }
  registerVentaDetalle(data) {
    const transaction = this.db.transaction((data) => {
      const venta = this.ventaModel.createVenta(data)
      const detalle = data.productos.map((prod) => {
        return this.detalleVentaModel.createDetalleVenta({
          id_venta: venta.id_venta,
          id_producto: prod.id_producto,
          unidades: prod.unidades
        })
      })

      return { venta, detalle }
    })
    try {
      return transaction(data)
    } catch (error) {
      throw new Error(`Error al hacer la transaccion de la venta: ${error.message}`)
    }
  }
}
