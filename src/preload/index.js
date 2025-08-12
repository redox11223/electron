import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { userApi } from './api/userApi'
import { productApi } from './api/productApi'
import { clienteApi } from './api/clienteApi'
import { ventaApi } from './api/ventaApi'
import { proveedorApi } from './api/proveedorApi'
import { comprasApi } from './api/comprasApi'
import { usuarioApi } from './api/usuarioApi'

// Custom APIs for renderer
const api = {
  users: userApi,
  products: productApi,
  clients: clienteApi,
  venta: ventaApi,
  proveedores: proveedorApi,
  compras: comprasApi,
  usuarios: usuarioApi
}

// Extender electronAPI con funciones de usuarios
const extendedElectronAPI = {
  ...electronAPI,
  // Funciones de gestión de usuarios
  getAllUsuarios: () => electronAPI.ipcRenderer.invoke('get-all-usuarios'),
  getAllRoles: () => electronAPI.ipcRenderer.invoke('get-all-roles'),
  createUsuario: (userData) => electronAPI.ipcRenderer.invoke('create-usuario', userData),
  updateUsuario: (id, userData) => electronAPI.ipcRenderer.invoke('update-usuario', id, userData),
  deleteUsuario: (id) => electronAPI.ipcRenderer.invoke('delete-usuario', id),
  searchUsuarios: (searchTerm) => electronAPI.ipcRenderer.invoke('search-usuarios', searchTerm)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('electronAPI', extendedElectronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.electronAPI = extendedElectronAPI
  window.api = api
}
