import { DetalleVenta } from '../models/detalleVentaModel'
import { VentaModel } from '../models/ventaModel'
import { ProductModel } from '../models/productModel'
import { ClienteModel } from '../models/clienteModel'

export class VentaController {
  constructor(db) {
    this.ventaModel = new VentaModel(db)
    this.detalleVentaModel = new DetalleVenta(db)
    this.productModel = new ProductModel(db)
    this.clienteModel = new ClienteModel(db)
    this.db = db
  }
  register(ipcMain) {
    ipcMain.handle('register-venta-detalle', (event, data) => {
      try {
        const result = this.registerVentaDetalle(data)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al registrar la venta', error)
        return { success: false, error: error.message }
      }
    })
  }
  registerVentaDetalle(data) {
    console.log('Datos recibidos para venta:', data) // Debug
    
    // Verificar que tenemos todos los datos necesarios
    if (!data.id_cliente) {
      throw new Error('id_cliente es requerido')
    }
    
    const transaction = this.db.transaction((data) => {
      // Verificar que el cliente existe
      let clienteExists = this.db.prepare('SELECT id_cliente FROM clientes WHERE id_cliente = ?').get(data.id_cliente)
      console.log('Cliente existe?', clienteExists) // Debug
      
      if (!clienteExists) {
        // Si no existe el cliente, crearlo
        console.log('Cliente no existe, creando...') // Debug
        try {
          const nuevoCliente = this.clienteModel.createCliente({ id: data.id_empresa })
          console.log('Cliente creado:', nuevoCliente) // Debug
          data.id_cliente = nuevoCliente.id // Usar el nuevo id_cliente
        } catch (clienteError) {
          console.error('Error creando cliente:', clienteError) // Debug
          throw new Error(`Error al crear cliente: ${clienteError.message}`)
        }
      }
      
      // Crear la venta (sin id_usuario para evitar problemas de foreign key)
      console.log('Creando venta con id_cliente:', data.id_cliente) // Debug
      const ventaData = {
        id_cliente: data.id_cliente,
        fecha: data.fecha,
        total: data.total,
        estado: data.estado,
        id_usuario: null // Siempre null para evitar problemas de foreign key
      }
      
      const venta = this.ventaModel.createVenta(ventaData)
      console.log('Venta creada con ID:', venta.id_venta) // Debug
      
      // Verificar que el id_venta se creó correctamente
      if (!venta.id_venta) {
        throw new Error('No se pudo obtener el ID de la venta creada')
      }
      
      // Crear los detalles de venta y actualizar stock
      const detalle = data.productos.map((prod) => {
        console.log('Procesando producto:', prod.id_producto, 'cantidad:', prod.unidades, 'id_venta:', venta.id_venta) // Debug
        
        // Actualizar stock del producto
        this.productModel.updateStock(prod.id_producto, prod.unidades)
        
        // Crear detalle de venta con el id_venta correcto
        const detalleResult = this.detalleVentaModel.createDetalleVenta({
          id_venta: venta.id_venta,
          id_producto: prod.id_producto,
          unidades: prod.unidades
        })
        
        console.log('Detalle creado:', detalleResult) // Debug
        return detalleResult
      })

      return { venta, detalle }
    })
    
    try {
      const result = transaction(data)
      console.log('Transacción completada exitosamente:', result) // Debug
      return result
    } catch (error) {
      console.error('Error en transacción:', error) // Debug
      throw new Error(`Error al hacer la transaccion de la venta: ${error.message}`)
    }
  }
}
