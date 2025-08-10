export class CompraModel {
  constructor(db) {
    this.db = db
  }

  // Obtener todas las compras
  getAllCompras() {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          c.*,
          e.razon_social as proveedor_nombre,
          p.nombre as usuario_nombre,
          p.apellido as usuario_apellido
        FROM compra c
        LEFT JOIN proveedores prov ON c.id_proveedor = prov.id_proveedor
        LEFT JOIN empresa e ON prov.id_empresa = e.id_empresa
        LEFT JOIN usuario u ON c.id_usuario = u.id_usuario
        LEFT JOIN persona p ON u.id_persona = p.id_persona
        ORDER BY c.fecha DESC
      `)
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al obtener compras: ${error.message}`)
    }
  }

  // Crear una nueva compra con sus detalles
  createCompraCompleta(compraData, detallesCompra) {
    const transaction = this.db.transaction(() => {
      try {
        // 1. Crear la compra
        const stmtCompra = this.db.prepare(`
          INSERT INTO compra (fecha, cantidad, monto, estado, id_proveedor, id_usuario)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        
        const resultCompra = stmtCompra.run(
          compraData.fecha,
          compraData.cantidad,
          compraData.monto,
          compraData.estado || 'PENDIENTE',
          compraData.id_proveedor,
          compraData.id_usuario
        )
        
        const idCompra = resultCompra.lastInsertRowid

        // 2. Procesar cada detalle de compra
        const stmtDetalle = this.db.prepare(`
          INSERT INTO detalle_compra (unidades, precio_unitario, id_compra, id_producto, id_producto_solicitado)
          VALUES (?, ?, ?, ?, ?)
        `)

        const detallesCreados = []

        for (const detalle of detallesCompra) {
          let idProducto = null
          let idProductoSolicitado = null

          // Si es un producto existente
          if (detalle.id_producto) {
            idProducto = detalle.id_producto
            
            // Actualizar stock del producto existente
            const stmtUpdateStock = this.db.prepare(`
              UPDATE productos 
              SET stock = COALESCE(stock, 0) + ? 
              WHERE id_producto = ?
            `)
            stmtUpdateStock.run(detalle.unidades, detalle.id_producto)
          } 
          // Si es un producto nuevo (solicitado)
          else {
            // Crear en productos_solicitados
            const stmtProductoSolicitado = this.db.prepare(`
              INSERT INTO productos_solicitados (
                nombre_producto, precio_compra, modelo, 
                descripcion, id_proveedor, estado
              ) VALUES (?, ?, ?, ?, ?, 'PENDIENTE')
            `)
            
            const resultProductoSolicitado = stmtProductoSolicitado.run(
              detalle.nombre_producto,
              detalle.precio_unitario || null,
              detalle.modelo || null,
              detalle.descripcion || null,
              compraData.id_proveedor
            )
            
            idProductoSolicitado = resultProductoSolicitado.lastInsertRowid
          }

          // Crear el detalle de compra
          const resultDetalle = stmtDetalle.run(
            detalle.unidades,
            detalle.precio_unitario,
            idCompra,
            idProducto,
            idProductoSolicitado
          )

          detallesCreados.push({
            id_detalle_compra: resultDetalle.lastInsertRowid,
            ...detalle,
            id_producto: idProducto,
            id_producto_solicitado: idProductoSolicitado
          })
        }

        return {
          compra: {
            id_compra: idCompra,
            ...compraData
          },
          detalles: detallesCreados
        }

      } catch (error) {
        throw new Error(`Error en transacción de compra: ${error.message}`)
      }
    })

    return transaction()
  }

  // Obtener compra por ID con sus detalles
  getCompraById(id) {
    try {
      // Obtener la compra
      const stmtCompra = this.db.prepare(`
        SELECT 
          c.*,
          e.razon_social as proveedor_nombre,
          p.nombre as usuario_nombre,
          p.apellido as usuario_apellido
        FROM compra c
        LEFT JOIN proveedores prov ON c.id_proveedor = prov.id_proveedor
        LEFT JOIN empresa e ON prov.id_empresa = e.id_empresa
        LEFT JOIN usuario u ON c.id_usuario = u.id_usuario
        LEFT JOIN persona p ON u.id_persona = p.id_persona
        WHERE c.id_compra = ?
      `)
      
      const compra = stmtCompra.get(id)
      if (!compra) {
        throw new Error('Compra no encontrada')
      }

      // Obtener los detalles de la compra
      const stmtDetalles = this.db.prepare(`
        SELECT 
          dc.*,
          prod.nombre_producto as producto_nombre,
          prod.modelo as producto_modelo,
          ps.nombre_producto as producto_solicitado_nombre,
          ps.modelo as producto_solicitado_modelo,
          ps.estado as producto_solicitado_estado
        FROM detalle_compra dc
        LEFT JOIN productos prod ON dc.id_producto = prod.id_producto
        LEFT JOIN productos_solicitados ps ON dc.id_producto_solicitado = ps.id_producto_solicitado
        WHERE dc.id_compra = ?
      `)
      
      const detalles = stmtDetalles.all(id)

      return {
        ...compra,
        detalles: detalles
      }
    } catch (error) {
      throw new Error(`Error al obtener compra: ${error.message}`)
    }
  }

  // Actualizar estado de compra
  updateEstadoCompra(id, estado) {
    try {
      const stmt = this.db.prepare(`
        UPDATE compra 
        SET estado = ? 
        WHERE id_compra = ?
      `)
      const result = stmt.run(estado, id)
      
      if (result.changes === 0) {
        throw new Error('Compra no encontrada')
      }
      
      return result
    } catch (error) {
      throw new Error(`Error al actualizar estado de compra: ${error.message}`)
    }
  }
}
