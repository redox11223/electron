export class ClienteModel {
  constructor(db) {
    this.db = db
  }

  // Obtener todos los clientes con información de empresa
  getAllClientes() {
    try {
      const stmt = this.db.prepare(
        `SELECT c.id_cliente, e.id_empresa, e.razon_social, e.numero_ruc, 
                e.direccion, e.email, e.estado, e.celular
         FROM clientes c
         JOIN empresa e ON c.id_empresa = e.id_empresa
         ORDER BY e.razon_social ASC`
      )
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al obtener clientes: ${error.message}`)
    }
  }

  // Obtener cliente por ID
  getClienteById(id) {
    try {
      const stmt = this.db.prepare(
        `SELECT c.id_cliente, e.id_empresa, e.razon_social, e.numero_ruc, 
                e.direccion, e.email, e.estado, e.celular
         FROM clientes c
         JOIN empresa e ON c.id_empresa = e.id_empresa
         WHERE c.id_cliente = ?`
      )
      return stmt.get(id)
    } catch (error) {
      throw new Error(`Error al obtener cliente: ${error.message}`)
    }
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
        `SELECT c.id_cliente, e.id_empresa, e.razon_social, e.numero_ruc, 
                e.direccion, e.email, e.estado, e.celular 
         FROM clientes c
         JOIN empresa e ON c.id_empresa = e.id_empresa
         WHERE e.razon_social LIKE ? OR e.numero_ruc LIKE ? OR e.email LIKE ?
         ORDER BY e.razon_social ASC`
      )
      const searchPattern = `%${searchTerm}%`
      return stmt.all(searchPattern, searchPattern, searchPattern)
    } catch (error) {
      throw new Error(`Error al buscar clientes: ${error.message}`)
    }
  }

  // Método simple para crear cliente (usado por ClienteEmpresaController)
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

  // Crear nuevo cliente con empresa (método completo)
  createClienteCompleto(empresaData) {
    try {
      // Verificar que los datos requeridos estén presentes
      if (!empresaData.razon_social || !empresaData.numero_ruc || !empresaData.email || !empresaData.celular) {
        throw new Error('Faltan datos obligatorios: razon_social, numero_ruc, email, celular')
      }

      const transaction = this.db.transaction(() => {
        // Crear empresa
        const stmtEmpresa = this.db.prepare(
          `INSERT INTO empresa (razon_social, numero_ruc, direccion, email, celular, estado)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        const empresaResult = stmtEmpresa.run(
          empresaData.razon_social,
          empresaData.numero_ruc,
          empresaData.direccion || '',
          empresaData.email,
          empresaData.celular,
          empresaData.estado || 'Activa'
        )

        console.log('Empresa creada con ID:', empresaResult.lastInsertRowId)

        // Verificar que se creó la empresa
        if (!empresaResult.lastInsertRowId) {
          throw new Error('No se pudo crear la empresa')
        }

        // Crear cliente
        const stmtCliente = this.db.prepare('INSERT INTO clientes (id_empresa) VALUES (?)')
        const clienteResult = stmtCliente.run(empresaResult.lastInsertRowId)

        console.log('Cliente creado con ID:', clienteResult.lastInsertRowId)

        return {
          id_cliente: clienteResult.lastInsertRowId,
          id_empresa: empresaResult.lastInsertRowId
        }
      })

      return transaction()
    } catch (error) {
      console.error('Error completo en createClienteCompleto:', error)
      throw new Error(`Error al crear cliente: ${error.message}`)
    }
  }

  // Actualizar cliente (empresa)
  updateCliente(id_cliente, empresaData) {
    try {
      // Obtener id_empresa del cliente
      const getEmpresaStmt = this.db.prepare(
        'SELECT id_empresa FROM clientes WHERE id_cliente = ?'
      )
      const cliente = getEmpresaStmt.get(id_cliente)

      if (!cliente) {
        throw new Error('Cliente no encontrado')
      }

      // Actualizar empresa
      const stmt = this.db.prepare(
        `UPDATE empresa 
         SET razon_social = ?, numero_ruc = ?, direccion = ?, 
             email = ?, celular = ?, estado = ?
         WHERE id_empresa = ?`
      )

      const result = stmt.run(
        empresaData.razon_social,
        empresaData.numero_ruc,
        empresaData.direccion,
        empresaData.email,
        empresaData.celular,
        empresaData.estado,
        cliente.id_empresa
      )

      if (result.changes === 0) {
        throw new Error('No se pudo actualizar el cliente')
      }

      return { success: true, changes: result.changes }
    } catch (error) {
      throw new Error(`Error al actualizar cliente: ${error.message}`)
    }
  }

  // Desactivar cliente
  deactivateCliente(id_cliente) {
    try {
      // Obtener id_empresa del cliente
      const getEmpresaStmt = this.db.prepare(
        'SELECT id_empresa FROM clientes WHERE id_cliente = ?'
      )
      const cliente = getEmpresaStmt.get(id_cliente)

      if (!cliente) {
        throw new Error('Cliente no encontrado')
      }

      // Cambiar estado a Inactiva
      const stmt = this.db.prepare(
        'UPDATE empresa SET estado = ? WHERE id_empresa = ?'
      )

      const result = stmt.run('Inactiva', cliente.id_empresa)

      if (result.changes === 0) {
        throw new Error('No se pudo desactivar el cliente')
      }

      return { success: true, changes: result.changes }
    } catch (error) {
      throw new Error(`Error al desactivar cliente: ${error.message}`)
    }
  }

  
}
