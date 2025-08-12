// API para gestión de usuarios
export const usuarioApi = {
  // Obtener todos los usuarios
  getAllUsuarios: () => window.electronAPI.invoke('get-all-usuarios'),
  
  // Obtener todos los roles
  getAllRoles: () => window.electronAPI.invoke('get-all-roles'),
  
  // Crear nuevo usuario
  createUsuario: (userData) => window.electronAPI.invoke('create-usuario', userData),
  
  // Actualizar usuario
  updateUsuario: (id, userData) => window.electronAPI.invoke('update-usuario', id, userData),
  
  // Eliminar usuario (soft delete)
  deleteUsuario: (id) => window.electronAPI.invoke('delete-usuario', id),
  
  // Buscar usuarios
  searchUsuarios: (searchTerm) => window.electronAPI.invoke('search-usuarios', searchTerm)
}
