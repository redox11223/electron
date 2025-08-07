// MainContent.js
import { Productos } from '../pages/Productos'
import { Clientes } from '../pages/Clientes'
import { Proveedores } from '../pages/Proveedores'
import { Configuracion } from '../pages/Configuracion'
import { Inventario } from '../pages/inventario'

export const MainContent = ({ activeView }) => {
  return (
    <div
      className="main-content h-100"
      style={{
        paddingLeft: '32px',
        paddingTop: '24px',
        background: '#f3f0f5'
      }}
    >
      {activeView === 'productos' && <Productos />}
      {activeView === 'clientes' && <Clientes />}
      {activeView === 'proveedores' && <Proveedores />}
      {activeView === 'inventario' && <Inventario />}
      {activeView === 'configuracion' && <Configuracion />}
    </div>
  )
}

export default MainContent
