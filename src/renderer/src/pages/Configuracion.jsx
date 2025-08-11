/*
export const Configuracion = () => {
  return <div>Configuracion</div>
}

export default Configuracion
*/

import { useState } from 'react';


export const Configuracion = () => {
  // Estado para los datos del usuario
  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    direccion: '',
    email: '',
    celular: '',
    rol: ''
  });

  // Estado para controlar qué campo está siendo editado
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');

  // Función para iniciar la edición de un campo
  const handleEdit = (field) => {
    setEditingField(field);
    setTempValue(userData[field]);
  };

  // Función para guardar los cambios
  const handleSave = (field) => {
    setUserData(prev => ({
      ...prev,
      [field]: tempValue
    }));
    setEditingField(null);
    setTempValue('');
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  // Componente para renderizar cada campo
  const UserField = ({ label, field, value }) => (
    <div className="row mb-3 align-items-center">
      <div className="col-md-3">
        <label className="form-label fw-medium text-muted">{label}</label>
      </div>
      <div className="col-md-7">
        {editingField === field ? (
          <input
            type="text"
            className="form-control"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
          />
        ) : (
          <span className="text-dark">{value || 'No especificado'}</span>
        )}
      </div>
      <div className="col-md-2 text-end">
        {editingField === field ? (
          <div className="d-flex gap-1">
            <button
              className="btn btn-success btn-sm"
              onClick={() => handleSave(field)}
            >
              Guardar
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            className="btn btn-link text-primary p-0"
            onClick={() => handleEdit(field)}
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="bg-white px-4 py-3 border-bottom">
            <h4 className="mb-1">Cuenta y Configuración</h4>
            <small className="text-muted">4:56 pm 21 Jul 2023</small>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white px-4">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <a 
                  className="nav-link active border-0 text-primary fw-medium" 
                  href="#"
                  style={{ borderBottom: '2px solid #0d6efd' }}
                >
                  Perfil
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link border-0 text-muted" href="#">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="bg-white px-4 py-4">
            <div className="row">
              <div className="col-lg-8">
                {/* Profile Section */}
                <div className="mb-4">
                  <h5 className="mb-4">Detalles Básicos</h5>
                  
                  {/* Profile Picture Placeholder */}
                  <div className="row mb-4 align-items-center">
                    <div className="col-md-3">
                      <label className="form-label fw-medium text-muted">Foto de Perfil</label>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex align-items-center">
                        <div 
                          className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: '80px', height: '80px' }}
                        >
                          <i className="bi bi-person-fill text-white fs-2"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 text-end">
                      <button className="btn btn-link text-primary p-0">
                        Cambiar
                      </button>
                    </div>
                  </div>

                  {/* User Fields */}
                  <UserField 
                    label="Nombre" 
                    field="nombre" 
                    value={userData.nombre} 
                  />
                  
                  <UserField 
                    label="Apellido" 
                    field="apellido" 
                    value={userData.apellido} 
                  />
                  
                  <UserField 
                    label="DNI" 
                    field="dni" 
                    value={userData.dni} 
                  />
                  
                  <UserField 
                    label="Dirección" 
                    field="direccion" 
                    value={userData.direccion} 
                  />
                  
                  <UserField 
                    label="Email" 
                    field="email" 
                    value={userData.email} 
                  />
                  
                  <UserField 
                    label="Celular" 
                    field="celular" 
                    value={userData.celular} 
                  />
                  
                  <UserField 
                    label="Rol" 
                    field="rol" 
                    value={userData.rol} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Icons CDN (agregar al head de tu HTML) */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css"
      />
    </div>
  );
};

export default Configuracion;
