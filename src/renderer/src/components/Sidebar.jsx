
import { FaUserFriends, FaTruck, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";
import '../assets/base.css';

const Sidebar = ({ setActiveView }) => {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu ps-0">
        <li onClick={() => setActiveView("clientes")}>
          <div className="sidebar-link">
            <FaUserFriends size={20} style={{ marginRight: 8 }} />
            CLIENTES
          </div>
        </li>
        <li onClick={() => setActiveView("proveedores")}>
          <div className="sidebar-link">
            <FaTruck size={20} style={{ marginRight: 8 }} />
            PROVEEDORES
          </div>
        </li>
        <li onClick={() => setActiveView("productos")}>
          <div className="sidebar-link">
            <MdProductionQuantityLimits size={20} style={{ marginRight: 8, color: "red" }} />
            PRODUCTOS
          </div>
        </li>
        <div className="sidebar-bottom">
          <li onClick={() => setActiveView("configuracion")} className="etiqueta1">
            <div className="sidebar-link">
              <FaCogs size={20} style={{ marginRight: 8, color: "#2196f3" }} />
              CONFIGURACION
            </div>
          </li>
          <li onClick={() => setActiveView("logout")}>
            <div className="sidebar-link">
              <FaSignOutAlt size={20} style={{ marginRight: 8 }} />
              LOG OUT
            </div>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
