export class DetalleVenta {
  constructor(db) {
    this.db = db
  }
  createDetalleVenta({ id_venta, id_producto, unidades }) {
    try {
      const stmt = this.db.prepare(`
      INSERT INTO detalle_venta(id_venta,id_producto,unidades)
      VALUES(?,?,?) `)
      const result = stmt.run(id_venta, id_producto, unidades)
      return result
    } catch (error) {
      throw new Error(`Error al registrar el detalle de venta: ${error.message}`)
    }
  }
}
