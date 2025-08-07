import { EmpresaModel } from '../models/empresaModel'
import { ClienteModel } from '../models/clienteModel'

export class ClienteEmpresaController {
  constructor(db) {
    this.empresaModel = new EmpresaModel(db)
    this.clienteModel = new ClienteModel(db)
    this.db = db
  }
  register(ipcMain) {
    ipcMain.handle('create-empresa-cliente', (event, data) => {
      try {
        return this.createClientePersona(data)
      } catch (error) {
        console.error('Error al registrar la empresa', error)
        return { success: false, error: error.message }
      }
    })
    
    ipcMain.handle('search-clientes', (event, searchTerm) => {
      try {
        const clientes = this.clienteModel.searchClientes(searchTerm)
        return { success: true, data: clientes }
      } catch (error) {
        console.error('Error al buscar clientes', error)
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
