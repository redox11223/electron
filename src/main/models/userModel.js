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

  // Obtener datos completos del usuario con información de persona
  getUserWithPersonData(userId) {
    try {
      const stmt = this.db.prepare(`
        SELECT 
          u.id_usuario,
          u.nombre_usuario,
          p.nombre,
          p.apellido,
          p.dni,
          p.direccion,
          p.email,
          p.celular,
          r.nombre_rol as rol
        FROM usuario u
        INNER JOIN persona p ON u.id_persona = p.id_persona
        INNER JOIN rol r ON u.id_rol = r.id_rol
        WHERE u.id_usuario = ?
      `)
      return stmt.get(userId)
    } catch (error) {
      throw new Error(`Error al obtener datos del usuario: ${error.message}`)
    }
  }

  // Actualizar datos de persona del usuario
  updateUserPersonData(userId, personData) {
    try {
      // Primero obtener el id_persona del usuario
      const userStmt = this.db.prepare('SELECT id_persona FROM usuario WHERE id_usuario = ?')
      const user = userStmt.get(userId)
      
      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      // Actualizar los datos de persona
      const updateStmt = this.db.prepare(`
        UPDATE persona 
        SET nombre = ?, apellido = ?, dni = ?, direccion = ?, email = ?, celular = ?
        WHERE id_persona = ?
      `)
      
      const result = updateStmt.run(
        personData.nombre,
        personData.apellido, 
        personData.dni,
        personData.direccion,
        personData.email,
        personData.celular,
        user.id_persona
      )

      if (result.changes === 0) {
        throw new Error('No se pudo actualizar los datos del usuario')
      }

      return { success: true, changes: result.changes }
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error.message}`)
    }
  }
}
