export class ProductosSolicitadosModel {
  constructor(db) {
    this.db = db
  }

  // Obtener todos los productos solicitados
  getAllProductosSolicitados() {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          ps.*,
          p.razon_social as proveedor_nombre,
          cp.nombre_categoria
        FROM productos_solicitados ps
        LEFT JOIN proveedores prov ON ps.id_proveedor = prov.id_proveedor
        LEFT JOIN empresa p ON prov.id_empresa = p.id_empresa
        LEFT JOIN categoria_producto cp ON ps.id_categoria = cp.id_categoria
        ORDER BY ps.fecha_solicitud DESC
      `)
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al obtener productos solicitados: ${error.message}`)
    }
  }

  // Crear un nuevo producto solicitado
  createProductoSolicitado(productoData) {
    try {
      const stmt = this.db.prepare(`
        INSERT INTO productos_solicitados (
          nombre_producto, precio_compra, modelo, 
          descripcion, id_proveedor, id_categoria, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      
      const result = stmt.run(
        productoData.nombre_producto,
        productoData.precio_unitario || null,
        productoData.modelo || null,
        productoData.descripcion || null,
        productoData.id_proveedor || null,
        productoData.id_categoria || null,
        productoData.estado || 'PENDIENTE'
      )
      
      return { id: result.lastInsertRowid, ...productoData }
    } catch (error) {
      throw new Error(`Error al crear producto solicitado: ${error.message}`)
    }
  }

  // Obtener producto solicitado por ID
  getProductoSolicitadoById(id) {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          ps.*,
          p.razon_social as proveedor_nombre,
          cp.nombre_categoria
        FROM productos_solicitados ps
        LEFT JOIN proveedores prov ON ps.id_proveedor = prov.id_proveedor
        LEFT JOIN empresa p ON prov.id_empresa = p.id_empresa
        LEFT JOIN categoria_producto cp ON ps.id_categoria = cp.id_categoria
        WHERE ps.id_producto_solicitado = ?
      `)
      return stmt.get(id)
    } catch (error) {
      throw new Error(`Error al obtener producto solicitado: ${error.message}`)
    }
  }

  // Actualizar estado del producto solicitado
  updateEstadoProductoSolicitado(id, estado) {
    try {
      const stmt = this.db.prepare(`
        UPDATE productos_solicitados 
        SET estado = ? 
        WHERE id_producto_solicitado = ?
      `)
      const result = stmt.run(estado, id)
      
      if (result.changes === 0) {
        throw new Error('Producto solicitado no encontrado')
      }
      
      return result
    } catch (error) {
      throw new Error(`Error al actualizar estado: ${error.message}`)
    }
  }

  // Buscar productos solicitados
  searchProductosSolicitados(searchTerm) {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          ps.*,
          p.razon_social as proveedor_nombre,
          cp.nombre_categoria
        FROM productos_solicitados ps
        LEFT JOIN proveedores prov ON ps.id_proveedor = prov.id_proveedor
        LEFT JOIN empresa p ON prov.id_empresa = p.id_empresa
        LEFT JOIN categoria_producto cp ON ps.id_categoria = cp.id_categoria
        WHERE ps.nombre_producto LIKE ? 
        OR ps.modelo LIKE ? 
        OR ps.descripcion LIKE ?
        ORDER BY ps.fecha_solicitud DESC
      `)
      
      const searchPattern = `%${searchTerm}%`
      return stmt.all(searchPattern, searchPattern, searchPattern)
    } catch (error) {
      throw new Error(`Error al buscar productos solicitados: ${error.message}`)
    }
  }
}
