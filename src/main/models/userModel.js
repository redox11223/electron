export class UserModel {
  constructor(db) {
    this.db = db
  }
  getAllUsers() {
    const stmt = this.db.prepare('SELECT * FROM usuario')
    const usuarios = stmt.all()
    return usuarios
  }
  createUser({ nombre_usuario, password, id_persona, id_rol }) {
    const stmt = this.db.prepare(
      'INSERT INTO usuario(nombre_usuario,password,id_persona,id_rol) VALUES(?,?,?,?)'
    )
    const result = stmt.run(nombre_usuario, password, id_persona, id_rol)
    return {
      id: result.lastInsertRowId,
      nombre: nombre_usuario,
      rol: id_rol
    }
  }
  getUserCredentials({ nombre_usuario, password }) {
    try {
      console.log('Buscando usuario:', nombre_usuario, 'con password:', password) // Debug
      const stmt = this.db.prepare(`
        SELECT u.nombre_usuario, u.password, u.id_usuario, r.nombre_rol 
        FROM usuario u
        INNER JOIN rol r ON u.id_rol = r.id_rol
        WHERE u.nombre_usuario = ? AND u.password = ?
      `)
      const result = stmt.get(nombre_usuario, password)
      console.log('Resultado de la consulta:', result) // Debug
      return result

    } catch (error) {
      console.error('Error en getUserCredentials:', error) // Debug
      throw new Error(`Error al obtener las credenciales: ${error.message}`)

    }

  }
}
