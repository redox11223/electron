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
}
