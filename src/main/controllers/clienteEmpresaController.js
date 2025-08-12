import { EmpresaModel } from '../models/empresaModel'
import { ClienteModel } from '../models/clienteModel'

export class ClienteEmpresaController {
  constructor(db) {
    this.empresaModel = new EmpresaModel(db)
    this.clienteModel = new ClienteModel(db)
    this.db = db
  }
  register(ipcMain) {
    // Handler para crear empresa y cliente (ya existente)
    ipcMain.handle('create-empresa-cliente', (event, data) => {
      try {
        return this.createClientePersona(data)
      } catch (error) {
        console.error('Error al registrar la empresa', error)
        return { success: false, error: error.message }
      }
    })
    
    // Handler para crear cliente (compatible con la nueva API)
    ipcMain.handle('create-cliente', (event, data) => {
      try {
        console.log('Datos recibidos para crear cliente:', data)
        const result = this.createClientePersona(data)
        console.log('Cliente y empresa creados:', result)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al crear cliente:', error)
        return { success: false, error: error.message }
      }
    })
    
    // Handler para obtener todos los clientes
    ipcMain.handle('get-all-clientes', (event) => {
      try {
        const clientes = this.clienteModel.getAllClientes()
        return { success: true, data: clientes }
      } catch (error) {
        console.error('Error al obtener clientes:', error)
        return { success: false, error: error.message }
      }
    })
    
    // Handler para buscar clientes (ya existente)
    ipcMain.handle('search-clientes', (event, searchTerm) => {
      try {
        const clientes = this.clienteModel.searchClientes(searchTerm)
        return { success: true, data: clientes }
      } catch (error) {
        console.error('Error al buscar clientes', error)
        return { success: false, error: error.message }
      }
    })
    
    // Handler para obtener cliente por ID
    ipcMain.handle('get-cliente-by-id', (event, id) => {
      try {
        const cliente = this.clienteModel.getClienteById(id)
        return { success: true, data: cliente }
      } catch (error) {
        console.error('Error al obtener cliente:', error)
        return { success: false, error: error.message }
      }
    })
    
    // Handler para actualizar cliente
    ipcMain.handle('update-cliente', (event, id, empresaData) => {
      try {
        const result = this.clienteModel.updateCliente(id, empresaData)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al actualizar cliente:', error)
        return { success: false, error: error.message }
      }
    })
    
    // Handler para desactivar cliente
    ipcMain.handle('deactivate-cliente', (event, id) => {
      try {
        const result = this.clienteModel.deactivateCliente(id)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al desactivar cliente:', error)
        return { success: false, error: error.message }
      }
    })
  }
  createClientePersona(data) {
    const transaction = this.db.transaction((data) => {
      const empresa = this.empresaModel.createEmpresa(data)
      const cliente = this.clienteModel.createCliente({
        id: empresa.id
      })
      return { empresa, cliente }
    })
    try {
      return transaction(data)
    } catch (error) {
      throw new Error(`Error en la transaccion: ${error.message}`)
    }
  }
}
