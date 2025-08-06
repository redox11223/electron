import { useState } from 'react'

function App() {
  const [userCredential, setUserCredential] = useState({ nombre_usuario: '', password: '' })
  //const users=await window.api.users.validateUser()
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserCredential((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      const users = await window.api.users.validateUser(userCredential)
      if (users.success) {
        alert('ingreso exitoso')
      } else {
        throw new Error('Usuario no valido')
      }
    } catch (error) {
      console.error('Error al cargar usuarios: ', error)
      alert(error)
    }
    setUserCredential({ nombre_usuario: '', password: '' })
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa tus datos</p>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          {/* Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
            <input
              type="text"
              name="nombre_usuario"
              value={userCredential.nombre_usuario}
              onChange={handleInputChange}
              placeholder="Ingresa tu usuario"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              //disabled={loading}
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              name="password"
              value={userCredential.password}
              onChange={handleInputChange}
              placeholder="Ingresa tu contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              //disabled={loading}
            />
          </div>

          {/* Error 
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}*/}

          {/* Botón de login */}
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
