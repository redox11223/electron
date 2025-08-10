import { ipcRenderer } from 'electron'

export const proveedorApi = {
  getAll: () => {
    return ipcRenderer.invoke('get-proveedores')
  },
  search: (searchTerm) => {
    return ipcRenderer.invoke('search-proveedores', searchTerm)
  },
  create: (proveedorData) => {
    return ipcRenderer.invoke('create-proveedor', proveedorData)
  },
  update: (id_empresa, proveedorData) => {
    return ipcRenderer.invoke('update-proveedor', { id_empresa, proveedorData })
  },
  deactivate: (id_empresa) => {
    return ipcRenderer.invoke('deactivate-proveedor', id_empresa)
  },
  getById: (id_proveedor) => {
    return ipcRenderer.invoke('get-proveedor-by-id', id_proveedor)
  }
}
