export class ClienteModel {
  constructor(db) {
    this.db = db
  }
  getClienteByName(name) {
    try {
      const stmt = this.db.prepare(
        `SELECT e.id_empresa,e.razon_social,e.numero_ruc FROM cliente c
      JOIN empresa e ON  c.id_empresa=e.id_empresa
      WHERE e.razon_social=?`
      )
      return stmt.get(name)
    } catch (error) {
      throw new Error(`Error al obtener el nombre del cliente: ${error.message}`)
    }
  }
  createCliente({ id }) {
    try {
      const stmt = this.db.prepare('INSERT INTO cliente(id_empresa) VALUES(?)')
      const cliente = stmt.run(id)
      return {
        id: cliente.lastInsertRowId
      }
    } catch (error) {
      throw new Error(`Error al crear el cliente: ${error.message}`)
    }
  }
}
