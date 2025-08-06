import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { userApi } from './api/userApi'
import { productApi } from './api/productApi'
import { clienteApi } from './api/clienteApi'
import { ventaApi } from './api/ventaApi'

// Custom APIs for renderer
const api = {
  users: userApi,
  products: productApi,
  clients: clienteApi,
  venta: ventaApi
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
