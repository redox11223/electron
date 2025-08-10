export class ProveedorModel {
  constructor(db) {
    this.db = db
  }

  // Obtener todos los proveedores con datos de empresa
  getAllProveedores() {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          p.id_proveedor,
          p.id_empresa,
          e.razon_social,
          e.numero_ruc,
          e.direccion,
          e.email,
          e.celular,
          e.estado
        FROM proveedores p
        INNER JOIN empresa e ON p.id_empresa = e.id_empresa
        ORDER BY e.razon_social
      `)
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al obtener proveedores: ${error.message}`)
    }
  }

  // Buscar proveedores por término
  searchProveedores(searchTerm) {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          p.id_proveedor,
          p.id_empresa,
          e.razon_social,
          e.numero_ruc,
          e.direccion,
          e.email,
          e.celular,
          e.estado
        FROM proveedores p
        INNER JOIN empresa e ON p.id_empresa = e.id_empresa
        WHERE e.razon_social LIKE ? 
           OR e.numero_ruc LIKE ? 
           OR e.email LIKE ?
        ORDER BY e.razon_social
      `)
      const term = `%${searchTerm}%`
      return stmt.all(term, term, term)
    } catch (error) {
      throw new Error(`Error al buscar proveedores: ${error.message}`)
    }
  }

  // Crear nuevo proveedor (crea empresa y luego proveedor)
  createProveedor({ razon_social, numero_ruc, direccion, email, celular, estado = 'Activa' }) {
    const transaction = this.db.transaction(() => {
      try {
        // Primero crear la empresa
        const empresaStmt = this.db.prepare(`
          INSERT INTO empresa (razon_social, numero_ruc, direccion, email, celular, estado)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        const empresaResult = empresaStmt.run(razon_social, numero_ruc, direccion, email, celular, estado)
        
        if (!empresaResult.lastInsertRowid) {
          throw new Error('No se pudo crear la empresa')
        }

        // Luego crear el proveedor
        const proveedorStmt = this.db.prepare(`
          INSERT INTO proveedores (id_empresa)
          VALUES (?)
        `)
        const proveedorResult = proveedorStmt.run(empresaResult.lastInsertRowid)

        if (!proveedorResult.lastInsertRowid) {
          throw new Error('No se pudo crear el proveedor')
        }

        return {
          id_proveedor: proveedorResult.lastInsertRowid,
          id_empresa: empresaResult.lastInsertRowid,
          razon_social,
          numero_ruc,
          direccion,
          email,
          celular,
          estado
        }
      } catch (error) {
        throw new Error(`Error al crear proveedor: ${error.message}`)
      }
    })

    return transaction()
  }

  // Actualizar proveedor (actualiza los datos de la empresa)
  updateProveedor(id_empresa, { razon_social, numero_ruc, direccion, email, celular, estado }) {
    try {
      const stmt = this.db.prepare(`
        UPDATE empresa 
        SET razon_social = ?, numero_ruc = ?, direccion = ?, email = ?, celular = ?, estado = ?
        WHERE id_empresa = ?
      `)
      const result = stmt.run(razon_social, numero_ruc, direccion, email, celular, estado, id_empresa)
      
      if (result.changes === 0) {
        throw new Error('No se encontró la empresa para actualizar')
      }

      return { success: true, changes: result.changes }
    } catch (error) {
      throw new Error(`Error al actualizar proveedor: ${error.message}`)
    }
  }

  // Desactivar proveedor
  deactivateProveedor(id_empresa) {
    try {
      const stmt = this.db.prepare(`
        UPDATE empresa 
        SET estado = 'Inactiva'
        WHERE id_empresa = ?
      `)
      const result = stmt.run(id_empresa)
      
      if (result.changes === 0) {
        throw new Error('No se encontró la empresa para desactivar')
      }

      return { success: true, changes: result.changes }
    } catch (error) {
      throw new Error(`Error al desactivar proveedor: ${error.message}`)
    }
  }

  // Obtener proveedor por ID
  getProveedorById(id_proveedor) {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          p.id_proveedor,
          p.id_empresa,
          e.razon_social,
          e.numero_ruc,
          e.direccion,
          e.email,
          e.celular,
          e.estado
        FROM proveedores p
        INNER JOIN empresa e ON p.id_empresa = e.id_empresa
        WHERE p.id_proveedor = ?
      `)
      return stmt.get(id_proveedor)
    } catch (error) {
      throw new Error(`Error al obtener proveedor: ${error.message}`)
    }
  }
}
