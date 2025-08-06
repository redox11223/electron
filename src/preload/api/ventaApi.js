import { ipcRenderer } from 'electron'

export const ventaApi = {
  registerVenta: (data) => {
    return ipcRenderer.invoke('register-venta-detalle', data)
  }
}
