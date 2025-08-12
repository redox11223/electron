import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Primero verificar si hay datos en localStorage
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAuthenticated(true)
      return
    }

    // Si no hay datos en localStorage, verificar el state de navegación
    if (location.state && location.state.id_usuario) {
      const userData = {
        id_usuario: location.state.id_usuario,
        nombre_usuario: location.state.nombre_usuario,
        nombre_rol: location.state.nombre_rol
      }
      setUser(userData)
      setIsAuthenticated(true)
      // Guardar en localStorage para persistencia
      localStorage.setItem('currentUser', JSON.stringify(userData))
    }
  }, [location.state])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
