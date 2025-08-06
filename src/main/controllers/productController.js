import { ProductModel } from '../models/productModel'

export class ProductController {
  constructor(db) {
    this.productModel = new ProductModel(db)
  }

  register(ipcMain) {
    ipcMain.handle('get-products', async () => {
      try {
        const result = this.productModel.getAllProducts()
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al conseguir los productos:', error)
      }
    })
    ipcMain.handle('get-product-byid', (event, id) => {
      try {
        const product = this.productModel.getProductById(id)
        return { success: true, data: product }
      } catch (error) {
        console.error('Error al obtener el producto:', error)
        return { success: false, error: error.message }
      }
    })
    ipcMain.handle('filter-products', async (event, filterOptions) => {
      try {
        const filter = this.productModel.searchProducts(filterOptions)
        return { success: true, data: filter }
      } catch (error) {
        console.error('Error al filtrar los productos:', error)
        return { success: false, error: error.message }
      }
    })
  }
}
