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
      console.log('VentaModel - Creando venta con parámetros:', { id_cliente, fecha, total, estado, id_usuario }) // Debug
      
      // Verificar que el cliente existe
      const clienteExists = this.db.prepare('SELECT id_cliente FROM clientes WHERE id_cliente = ?').get(id_cliente)
      if (!clienteExists) {
        throw new Error(`Cliente con id ${id_cliente} no existe`)
      }
      
      // Como id_usuario puede ser NULL según el schema, simplemente omitimos el campo si no se proporciona
      const sql = `INSERT INTO venta(id_cliente, fecha, total, estado) VALUES(?, ?, ?, ?)`
      const params = [id_cliente, fecha, total, estado]
      
      console.log('VentaModel - SQL:', sql) // Debug
      console.log('VentaModel - Parámetros:', params) // Debug
      
      const stmt = this.db.prepare(sql)
      const result = stmt.run(...params)
      
      console.log('VentaModel - Resultado de inserción:', result) // Debug
      console.log('VentaModel - lastInsertRowid (correcto):', result.lastInsertRowid) // Debug
      
      if (!result.lastInsertRowid || result.lastInsertRowid === 0) {
        throw new Error('No se generó ID para la venta')
      }
      
      return {
        id_venta: result.lastInsertRowid // Usar lastInsertRowid (sin I mayúscula)
      }
    } catch (error) {
      console.error('VentaModel - Error al crear venta:', error) // Debug
      throw new Error(`Error al registrar la venta: ${error.message}`)
    }
  }
}
