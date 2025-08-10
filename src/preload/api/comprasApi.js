import { ipcRenderer } from 'electron'

export const comprasApi = {
  // Compras
  getAll: () => ipcRenderer.invoke('compras:getAll'),
  create: (compraData, productos) => ipcRenderer.invoke('compras:create', { compraData, productos }),
  getById: (id) => ipcRenderer.invoke('compras:getById', id),
  updateEstado: (id, estado) => ipcRenderer.invoke('compras:updateEstado', { id, estado }),

  // Productos solicitados
  getAllProductosSolicitados: () => ipcRenderer.invoke('productos-solicitados:getAll'),
  searchProductosSolicitados: (searchTerm) => ipcRenderer.invoke('productos-solicitados:search', searchTerm),
  updateEstadoProductoSolicitado: (id, estado) => ipcRenderer.invoke('productos-solicitados:updateEstado', { id, estado })
}
