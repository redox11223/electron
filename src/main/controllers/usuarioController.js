import { UsuarioModel } from '../models/usuarioModel'

export class UsuarioController {
  // Obtener todos los usuarios
  static async getAllUsuarios() {
    try {
      const usuarios = UsuarioModel.getAllUsuarios()
      return { success: true, data: usuarios }
    } catch (error) {
      console.error('Error en getAllUsuarios:', error)
      return { success: false, error: error.message }
    }
  }

  // Obtener todos los roles
  static async getAllRoles() {
    try {
      const roles = UsuarioModel.getAllRoles()
      return { success: true, data: roles }
    } catch (error) {
      console.error('Error en getAllRoles:', error)
      return { success: false, error: error.message }
    }
  }

  // Crear nuevo usuario
  static async createUsuario(userData) {
    try {
      // Validaciones básicas
      if (!userData.nombre || !userData.apellido || !userData.dni || !userData.celular) {
        throw new Error('Los campos nombre, apellido, DNI y celular son obligatorios')
      }

      if (!userData.nombre_usuario || !userData.password || !userData.id_rol) {
        throw new Error('Los campos nombre de usuario, contraseña y rol son obligatorios')
      }

      const result = UsuarioModel.createUsuario(userData)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error en createUsuario:', error)
      return { success: false, error: error.message }
    }
  }

  // Actualizar usuario
  static async updateUsuario(id_usuario, userData) {
    try {
      if (!id_usuario) {
        throw new Error('ID de usuario es requerido')
      }

      const result = UsuarioModel.updateUsuario(id_usuario, userData)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error en updateUsuario:', error)
      return { success: false, error: error.message }
    }
  }

  // Eliminar usuario (soft delete)
  static async deleteUsuario(id_usuario) {
    try {
      if (!id_usuario) {
        throw new Error('ID de usuario es requerido')
      }

      const result = UsuarioModel.deleteUsuario(id_usuario)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error en deleteUsuario:', error)
      return { success: false, error: error.message }
    }
  }

  // Buscar usuarios
  static async searchUsuarios(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        // Si no hay término de búsqueda, devolver todos los usuarios
        return this.getAllUsuarios()
      }

      const usuarios = UsuarioModel.searchUsuarios(searchTerm.trim())
      return { success: true, data: usuarios }
    } catch (error) {
      console.error('Error en searchUsuarios:', error)
      return { success: false, error: error.message }
    }
  }
}
