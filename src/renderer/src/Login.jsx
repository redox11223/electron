import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos el hook useNavigate de React Router DOM
import 'bootstrap/dist/css/bootstrap.min.css';
//import './assets/base.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // Hook para redirigir a otras rutas

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de validación de login
    console.log(`Email: ${email}, Password: ${password}`);
    // Redirige a la pantalla principal (dashboard) después de hacer login
    navigate('/dashboard');
  };

  

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <a href="#">Forget Password?</a>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              <span>&rarr;</span> Login
            </button>
          </div>
          <div className="form-group">
            <p>Not a Member? <a href="#">Sign up</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;