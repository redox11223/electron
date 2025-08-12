import { useState, useEffect } from 'react'
import { useUserProfile } from '../hooks/useUserProfile'
import { useAuth } from '../context/AuthContext'
import { useUsuarios } from '../hooks/useUsuarios'

export const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('perfil')
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  
  // Estados para gestión de usuarios
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    direccion: '',
    email: '',
    celular: '',
    nombre_usuario: '',
    password: '',
    id_rol: ''
  })
  
  // Obtener el usuario actual del contexto de autenticación
  const { user } = useAuth()
  
  // Hook para gestión de usuarios
  const {
    usuarios,
    isLoading: usuariosLoading,
    error: usuariosError,
    roles,
    rolesLoading,
    createUsuario,
    updateUsuario: updateUsuarioFn,
    deleteUsuario,
    isCreating,
    isUpdating: isUpdatingUsuario,
    isDeleting,
    createError,
    updateError: updateUsuarioError,
    deleteError,
    isCreateSuccess,
    isUpdateSuccess: isUpdateUsuarioSuccess,
    isDeleteSuccess,
    resetCreateMutation,
    resetUpdateMutation: resetUpdateUsuarioMutation,
    resetDeleteMutation
  } = useUsuarios()
  
  const {
    profile,
    isLoading,
    isUpdating,
    error,
    updateError,
    isUpdateSuccess,
    updateProfile,
    resetUpdateMutation
  } = useUserProfile(user?.id_usuario)

  // Función para formatear la fecha actual
  const getCurrentDateTime = () => {
    const now = new Date()
    const options = { 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }
    return now.toLocaleDateString('es-ES', options)
  }

  // Función para iniciar la edición de un campo
  const handleEdit = (field) => {
    setEditingField(field)
    setTempValue(profile[field] || '')
  }

  // Función para guardar los cambios
  const handleSave = (field) => {
    const updatedData = {
      ...profile,
      [field]: tempValue
    }
    
    // Extraer solo los campos de persona que se pueden actualizar
    const personData = {
      nombre: updatedData.nombre,
      apellido: updatedData.apellido,
      dni: updatedData.dni,
      direccion: updatedData.direccion,
      email: updatedData.email,
      celular: updatedData.celular
    }
    
    updateProfile(personData)
    setEditingField(null)
    setTempValue('')
  }

  // Función para cancelar la edición
  const handleCancel = () => {
    setEditingField(null)
    setTempValue('')
  }

  // Funciones para manejar formularios de usuarios
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateUsuario = () => {
    createUsuario(formData)
  }

  const handleUpdateUsuario = () => {
    updateUsuarioFn({ id: selectedUsuario.id_usuario, userData: formData })
  }

  const resetCreateForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      dni: '',
      direccion: '',
      email: '',
      celular: '',
      nombre_usuario: '',
      password: '',
      id_rol: ''
    })
    setShowCreateModal(false)
    resetCreateMutation()
  }

  const resetEditForm = () => {
    setSelectedUsuario(null)
    setShowEditModal(false)
    resetUpdateUsuarioMutation()
  }

  // Efecto para mostrar mensajes de éxito
  useEffect(() => {
    if (isUpdateSuccess) {
      resetUpdateMutation()
    }
  }, [isUpdateSuccess, resetUpdateMutation])

  // Efectos para gestión de usuarios
  useEffect(() => {
    if (isCreateSuccess) {
      resetCreateForm()
    }
  }, [isCreateSuccess, resetCreateForm])

  useEffect(() => {
    if (isUpdateUsuarioSuccess) {
      resetEditForm()
    }
  }, [isUpdateUsuarioSuccess, resetEditForm])

  useEffect(() => {
    if (isDeleteSuccess) {
      resetDeleteMutation()
    }
  }, [isDeleteSuccess, resetDeleteMutation])

  // Componente para renderizar cada campo
  const UserField = ({ label, field, value, isEditable = true }) => (
    <div className="row mb-4 align-items-center py-2 border-bottom border-light">
      <div className="col-md-3">
        <label className="form-label fw-medium text-muted mb-0">{label}</label>
      </div>
      <div className="col-md-7">
        {editingField === field ? (
          <input
            type="text"
            className="form-control border-0 shadow-sm"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
            style={{ 
              backgroundColor: '#f8f9fa',
              fontSize: '15px'
            }}
          />
        ) : (
          <span className="text-dark fw-normal" style={{ fontSize: '15px' }}>
            {value || 'No especificado'}
          </span>
        )}
      </div>
      <div className="col-md-2 text-end">
        {isEditable && (
          editingField === field ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm px-3"
                onClick={() => handleSave(field)}
                disabled={isUpdating}
                style={{ 
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                {isUpdating ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                className="btn btn-outline-secondary btn-sm px-3"
                onClick={handleCancel}
                style={{ 
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              className="btn btn-link text-primary p-0 text-decoration-none"
              onClick={() => handleEdit(field)}
              style={{ 
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Editar
            </button>
          )
        )}
      </div>
    </div>
  )

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando perfil del usuario...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="alert alert-warning m-4" role="alert">
        <h4 className="alert-heading">Usuario no autenticado</h4>
        <p>No se pudo obtener la información del usuario autenticado.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="bg-white px-4 py-4 border-bottom shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h4 className="mb-1 text-dark fw-bold">Cuenta y Configuración</h4>
                <small className="text-muted d-flex align-items-center">
                  <i className="bi bi-clock me-2"></i>
                  {getCurrentDateTime()}
                </small>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                  <i className="bi bi-person-circle text-primary" style={{ fontSize: '24px' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white px-4 shadow-sm">
            <ul className="nav nav-tabs border-0" style={{ borderBottom: '1px solid #e9ecef' }}>
              <li className="nav-item">
                <button 
                  className={`nav-link border-0 px-4 py-3 fw-medium ${activeTab === 'perfil' ? 'text-primary active' : 'text-muted'}`}
                  onClick={() => setActiveTab('perfil')}
                  style={{ 
                    borderBottom: activeTab === 'perfil' ? '3px solid #0d6efd' : 'none',
                    background: 'none',
                    fontSize: '15px'
                  }}
                >
                  <i className="bi bi-person me-2"></i>
                  Perfil
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link border-0 px-4 py-3 fw-medium ${activeTab === 'dashboard' ? 'text-primary active' : 'text-muted'}`}
                  onClick={() => setActiveTab('dashboard')}
                  style={{ 
                    borderBottom: activeTab === 'dashboard' ? '3px solid #0d6efd' : 'none',
                    background: 'none',
                    fontSize: '15px'
                  }}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="bg-white">
            {activeTab === 'perfil' ? (
              <div className="px-4 py-5">
                <div className="row">
                  <div className="col-lg-8 mx-auto">
                    {/* Profile Section */}
                    <div className="mb-5">
                      <div className="d-flex align-items-center mb-4">
                        <h5 className="mb-0 text-dark fw-bold">Detalles Básicos</h5>
                        <div className="ms-auto">
                          <small className="text-success d-flex align-items-center">
                            <i className="bi bi-shield-check me-1"></i>
                            Perfil verificado
                          </small>
                        </div>
                      </div>
                      
                      {/* User Fields */}
                      <div className="bg-light bg-opacity-50 p-4 rounded-3">
                        <UserField 
                          label="Nombre" 
                          field="nombre" 
                          value={profile?.nombre} 
                        />
                        
                        <UserField 
                          label="Apellido" 
                          field="apellido" 
                          value={profile?.apellido} 
                        />
                        
                        <UserField 
                          label="DNI" 
                          field="dni" 
                          value={profile?.dni} 
                        />
                        
                        <UserField 
                          label="Dirección" 
                          field="direccion" 
                          value={profile?.direccion} 
                        />
                        
                        <UserField 
                          label="Email" 
                          field="email" 
                          value={profile?.email} 
                        />
                        
                        <UserField 
                          label="Celular" 
                          field="celular" 
                          value={profile?.celular} 
                        />
                        
                        <UserField 
                          label="Rol" 
                          field="rol" 
                          value={profile?.rol} 
                          isEditable={false}
                        />

                        <UserField 
                          label="Usuario" 
                          field="nombre_usuario" 
                          value={profile?.nombre_usuario} 
                          isEditable={false}
                        />
                      </div>

                      {/* Error message */}
                      {updateError && (
                        <div className="alert alert-danger mt-3" role="alert">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          {updateError.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Panel de Gestión de Usuarios
              <div className="px-4 py-4">
                <div className="row">
                  <div className="col-12">
                    {/* Header con botón crear */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="mb-0 text-dark fw-bold">Gestión de Usuarios</h5>
                        <small className="text-muted">Administra los usuarios del sistema</small>
                      </div>
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <i className="bi bi-plus me-2"></i>
                        Crear Usuario
                      </button>
                    </div>

                    {/* Buscador */}
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-search"></i>
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tabla de usuarios */}
                    {usuariosLoading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="text-muted mt-2">Cargando usuarios...</p>
                      </div>
                    ) : usuariosError ? (
                      <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Error al cargar usuarios: {usuariosError.message}
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Usuario</th>
                              <th>Contraseña</th>
                              <th>Rol</th>
                              <th>Nombre Completo</th>
                              <th>Estado</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuarios.filter(usuario => 
                              !searchTerm || 
                              usuario.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              usuario.nombre_rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              usuario.dni.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((usuario) => (
                              <tr key={usuario.id_usuario}>
                                <td className="fw-medium">{usuario.nombre_usuario}</td>
                                <td>
                                  <span className="text-muted">••••••••</span>
                                </td>
                                <td>
                                  <span className="badge bg-primary">
                                    {usuario.nombre_rol}
                                  </span>
                                </td>
                                <td>{usuario.nombre_completo}</td>
                                <td>
                                  <span className={`badge ${usuario.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                                    {usuario.estado}
                                  </span>
                                </td>
                                <td>
                                  <div className="btn-group" role="group">
                                    <button 
                                      className="btn btn-sm btn-outline-info"
                                      onClick={() => {
                                        setSelectedUsuario(usuario)
                                        setShowInfoModal(true)
                                      }}
                                      title="Ver información"
                                    >
                                      <i className="bi bi-info-circle"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-warning"
                                      onClick={() => {
                                        setSelectedUsuario(usuario)
                                        setFormData({
                                          nombre: usuario.nombre,
                                          apellido: usuario.apellido,
                                          dni: usuario.dni,
                                          direccion: usuario.direccion || '',
                                          email: usuario.email || '',
                                          celular: usuario.celular,
                                          nombre_usuario: usuario.nombre_usuario,
                                          password: '',
                                          id_rol: usuario.id_rol
                                        })
                                        setShowEditModal(true)
                                      }}
                                      title="Editar"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => {
                                        if (window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
                                          deleteUsuario(usuario.id_usuario)
                                        }
                                      }}
                                      disabled={usuario.estado === 'Inactivo' || isDeleting}
                                      title="Desactivar"
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {usuarios.length === 0 && (
                          <div className="text-center py-4">
                            <i className="bi bi-person-x text-muted" style={{ fontSize: '48px' }}></i>
                            <p className="text-muted mt-2">No hay usuarios registrados</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear usuario */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nuevo Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => { e.preventDefault(); handleCreateUsuario(); }}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.nombre}
                          onChange={(e) => handleFormChange('nombre', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Apellido *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.apellido}
                          onChange={(e) => handleFormChange('apellido', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">DNI *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.dni}
                          onChange={(e) => handleFormChange('dni', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Celular *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.celular}
                          onChange={(e) => handleFormChange('celular', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.direccion}
                          onChange={(e) => handleFormChange('direccion', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Usuario *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.nombre_usuario}
                          onChange={(e) => handleFormChange('nombre_usuario', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Contraseña *</label>
                        <input
                          type="password"
                          className="form-control"
                          value={formData.password}
                          onChange={(e) => handleFormChange('password', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol *</label>
                    <select
                      className="form-select"
                      value={formData.id_rol}
                      onChange={(e) => handleFormChange('id_rol', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar rol...</option>
                      {roles.map(rol => (
                        <option key={rol.id_rol} value={rol.id_rol}>
                          {rol.nombre_rol}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {createError && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {createError.message}
                    </div>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateUsuario} disabled={isCreating}>
                  {isCreating ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para información del usuario */}
      {showInfoModal && selectedUsuario && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información del Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setShowInfoModal(false)}></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <tbody>
                    <tr><td><strong>Usuario:</strong></td><td>{selectedUsuario.nombre_usuario}</td></tr>
                    <tr><td><strong>Nombre:</strong></td><td>{selectedUsuario.nombre_completo}</td></tr>
                    <tr><td><strong>DNI:</strong></td><td>{selectedUsuario.dni}</td></tr>
                    <tr><td><strong>Email:</strong></td><td>{selectedUsuario.email || 'No especificado'}</td></tr>
                    <tr><td><strong>Celular:</strong></td><td>{selectedUsuario.celular}</td></tr>
                    <tr><td><strong>Dirección:</strong></td><td>{selectedUsuario.direccion || 'No especificado'}</td></tr>
                    <tr><td><strong>Rol:</strong></td><td>{selectedUsuario.nombre_rol}</td></tr>
                    <tr><td><strong>Estado:</strong></td><td>
                      <span className={`badge ${selectedUsuario.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
                        {selectedUsuario.estado}
                      </span>
                    </td></tr>
                    <tr><td><strong>Fecha de creación:</strong></td><td>{new Date(selectedUsuario.fecha_creacion).toLocaleDateString()}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInfoModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bootstrap Icons CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
    </div>
  )
}

export default Configuracion
