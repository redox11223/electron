/*
import Layout from './components/Layout';

const Dashboard = () => {
  return (
    <>
      <Layout />  
    </>  

  );
};

export default Dashboard;
*/

import { useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'

const Dashboard = () => {
  const location = useLocation()
  const userInfo = {
    nombre_usuario: location.state?.nombre_usuario,
    nombre_rol: location.state?.nombre_rol,
    id_usuario: location.state?.id_usuario
  }
  
  console.log('Información del usuario:', userInfo)
  
  return (
    <AuthProvider>
      <Layout userInfo={userInfo} />
    </AuthProvider>
  )
}

export default Dashboard
