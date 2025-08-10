// Sidebar.js (sin cambios, pero para referencia)
/*
import { FaUserFriends, FaTruck, FaCogs, FaSignOutAlt, FaBoxes} from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";

import '../assets/base.css';

const Sidebar = ({ setActiveView }) => {
  return (
    <ul className="sidebar-menu ps-0 h-100">
      <li onClick={() => setActiveView("clientes")}>
        <div className="sidebar-link-vertical">
          <FaUserFriends size={20} style={{ marginRight: 8 }} />
          CLIENTE
        </div>
      </li>
      <li onClick={() => setActiveView("proveedores")}>
        <div className="sidebar-link-vertical">
          <FaTruck size={20} style={{ marginRight: 8 }} />
          PROVEEDOR
        </div>
      </li>
      <li onClick={() => setActiveView("productos")}>
        <div className="sidebar-link-vertical">
          <MdProductionQuantityLimits size={20} style={{ marginRight: 8}} />
          VENTA
        </div>
      </li>
      <li onClick={() => setActiveView("inventario")}>
        <div className="sidebar-link-vertical">
          <FaBoxes size={20} style={{ marginRight: 8 }} />
          INVENTARIO
        </div>
      </li>

      <div className="sidebar-bottom">
        <li onClick={() => setActiveView("configuracion")} className="etiqueta1">
          <div className="sidebar-link-vertical">
            <FaCogs size={20} style={{ marginRight: 8, color: "#2196f3" }} />
            CONFIG
          </div>
        </li>
        <li onClick={() => setActiveView("logout")}>
          <div className="sidebar-link-vertical">
            <FaSignOutAlt size={20} style={{ marginRight: 8 }} />
            LOG OUT
          </div>
        </li>
      </div>
    </ul>
  );
};

export default Sidebar;*/

// Sidebar.js
import { useState } from 'react'
import { FaUserFriends, FaTruck, FaCogs, FaSignOutAlt, FaBoxes } from 'react-icons/fa'
import { MdProductionQuantityLimits } from 'react-icons/md'
import '../assets/base.css'

const Sidebar = ({ setActiveView }) => {
  const [activeSection, setActiveSection] = useState('productos') // Sección activa por defecto

  const handleSectionClick = (section) => {
    setActiveSection(section)
    setActiveView(section)
  }

  return (
    <ul className="sidebar-menu ps-0 h-100">
      <li onClick={() => handleSectionClick('clientes')}>
        <div className={`sidebar-link-vertical ${activeSection === 'clientes' ? 'active' : ''}`}>
          <FaUserFriends size={20} style={{ marginRight: 8 }} />
          CLIENTE
        </div>
      </li>
      <li onClick={() => handleSectionClick('proveedores')}>
        <div className={`sidebar-link-vertical ${activeSection === 'proveedores' ? 'active' : ''}`}>
          <FaTruck size={20} style={{ marginRight: 8 }} />
          PROVEEDOR
        </div>
      </li>
      <li onClick={() => handleSectionClick('productos')}>
        <div className={`sidebar-link-vertical ${activeSection === 'productos' ? 'active' : ''}`}>
          <MdProductionQuantityLimits size={20} style={{ marginRight: 8 }} />
          VENTA
        </div>
      </li>
      <li onClick={() => handleSectionClick('inventario')}>
        <div className={`sidebar-link-vertical ${activeSection === 'inventario' ? 'active' : ''}`}>
          <FaBoxes size={20} style={{ marginRight: 8 }} />
          INVENTARIO
        </div>
      </li>

      <div className="sidebar-bottom">
        <li onClick={() => handleSectionClick('configuracion')} className="etiqueta1">
          <div
            className={`sidebar-link-vertical ${activeSection === 'configuracion' ? 'active' : ''}`}
          >
            <FaCogs
              size={20}
              style={{
                marginRight: 8,
                color: activeSection === 'configuracion' ? '#FFFFFF' : '#2196f3'
              }}
            />
            CONFIG
          </div>
        </li>
        <li onClick={() => handleSectionClick('logout')}>
          <div className={`sidebar-link-vertical ${activeSection === 'logout' ? 'active' : ''}`}>
            <FaSignOutAlt size={20} style={{ marginRight: 8 }} />
            Cerrar Sesión
          </div>
        </li>
      </div>
    </ul>
  )
}

export default Sidebar
