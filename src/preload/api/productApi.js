import { ipcRenderer } from 'electron'

export const productApi = {
  getProducts: () => {
    return ipcRenderer.invoke('get-products')
  },
  getProductId: (id) => {
    return ipcRenderer.invoke('get-product-byid', id)
  },
  filterProducts: (filterOptions) => {
    return ipcRenderer.invoke('filter-products', filterOptions)
  },
  getProductsForManagement: () => {
    return ipcRenderer.invoke('get-products-management')
  },
  updateProduct: (productData) => {
    return ipcRenderer.invoke('update-product', productData)
  }
}
