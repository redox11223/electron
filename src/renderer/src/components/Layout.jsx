import { useState } from 'react';
import Header from './Header';
import { MainContent } from './MainContent';
import Sidebar from './Sidebar';

export const Layout = ({ userEmail }) => {
  const [activeView, setActiveView] = useState('productos'); // Inicializamos con la vista de productos
  return (
    <div className="container-fluid p-0">

      {/*
      <Header userName="Pedro Trillo" tipoUsuario="Admin" />
        */}
      <Header userEmail={userEmail} />  {/* Pasamos el userEmail al Header */}
      <div className="row w-100" style={{ minHeight: 'calc(100vh - 80px)', marginTop: '80px' }}>
        <div className="col-2 p-0">
          <Sidebar setActiveView={setActiveView} /> {/* Pasamos la función para actualizar la vista */}
        </div>
        <div className="col-10">
          <div className="mainContent-container" style={{ paddingLeft: '32px', paddingTop: '24px' }}>
            <MainContent activeView={activeView} /> {/* Pasamos el estado de la vista activa */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;