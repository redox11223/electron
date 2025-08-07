export class ClienteModel {
  constructor(db) {
    this.db = db
  }
  getClienteByName(name) {
    try {
      const stmt = this.db.prepare(
        `SELECT c.id_cliente, e.id_empresa, e.razon_social, e.numero_ruc 
         FROM clientes c
         JOIN empresa e ON c.id_empresa = e.id_empresa
         WHERE e.razon_social = ?`
      )
      return stmt.get(name)
    } catch (error) {
      throw new Error(`Error al obtener el nombre del cliente: ${error.message}`)
    }
  }
  searchClientes(searchTerm) {
    try {
      const stmt = this.db.prepare(
        `SELECT c.id_cliente, e.id_empresa, e.razon_social, e.numero_ruc, e.email, e.celular 
         FROM clientes c
         JOIN empresa e ON c.id_empresa = e.id_empresa
         WHERE e.razon_social LIKE ? OR e.numero_ruc LIKE ?
         LIMIT 5`
      )
      const searchPattern = `%${searchTerm}%`
      return stmt.all(searchPattern, searchPattern)
    } catch (error) {
      throw new Error(`Error al buscar clientes: ${error.message}`)
    }
  }
  createCliente({ id }) {
    try {
      const stmt = this.db.prepare('INSERT INTO clientes(id_empresa) VALUES(?)')
      const cliente = stmt.run(id)
      return {
        id: cliente.lastInsertRowId
      }
    } catch (error) {
      throw new Error(`Error al crear el cliente: ${error.message}`)
    }
  }
}
