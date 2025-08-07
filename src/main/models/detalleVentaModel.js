export class DetalleVenta {
  constructor(db) {
    this.db = db
  }
  createDetalleVenta({ id_venta, id_producto, unidades }) {
    try {
      console.log('Creando detalle con:', { id_venta, id_producto, unidades }) // Debug
      
      const stmt = this.db.prepare(`
      INSERT INTO detalle_venta(id_venta,id_producto,unidades)
      VALUES(?,?,?) `)
      const result = stmt.run(id_venta, id_producto, unidades)
      
      console.log('Detalle insertado, result:', result) // Debug
      
      return {
        id_detalle_venta: result.lastInsertRowid, // Corregir nombre de propiedad
        id_venta,
        id_producto,
        unidades
      }
    } catch (error) {
      console.error('Error al crear detalle:', error) // Debug
      throw new Error(`Error al registrar el detalle de venta: ${error.message}`)
    }
  }
}
