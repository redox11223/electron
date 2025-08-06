import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
//import portada from "./assets/havc.jpg";
import portada from './assets/img3.jpg'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(`Email: ${email}, Password: ${password}`)
    navigate('/dashboard', { state: { email } })
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
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    requiredstyle={{ backgroundColor: '#2e2e3e' }}
                  />
                </div>
                <div className="form-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group mb-3 text-end">
                  <br />
                </div>
                <div className="form-group mb-3">
                  <button type="submit" className="  w-100 btn-login">
                    <span>&rarr;</span> Ingresar
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

export default Login
