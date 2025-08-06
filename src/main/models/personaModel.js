export class PersonaModel {
  constructor(db) {
    this.db = db
  }
  createPersona({ nombre, apellido, dni, celular, direccion, email }) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO persona(nombre,apellido,dni,direccion,email) VALUES(?,?,?,?,?)'
      )
      const result = stmt.run(nombre, apellido, dni, celular, direccion, email)
      return {
        id: result.lastInsertRowId,
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        celular: celular,
        direccion: direccion,
        email: email
      }
    } catch (error) {
      throw new Error(`Error al crear persona: ${error.message}`)
    }
  }
  getPersonaByDni(dni) {
    try {
      const stmt = this.db.prepare('SELECT dni from persona WHERE dni=?')
      return stmt.get(dni)
    } catch (error) {
      throw new Error(`Error al conseguir el Dni: ${error.message}`)
    }
  }
}
