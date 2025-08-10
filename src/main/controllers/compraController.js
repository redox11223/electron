import { CompraModel } from '../models/compraModel.js'
import { ProductosSolicitadosModel } from '../models/productosSolicitadosModel.js'

export class CompraController {
  constructor(db) {
    this.compraModel = new CompraModel(db)
    this.productosSolicitadosModel = new ProductosSolicitadosModel(db)
  }

  register(ipcMain) {
    // Obtener todas las compras
    ipcMain.handle('compras:getAll', async () => {
      try {
        const compras = this.compraModel.getAllCompras()
        return { success: true, data: compras }
      } catch (error) {
        console.error('Error al obtener compras:', error)
        return { success: false, error: error.message }
      }
    })

    // Crear nueva compra completa
    ipcMain.handle('compras:create', async (event, { compraData, productos }) => {
      try {
        console.log('Creando compra:', { compraData, productos })
        
        // Validar datos requeridos
        if (!compraData.id_proveedor || !compraData.id_usuario || !productos || productos.length === 0) {
          throw new Error('Datos incompletos para crear la compra')
        }

        // Calcular cantidad total y monto total
        const cantidadTotal = productos.reduce((sum, prod) => sum + parseInt(prod.cantidad), 0)
        const montoTotal = productos.reduce((sum, prod) => sum + (parseFloat(prod.precio_unitario || 0) * parseInt(prod.cantidad)), 0)

        // Preparar datos de compra
        const compraCompleta = {
          ...compraData,
          cantidad: cantidadTotal,
          monto: montoTotal
        }

        // Preparar detalles de compra
        const detallesCompra = productos.map(producto => ({
          unidades: parseInt(producto.cantidad),
          precio_unitario: parseFloat(producto.precio_unitario || 0),
          id_producto: producto.id_producto || null,
          nombre_producto: producto.nombre_producto,
          precio_unitario: parseFloat(producto.precio_unitario || 0),
          modelo: producto.modelo || null,
          descripcion: producto.descripcion || null
        }))

        const resultado = this.compraModel.createCompraCompleta(compraCompleta, detallesCompra)
        
        console.log('Compra creada exitosamente:', resultado)
        return { success: true, data: resultado }
      } catch (error) {
        console.error('Error al crear compra:', error)
        return { success: false, error: error.message }
      }
    })

    // Obtener compra por ID
    ipcMain.handle('compras:getById', async (event, id) => {
      try {
        const compra = this.compraModel.getCompraById(id)
        return { success: true, data: compra }
      } catch (error) {
        console.error('Error al obtener compra:', error)
        return { success: false, error: error.message }
      }
    })

    // Actualizar estado de compra
    ipcMain.handle('compras:updateEstado', async (event, { id, estado }) => {
      try {
        const resultado = this.compraModel.updateEstadoCompra(id, estado)
        return { success: true, data: resultado }
      } catch (error) {
        console.error('Error al actualizar estado de compra:', error)
        return { success: false, error: error.message }
      }
    })

    // Obtener todos los productos solicitados
    ipcMain.handle('productos-solicitados:getAll', async () => {
      try {
        const productos = this.productosSolicitadosModel.getAllProductosSolicitados()
        return { success: true, data: productos }
      } catch (error) {
        console.error('Error al obtener productos solicitados:', error)
        return { success: false, error: error.message }
      }
    })

    // Buscar productos solicitados
    ipcMain.handle('productos-solicitados:search', async (event, searchTerm) => {
      try {
        const productos = this.productosSolicitadosModel.searchProductosSolicitados(searchTerm)
        return { success: true, data: productos }
      } catch (error) {
        console.error('Error al buscar productos solicitados:', error)
        return { success: false, error: error.message }
      }
    })

    // Actualizar estado de producto solicitado
    ipcMain.handle('productos-solicitados:updateEstado', async (event, { id, estado }) => {
      try {
        const resultado = this.productosSolicitadosModel.updateEstadoProductoSolicitado(id, estado)
        return { success: true, data: resultado }
      } catch (error) {
        console.error('Error al actualizar estado de producto solicitado:', error)
        return { success: false, error: error.message }
      }
    })
  }
}
