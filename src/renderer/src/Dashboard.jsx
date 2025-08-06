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

const Dashboard = () => {
  const location = useLocation()
  const email = location.state?.email // Recuperamos el email pasado desde Login
  console.log(email)
  return (
    <>
      <Layout userEmail={email} /> {/* Pasamos el email a Layout */}
    </>
  )
}

export default Dashboard
