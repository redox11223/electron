

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import portada from './assets/img3.jpg'
import { useValidateUser } from './hooks/validateUser'

const Login = () => {
  const [nombre_usuario, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const validateUser = useValidateUser()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    validateUser.mutate(
      { nombre_usuario, password },
      {
        onSuccess: (data) => {
          console.log('Usuario válido:', data.message)
           navigate('/dashboard', { state: { 
              nombre_usuario: data.user.nombre_usuario,
              nombre_rol: data.user.nombre_rol,
              id_usuario: data.user.id_usuario
            } })
        },
        onError: (error) => {
          console.error('Error en el Login', error)
        }
      }
    )
  }

  const handleInput = (setter) => {
    return (e) => {
      if (validateUser.isError) {
        validateUser.reset()
      }
      setter(e.target.value)
    }
  }
  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Columna 1: Imagen */}
        <div className="col-9 p-0 position-relative">
          <img
            src={portada}
            alt="Login"
            className="w-100 h-100"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>

        {/* Columna 2: Formulario de Login */}
        <div
          className="col-3 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: '#2e2e3e' }}
        >
          <div className="login-container w-100" style={{ maxWidth: '400px' }}>
            <div className="login-box p-4">
              <h2 className="text-center mb-4" style={{ color: '#ffffff' }}>
                INICIO
              </h2>
              {validateUser.isError && (
                <div className="alert alert-danger mb-3">
                  <small>{validateUser.error?.message}</small>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    value={nombre_usuario}
                    onChange={handleInput(setEmail)}
                  />
                </div>
                <div className="form-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={handleInput(setPassword)}
                    required
                  />
                </div>
                <div className="form-group mb-3 text-end">
                  <br />
                </div>
                <div className="form-group mb-3">
                  <button type="submit" className="  w-100 btn-login">
                    Ingresar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login