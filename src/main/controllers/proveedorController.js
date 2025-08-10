import { ProveedorModel } from '../models/proveedorModel.js'

export class ProveedorController {
  constructor(db) {
    this.proveedorModel = new ProveedorModel(db)
  }

  register(ipcMain) {
    // Obtener todos los proveedores
    ipcMain.handle('get-proveedores', async () => {
      try {
        const proveedores = this.proveedorModel.getAllProveedores()
        return { success: true, data: proveedores }
      } catch (error) {
        console.error('Error al obtener proveedores:', error)
        return { success: false, error: error.message }
      }
    })

    // Buscar proveedores
    ipcMain.handle('search-proveedores', async (event, searchTerm) => {
      try {
        const proveedores = this.proveedorModel.searchProveedores(searchTerm)
        return { success: true, data: proveedores }
      } catch (error) {
        console.error('Error al buscar proveedores:', error)
        return { success: false, error: error.message }
      }
    })

    // Crear proveedor
    ipcMain.handle('create-proveedor', async (event, proveedorData) => {
      try {
        const proveedor = this.proveedorModel.createProveedor(proveedorData)
        return { success: true, data: proveedor }
      } catch (error) {
        console.error('Error al crear proveedor:', error)
        return { success: false, error: error.message }
      }
    })

    // Actualizar proveedor
    ipcMain.handle('update-proveedor', async (event, { id_empresa, proveedorData }) => {
      try {
        const result = this.proveedorModel.updateProveedor(id_empresa, proveedorData)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al actualizar proveedor:', error)
        return { success: false, error: error.message }
      }
    })

    // Desactivar proveedor
    ipcMain.handle('deactivate-proveedor', async (event, id_empresa) => {
      try {
        const result = this.proveedorModel.deactivateProveedor(id_empresa)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al desactivar proveedor:', error)
        return { success: false, error: error.message }
      }
    })

    // Obtener proveedor por ID
    ipcMain.handle('get-proveedor-by-id', async (event, id_proveedor) => {
      try {
        const proveedor = this.proveedorModel.getProveedorById(id_proveedor)
        if (!proveedor) {
          return { success: false, error: 'Proveedor no encontrado' }
        }
        return { success: true, data: proveedor }
      } catch (error) {
        console.error('Error al obtener proveedor:', error)
        return { success: false, error: error.message }
      }
    })
  }
}
