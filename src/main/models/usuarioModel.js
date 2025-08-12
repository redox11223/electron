import { dbConfig } from '../config/db'

const db = dbConfig()

export class UsuarioModel {
  // Obtener todos los usuarios con información completa
  static getAllUsuarios() {
    try {
      const query = `
        SELECT 
          u.id_usuario,
          u.nombre_usuario,
          u.password,
          u.estado,
          u.fecha_creacion,
          p.id_persona,
          p.nombre,
          p.apellido,
          p.dni,
          p.direccion,
          p.email,
          p.celular,
          r.id_rol,
          r.nombre_rol
        FROM usuario u
        INNER JOIN persona p ON u.id_persona = p.id_persona
        INNER JOIN rol r ON u.id_rol = r.id_rol
        ORDER BY u.fecha_creacion DESC
      `
      
      const usuarios = db.prepare(query).all()
      
      return usuarios.map(usuario => ({
        ...usuario,
        nombre_completo: `${usuario.nombre} ${usuario.apellido}`
      }))
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  }

  // Obtener todos los roles
  static getAllRoles() {
    try {
      const query = 'SELECT * FROM rol ORDER BY nombre_rol'
      return db.prepare(query).all()
    } catch (error) {
      console.error('Error al obtener roles:', error)
      throw error
    }
  }

  // Crear nuevo usuario
  static createUsuario(userData) {
    const transaction = db.transaction((userData) => {
      try {
        // Verificar si el DNI ya existe
        const existingDni = db.prepare('SELECT id_persona FROM persona WHERE dni = ?').get(userData.dni)
        if (existingDni) {
          throw new Error('El DNI ya está registrado')
        }

        // Verificar si el nombre de usuario ya existe
        const existingUser = db.prepare('SELECT id_usuario FROM usuario WHERE nombre_usuario = ?').get(userData.nombre_usuario)
        if (existingUser) {
          throw new Error('El nombre de usuario ya está registrado')
        }

        // Verificar si el email ya existe
        if (userData.email) {
          const existingEmail = db.prepare('SELECT id_persona FROM persona WHERE email = ?').get(userData.email)
          if (existingEmail) {
            throw new Error('El email ya está registrado')
          }
        }

        // Insertar persona
        const insertPersona = db.prepare(`
          INSERT INTO persona (nombre, apellido, dni, direccion, email, celular)
          VALUES (?, ?, ?, ?, ?, ?)
        `)
        
        const personaResult = insertPersona.run(
          userData.nombre,
          userData.apellido,
          userData.dni,
          userData.direccion || null,
          userData.email || null,
          userData.celular
        )

        // Insertar usuario
        const insertUsuario = db.prepare(`
          INSERT INTO usuario (nombre_usuario, password, estado, id_persona, id_rol)
          VALUES (?, ?, ?, ?, ?)
        `)
        
        const usuarioResult = insertUsuario.run(
          userData.nombre_usuario,
          userData.password,
          userData.estado || 'Activo',
          personaResult.lastInsertRowid,
          userData.id_rol
        )

        return { 
          id_usuario: usuarioResult.lastInsertRowid,
          id_persona: personaResult.lastInsertRowid
        }
      } catch (error) {
        throw error
      }
    })

    return transaction(userData)
  }

  // Actualizar usuario
  static updateUsuario(id_usuario, userData) {
    const transaction = db.transaction((id_usuario, userData) => {
      try {
        // Obtener información actual del usuario
        const currentUser = db.prepare(`
          SELECT u.*, p.* FROM usuario u 
          INNER JOIN persona p ON u.id_persona = p.id_persona 
          WHERE u.id_usuario = ?
        `).get(id_usuario)

        if (!currentUser) {
          throw new Error('Usuario no encontrado')
        }

        // Verificar DNI duplicado (excluyendo el actual)
        if (userData.dni && userData.dni !== currentUser.dni) {
          const existingDni = db.prepare('SELECT id_persona FROM persona WHERE dni = ? AND id_persona != ?')
            .get(userData.dni, currentUser.id_persona)
          if (existingDni) {
            throw new Error('El DNI ya está registrado')
          }
        }

        // Verificar nombre de usuario duplicado (excluyendo el actual)
        if (userData.nombre_usuario && userData.nombre_usuario !== currentUser.nombre_usuario) {
          const existingUser = db.prepare('SELECT id_usuario FROM usuario WHERE nombre_usuario = ? AND id_usuario != ?')
            .get(userData.nombre_usuario, id_usuario)
          if (existingUser) {
            throw new Error('El nombre de usuario ya está registrado')
          }
        }

        // Verificar email duplicado (excluyendo el actual)
        if (userData.email && userData.email !== currentUser.email) {
          const existingEmail = db.prepare('SELECT id_persona FROM persona WHERE email = ? AND id_persona != ?')
            .get(userData.email, currentUser.id_persona)
          if (existingEmail) {
            throw new Error('El email ya está registrado')
          }
        }

        // Actualizar persona
        const updatePersona = db.prepare(`
          UPDATE persona 
          SET nombre = ?, apellido = ?, dni = ?, direccion = ?, email = ?, celular = ?
          WHERE id_persona = ?
        `)
        
        updatePersona.run(
          userData.nombre || currentUser.nombre,
          userData.apellido || currentUser.apellido,
          userData.dni || currentUser.dni,
          userData.direccion || currentUser.direccion,
          userData.email || currentUser.email,
          userData.celular || currentUser.celular,
          currentUser.id_persona
        )

        // Actualizar usuario
        const updateUsuario = db.prepare(`
          UPDATE usuario 
          SET nombre_usuario = ?, password = ?, estado = ?, id_rol = ?
          WHERE id_usuario = ?
        `)
        
        updateUsuario.run(
          userData.nombre_usuario || currentUser.nombre_usuario,
          userData.password || currentUser.password,
          userData.estado || currentUser.estado,
          userData.id_rol || currentUser.id_rol,
          id_usuario
        )

        return { success: true }
      } catch (error) {
        throw error
      }
    })

    return transaction(id_usuario, userData)
  }

  // Soft delete usuario
  static deleteUsuario(id_usuario) {
    try {
      const updateUsuario = db.prepare('UPDATE usuario SET estado = ? WHERE id_usuario = ?')
      const result = updateUsuario.run('Inactivo', id_usuario)
      
      if (result.changes === 0) {
        throw new Error('Usuario no encontrado')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw error
    }
  }

  // Buscar usuarios
  static searchUsuarios(searchTerm) {
    try {
      const query = `
        SELECT 
          u.id_usuario,
          u.nombre_usuario,
          u.password,
          u.estado,
          u.fecha_creacion,
          p.id_persona,
          p.nombre,
          p.apellido,
          p.dni,
          p.direccion,
          p.email,
          p.celular,
          r.id_rol,
          r.nombre_rol
        FROM usuario u
        INNER JOIN persona p ON u.id_persona = p.id_persona
        INNER JOIN rol r ON u.id_rol = r.id_rol
        WHERE 
          u.nombre_usuario LIKE ? OR
          p.nombre LIKE ? OR
          p.apellido LIKE ? OR
          p.dni LIKE ? OR
          r.nombre_rol LIKE ?
        ORDER BY u.fecha_creacion DESC
      `
      
      const searchPattern = `%${searchTerm}%`
      const usuarios = db.prepare(query).all(
        searchPattern, searchPattern, searchPattern, searchPattern, searchPattern
      )
      
      return usuarios.map(usuario => ({
        ...usuario,
        nombre_completo: `${usuario.nombre} ${usuario.apellido}`
      }))
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
      throw error
    }
  }
}
