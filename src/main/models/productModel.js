export class ProductModel {
  constructor(db) {
    this.db = db
  }
  getAllProducts() {
    try {
      const stmt = this.db.prepare('SELECT * FROM productos')
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`)
    }
  }
  getProductById(id) {
    try {
      const stmt = this.db.prepare('SELECT * FROM productos WHERE id_producto=?')
      const product = stmt.get(id)
      if (!product) {
        throw new Error('Producto no encontrado')
      }
      return product
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`)
    }
  }
  searchProducts({ termino, filtro, rangoPrecio }) {
    let sql = `SELECT p.id_producto,p.nombre_producto ,cp.nombre,p.modelo,e.razon_social,p.precio_compra,p.precio_venta  
      FROM productos p
      LEFT JOIN categoria_producto cp ON p.id_categoria=cp.id_categoria
      LEFT JOIN detalle_compra dc ON p.id_producto=dc.id_producto
      LEFT JOIN compra c ON c.id_compra=dc.id_compra
      LEFT JOIN proveedores pr ON pr.id_proveedor=c.id_proveedor
      LEFT JOIN empresa e ON e.id_empresa=pr.id_empresa
      WHERE 1=1`
    let params = []

    if (termino) {
      sql += `AND ${filtro === 'todos' ? 'p.nombre_producto' : filtro === 'categoria' ? 'cp.nombre_categoria' : filtro === 'modelo' ? 'p.modelo' : 'e.razon_social'} LIKE ?`
      params.push(`%${termino}%`)
    }
    if (rangoPrecio === '<50') {
      sql += 'AND p.precio_compra < ?'
      params.push(50)
    } else if (rangoPrecio === '50-100') {
      sql += 'AND p.precio_compra BETWEEN ? AND ? '
      params.push(50, 100)
    } else if (rangoPrecio === '>100') {
      sql += 'AND p.precio_compra>? '
      params.push(100)
    }
    try {
      const filter = this.db.prepare(sql)
      return filter.all(...params)
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error.message}`)
    }
  }
  
  updateStock(id_producto, cantidad) {
    try {
      const stmt = this.db.prepare('UPDATE productos SET stock = stock - ? WHERE id_producto = ?')
      const result = stmt.run(cantidad, id_producto)
      if (result.changes === 0) {
        throw new Error('Producto no encontrado o no se pudo actualizar el stock')
      }
      return result
    } catch (error) {
      throw new Error(`Error al actualizar el stock: ${error.message}`)
    }
  }

  // Método específico para GestionProducto con información completa
  getProductsForManagement() {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          p.id_producto,
          p.nombre_producto,
          p.precio_compra,
          p.precio_venta,
          p.stock,
          p.modelo,
          p.descripcion,
          p.id_proveedor,
          p.id_categoria,
          cp.nombre_categoria,
          e.razon_social as proveedor_nombre
        FROM productos p
        LEFT JOIN categoria_producto cp ON p.id_categoria = cp.id_categoria
        LEFT JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
        LEFT JOIN empresa e ON e.id_empresa = pr.id_empresa
        ORDER BY p.id_producto ASC
      `)
      return stmt.all()
    } catch (error) {
      throw new Error(`Error al obtener los productos para gestión: ${error.message}`)
    }
  }

  updateProduct(productData) {
    try {
      const stmt = this.db.prepare(`
        UPDATE productos 
        SET 
          nombre_producto = ?,
          modelo = ?,
          descripcion = ?,
          stock = ?,
          precio_compra = ?,
          precio_venta = ?,
          id_proveedor = ?,
          id_categoria = ?
        WHERE id_producto = ?
      `)
      
      const result = stmt.run(
        productData.nombre_producto,
        productData.modelo,
        productData.descripcion,
        productData.stock,
        productData.precio_compra,
        productData.precio_venta,
        productData.id_proveedor,
        productData.id_categoria,
        productData.id_producto
      )

      if (result.changes === 0) {
        throw new Error('No se encontró el producto a actualizar')
      }

      return { success: true, changes: result.changes }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`)
    }
  }
}
