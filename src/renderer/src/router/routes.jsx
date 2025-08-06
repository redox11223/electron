import { createBrowserRouter } from 'react-router-dom'
import Login from '../Login' // Importamos el componente Login
import Dashboard from '../Dashboard' // Importamos el componente Dashboard

// Definir el enrutamiento
const routes = createBrowserRouter([
  {
    path: '/',
    element: <Login /> // Ruta para la pantalla de Login
  },
  {
    path: '/Dashboard',
    element: <Dashboard /> // Ruta para la pantalla principal
  }
])

export default routes
