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
    const stmt = this.db.prepare(
      'SELECT nombre_usuario,password FROM usuario WHERE nombre_usuario=? AND password=?'
    )
    const result = stmt.get(nombre_usuario, password)
    return result
  }
}
