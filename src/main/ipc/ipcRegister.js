import { ClienteEmpresaController } from '../controllers/clienteEmpresaController'
import { ProductController } from '../controllers/productController'
import { UserController } from '../controllers/userController'
import { UserPersonaController } from '../controllers/userPersonaController'
import { VentaController } from '../controllers/ventaController'
import { dbConfig } from '../config/db'

export const RegisterIpcs = (ipcMain, db) => {
  const productController = new ProductController(db)
  const userPersonaController = new UserPersonaController(db)
  const clienteEmpresaController = new ClienteEmpresaController(db)
  const ventaController = new VentaController(db)
  const userController = new UserController(db)

  userController.register(ipcMain)
  productController.register(ipcMain)
  userPersonaController.register(ipcMain)
  clienteEmpresaController.register(ipcMain)
  ventaController.register(ipcMain)
}

export const RegisterAuthIpcs = (ipcMain) => {
  ipcMain.handle('validate-user', async (event, userLogin) => {
    try {
      // AHORA creamos la conexión para validar
      const db = dbConfig()
      const userController = new UserController(db)

      const result = await userController.validateUser(userLogin)

      if (result.success) {
        // Login exitoso: AHORA registrar todos los IPCs
        RegisterIpcs(ipcMain, db)
        return { success: true, message: result.message }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error en autenticación:', error)
      return { success: false, error: error.message }
    }
  })
}
