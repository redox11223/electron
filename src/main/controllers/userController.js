import { UserModel } from '../models/userModel'

export class UserController {
  constructor(db) {
    this.userModel = new UserModel(db)
  }
  async validateUser(userLogin) {
    try {
      const userCredentials = this.userModel.getUserCredentials(userLogin)
      if (!userCredentials) {
        return { success: false, error: 'Usuario inválido' }
      }
      return {
        success: true,
        message: `Usuario ${userCredentials.nombre_usuario} autorizado`,
        user: userCredentials
      }
    } catch (error) {
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
