import { RouterProvider } from 'react-router-dom'
import router from './router/routes' // Importamos las rutas definidas en routes.js

const App = () => {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <RouterProvider router={router} /> // Usamos el RouterProvider con las rutas
  )
}

export default App
