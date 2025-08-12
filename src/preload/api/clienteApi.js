import { ipcRenderer } from 'electron'

export const clienteApi = {
  // Obtener todos los clientes
  getAll: () => {
    return ipcRenderer.invoke('get-all-clientes')
  },

  // Obtener cliente por ID
  getById: (id) => {
    return ipcRenderer.invoke('get-cliente-by-id', id)
  },

  // Buscar clientes
  search: (searchTerm) => {
    return ipcRenderer.invoke('search-clientes', searchTerm)
  },

  // Crear cliente
  create: (empresaData) => {
    return ipcRenderer.invoke('create-cliente', empresaData)
  },

  // Actualizar cliente
  update: (id, empresaData) => {
    return ipcRenderer.invoke('update-cliente', id, empresaData)
  },

  // Desactivar cliente
  deactivate: (id) => {
    return ipcRenderer.invoke('deactivate-cliente', id)
  },

  // Funciones de compatibilidad
  createClient: (data) => {
    return ipcRenderer.invoke('create-empresa-cliente', data)
  },
  
  searchClientes: (searchTerm) => {
    return ipcRenderer.invoke('search-clientes', searchTerm)
  }
}
