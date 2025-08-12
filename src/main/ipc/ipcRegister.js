import { ClienteEmpresaController } from '../controllers/clienteEmpresaController'
import { ProductController } from '../controllers/productController'
import { UserController } from '../controllers/userController'
import { UserPersonaController } from '../controllers/userPersonaController'
import { VentaController } from '../controllers/ventaController'
import { ProveedorController } from '../controllers/proveedorController'
import { CompraController } from '../controllers/compraController'
import { UsuarioController } from '../controllers/usuarioController'
import { dbConfig } from '../config/db'

export const RegisterIpcs = (ipcMain, db) => {
  const productController = new ProductController(db)
  const userPersonaController = new UserPersonaController(db)
  const clienteEmpresaController = new ClienteEmpresaController(db)
  const ventaController = new VentaController(db)
  const userController = new UserController(db)
  const proveedorController = new ProveedorController(db)
  const compraController = new CompraController(db)

  userController.register(ipcMain)
  productController.register(ipcMain)
  userPersonaController.register(ipcMain)
  clienteEmpresaController.register(ipcMain)
  ventaController.register(ipcMain)
  proveedorController.register(ipcMain)
  compraController.register(ipcMain)

  // Handlers para gestión de usuarios
  ipcMain.handle('get-all-usuarios', async () => {
    return await UsuarioController.getAllUsuarios()
  })

  ipcMain.handle('get-all-roles', async () => {
    return await UsuarioController.getAllRoles()
  })

  ipcMain.handle('create-usuario', async (event, userData) => {
    return await UsuarioController.createUsuario(userData)
  })

  ipcMain.handle('update-usuario', async (event, id, userData) => {
    return await UsuarioController.updateUsuario(id, userData)
  })

  ipcMain.handle('delete-usuario', async (event, id) => {
    return await UsuarioController.deleteUsuario(id)
  })

  ipcMain.handle('search-usuarios', async (event, searchTerm) => {
    return await UsuarioController.searchUsuarios(searchTerm)
  })
}

export const RegisterAuthIpcs = (ipcMain) => {
  ipcMain.handle('validate-user', async (event, userLogin) => {
    try {
      console.log('RegisterAuthIpcs - Datos recibidos:', userLogin) // Debug
      // AHORA creamos la conexión para validar
      const db = dbConfig()
      const userController = new UserController(db)

      const result = await userController.validateUser(userLogin)
      console.log('RegisterAuthIpcs - Resultado:', result) // Debug

      if (result.success) {
        // Login exitoso: AHORA registrar todos los IPCs
        RegisterIpcs(ipcMain, db)
        return { 
          success: true, 
          message: result.message,
          user: result.user // Agregar los datos del usuario
        }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error en autenticación:', error)
      return { success: false, error: error.message }
    }
  })
}
