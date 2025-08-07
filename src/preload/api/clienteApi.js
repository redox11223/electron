import { ipcRenderer } from 'electron'

export const clienteApi = {
  createClient: (data) => {
    return ipcRenderer.invoke('create-empresa-cliente', data)
  },
  searchClientes: (searchTerm) => {
    return ipcRenderer.invoke('search-clientes', searchTerm)
  }
}
