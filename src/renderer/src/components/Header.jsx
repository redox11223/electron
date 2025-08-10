import logoSeblaza from '../assets/seblaza.png'
import { FaCircleUser } from "react-icons/fa6";

export const Header = ({ userInfo }) => {
  return (
    <div
      className="header-container w-100 fixed-top"
      style={{ height: '80px', display: 'flex', alignItems: 'center' }}
    >
      <div className="container-fluid">
        <div className="row align-items-center w-100" style={{ marginBottom: '0px' }}>
          {/* Columna 1: Logo */}
          <div className="col-4 d-flex align-items-center justify-content-start">
            <img src={logoSeblaza} alt="Logo" style={{ width: '160px' }} />
          </div>
          {/* Columna 2: Vacía */}
          <div className="col-4"></div>
          {/* Columna 3: Usuario */}
          <div className="col-4 text-end d-flex align-items-center justify-content-end">
            <div className="d-flex align-items-center me-3">
              {/* Icono centrado verticalmente */}
              <FaCircleUser size={30} className="me-3"/>
              
              {/* Contenedor para nombre y rol */}
              <div className="d-flex flex-column">
                <span style={{ fontWeight: '500', fontSize: '16px', lineHeight: '1.2' }}>
                  {userInfo?.nombre_usuario || 'Usuario'}
                </span>
                <small style={{ fontSize: '12px', color: '#ccdae7ff', lineHeight: '1.2' }}>
                  {userInfo?.nombre_rol || 'Sin rol'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
