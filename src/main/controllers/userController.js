import { UserModel } from '../models/userModel'

export class UserController {
  constructor(db) {
    this.userModel = new UserModel(db)
  }
  async validateUser(userLogin) {
    try {
      console.log('Validando usuario con:', userLogin) // Debug
      const userCredentials = this.userModel.getUserCredentials(userLogin)
      console.log('Credenciales obtenidas:', userCredentials) // Debug
      
      if (!userCredentials) {
        console.log('No se encontraron credenciales para el usuario') // Debug
        return { success: false, error: 'Usuario inválido' }
      }
      
      console.log('Usuario válido encontrado:', userCredentials.nombre_usuario) // Debug
      return {
        success: true,
        message: `Usuario ${userCredentials.nombre_usuario} autorizado`,
        user: userCredentials
      }
    } catch (error) {
      console.error('Error en validateUser:', error) // Debug
      return { success: false, error: error.message }
    }
  }
  register(ipcMain) {
    ipcMain.handle('get-users', async () => {
      try {
        const users = this.userModel.getAllUsers()
        return { success: true, data: users }
      } catch (error) {
        console.error('Error al cargar los usuarios', error)
        return { success: false, error: error.message }
      }
    })
  }
}
