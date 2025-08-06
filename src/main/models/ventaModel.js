export class VentaModel {
  constructor(db) {
    this.db = db
  }
  getAllVentas() {
    try {
      const stmt = this.db.prepare('SELECT * FROM venta')
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al conseguir todas las ventas: ${error.message}`)
    }
  }
  createVenta({ id_cliente, fecha, total, estado, id_usuario }) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO venta(id_cliente,fecha,total,estado,id_usuario)
        VALUES(?,?,?,?,?)
        `)
      const result = stmt.run(id_cliente, fecha, total, estado, id_usuario)
      return {
        id_venta: result.lastInsertRowId
      }
    } catch (error) {
      throw new Error(`Error al registrar la venta: ${error.message}`)
    }
  }
}
