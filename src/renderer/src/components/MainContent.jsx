
import {Productos} from '../pages/Productos'; // Asegúrate de tener este componente creado
import { Clientes } from '../pages/Clientes'; // Otro componente similar
import {Proveedores} from '../pages/Proveedores'; // Otro componente similar
import {Configuracion} from '../pages/Configuracion'; // Otro componente similar

export const MainContent = ({ activeView }) => {
  return (
    <div className="main-content">
      {activeView === 'productos' && <Productos />}
      {activeView === 'clientes' && <Clientes />}
      {activeView === 'proveedores' && <Proveedores />}
      {activeView === 'configuracion' && <Configuracion />}
    </div>
  );
};

export default MainContent;
