import { PersonaModel } from '../models/personaModel'
import { UserModel } from '../models/userModel'
import bcrypt from 'bcryptjs'

export class UserPersonaController {
  constructor(db) {
    this.userModel = new UserModel(db)
    this.personaModel = new PersonaModel(db)
    this.db = db
  }
  register(ipcMain) {
    ipcMain.handle('create-persona-user', (event, data) => {
      try {
        const result = this.createUserPersona(data)
        return { success: true, data: result }
      } catch (error) {
        console.error('Error al crear Persona y User', error)
        return { success: false, error: error.message }
      }
    })
  }
  createUserPersona(data) {
    const transaction = this.db.transaction((data) => {
      Object.values(data).forEach((element) => {
        if (typeof element === 'string') {
          element.trim()
        }
      })
      const requiredFields = [
        'nombre',
        'apellido',
        'nombre_usuario',
        'password',
        'dni',
        'celular',
        'id_rol'
      ]
      for (const element of requiredFields) {
        if (!data[element]) throw new Error(`Falta el campo obligatorio: ${element}`)
      }
      if (!/^\d{9}$/.test(data.celular)) {
        throw new Error('Inserte un número valido')
      }
      const existsDni = this.personaModel.getPersonaByDni(data.dni)
      if (existsDni) {
        throw new Error(`El Dni: ${data.dni} ya esta registrado`)
      }
      const hashedPassword = bcrypt.hashSync(data.password, 10)
      const person = this.personaModel.createPersona(data)
      const user = this.userModel.createUser({
        ...data,
        id: person.id,
        password: hashedPassword
      })
      return { person, user }
    })
    try {
      return transaction(data)
    } catch (error) {
      throw new Error(`Transacción fallida: ${error.message}`)
    }
  }
}
