import { useState, useEffect, useMemo } from 'react'
import { FaPlus, FaEdit, FaInfoCircle, FaTrash, FaSearch } from 'react-icons/fa'
import { useProveedores } from '../hooks/useProveedores'

export const Proveedores = () => {
  const {
    proveedores,
    isLoading,
    isCreating,
    isUpdating,
    isDeactivating,
    error,
    createError,
    updateError,
    deactivateError,
    isCreateSuccess,
    isUpdateSuccess,
    isDeactivateSuccess,
    createProveedor,
    updateProveedor,
    deactivateProveedor,
    searchProveedores,
    resetCreateMutation,
    resetUpdateMutation,
    resetDeactivateMutation
  } = useProveedores()

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create', 'edit'
  const [selectedProveedor, setSelectedProveedor] = useState(null)
  const [formData, setFormData] = useState({
    id_empresa: '',
    razon_social: '',
    numero_ruc: '',
    direccion: '',
    email: '',
    celular: '',
    estado: 'Activa'
  })

  // Filtrar proveedores usando useMemo para optimizar
  const filteredProveedores = useMemo(() => {
    if (!searchTerm.trim()) {
      return proveedores
    }
    return proveedores.filter(proveedor =>
      proveedor.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.numero_ruc?.includes(searchTerm) ||
      proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, proveedores])

  // Manejo de efectos para mostrar mensajes de éxito y error
  useEffect(() => {
    if (isCreateSuccess) {
      setShowModal(false)
      resetFormData()
      resetCreateMutation()
      // Aquí podrías mostrar un toast de éxito
    }
  }, [isCreateSuccess, resetCreateMutation])

  useEffect(() => {
    if (isUpdateSuccess) {
      setShowModal(false)
      resetFormData()
      resetUpdateMutation()
      // Aquí podrías mostrar un toast de éxito
    }
  }, [isUpdateSuccess, resetUpdateMutation])

  useEffect(() => {
    if (isDeactivateSuccess) {
      resetDeactivateMutation()
      // Aquí podrías mostrar un toast de éxito
    }
  }, [isDeactivateSuccess, resetDeactivateMutation])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const resetFormData = () => {
    setFormData({
      id_empresa: '',
      razon_social: '',
      numero_ruc: '',
      direccion: '',
      email: '',
      celular: '',
      estado: 'Activa'
    })
  }

  const handleOpenModal = (mode, proveedor = null) => {
    setModalMode(mode)
    if (mode === 'edit' && proveedor) {
      setSelectedProveedor(proveedor)
      setFormData({
        id_empresa: proveedor.id_empresa,
        razon_social: proveedor.razon_social,
        numero_ruc: proveedor.numero_ruc,
        direccion: proveedor.direccion,
        email: proveedor.email,
        celular: proveedor.celular,
        estado: proveedor.estado
      })
    } else {
      setSelectedProveedor(null)
      resetFormData()
    }
    setShowModal(true)
  }

  const handleOpenInfoModal = (proveedor) => {
    setSelectedProveedor(proveedor)
    setFormData({
      id_empresa: proveedor.id_empresa,
      razon_social: proveedor.razon_social,
      numero_ruc: proveedor.numero_ruc,
      direccion: proveedor.direccion,
      email: proveedor.email,
      celular: proveedor.celular,
      estado: proveedor.estado
    })
    setShowInfoModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setShowInfoModal(false)
    setSelectedProveedor(null)
    resetFormData()
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validación básica
    if (!formData.razon_social || !formData.numero_ruc) {
      alert('La razón social y el RUC son campos obligatorios')
      return
    }

    const proveedorData = {
      id_empresa: formData.id_empresa || null,
      razon_social: formData.razon_social,
      numero_ruc: formData.numero_ruc,
      direccion: formData.direccion || null,
      email: formData.email || null,
      celular: formData.celular || null
    }

    if (modalMode === 'create') {
      createProveedor(proveedorData)
    } else if (modalMode === 'edit' && selectedProveedor) {
      updateProveedor({ 
        id: selectedProveedor.id_proveedor, 
        proveedorData 
      })
    }
  }

  const handleDeactivate = (proveedor) => {
    if (window.confirm(`¿Está seguro de que desea desactivar el proveedor "${proveedor.razon_social}"?`)) {
      deactivateProveedor(proveedor.id_proveedor)
    }
  }

  // Mostrar loading spinner
  if (isLoading) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    )
  }

  // Mostrar error
  if (error) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar proveedores</h4>
          <p>{error.message}</p>
          <button className="btn btn-outline-danger" onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Proveedores</h2>
        <button 
          className="btn" style={{ backgroundColor: '#8B45FF', color: '#fff' }}
          onClick={() => handleOpenModal('create')}
        >
          <FaPlus className="me-2" />
          Agregar Nuevo Proveedor
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por razón social, RUC o email..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Tabla de proveedores */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Razón Social</th>
              <th>RUC</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProveedores.length > 0 ? (
              filteredProveedores.map((proveedor) => (
                <tr key={proveedor.id_proveedor}>
                  <td>{proveedor.razon_social}</td>
                  <td>{proveedor.numero_ruc}</td>
                  <td>{proveedor.email}</td>
                  <td>
                    <span className={`badge ${proveedor.estado === 'Activa' ? 'bg-success' : 'bg-danger'}`}>
                      {proveedor.estado}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleOpenModal('edit', proveedor)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => handleOpenInfoModal(proveedor)}
                        title="Ver información completa"
                      >
                        <FaInfoCircle />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeactivate(proveedor)}
                        title="Desactivar"
                        disabled={isDeactivating}
                      >
                        {isDeactivating ? (
                          <div className="spinner-border spinner-border-sm" role="status"></div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  {searchTerm ? 'No se encontraron proveedores que coincidan con la búsqueda' : 'No hay proveedores registrados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear/Editar Proveedor */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'create' ? 'Agregar Nuevo Proveedor' : 'Editar Proveedor'}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {/* Mostrar errores */}
                  {(createError || updateError) && (
                    <div className="alert alert-danger" role="alert">
                      <strong>Error:</strong> {createError?.message || updateError?.message}
                    </div>
                  )}
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="razon_social" className="form-label">Razón Social *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="razon_social"
                        name="razon_social"
                        value={formData.razon_social}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="numero_ruc" className="form-label">RUC *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="numero_ruc"
                        name="numero_ruc"
                        value={formData.numero_ruc}
                        onChange={handleInputChange}
                        maxLength="11"
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label htmlFor="direccion" className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="celular" className="form-label">Celular *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="celular"
                        name="celular"
                        value={formData.celular}
                        onChange={handleInputChange}
                        maxLength="12"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="estado" className="form-label">Estado</label>
                      <select
                        className="form-select"
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                      >
                        <option value="Activa">Activa</option>
                        <option value="Inactiva">Inactiva</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                    disabled={isCreating || isUpdating}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isCreating || isUpdating}
                  >
                    {(isCreating || isUpdating) && (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    )}
                    {modalMode === 'create' ? 'Crear Proveedor' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Información Completa */}
      {showInfoModal && selectedProveedor && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información Completa del Proveedor</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label"><strong>ID Empresa:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.id_empresa}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label"><strong>ID Proveedor:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.id_proveedor}</p>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label"><strong>Razón Social:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.razon_social}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label"><strong>RUC:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.numero_ruc}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label"><strong>Estado:</strong></label>
                    <span className={`badge ${selectedProveedor.estado === 'Activa' ? 'bg-success' : 'bg-danger'}`}>
                      {selectedProveedor.estado}
                    </span>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label"><strong>Dirección:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.direccion || 'No especificada'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label"><strong>Email:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label"><strong>Celular:</strong></label>
                    <p className="form-control-plaintext">{selectedProveedor.celular}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowInfoModal(false)
                    handleOpenModal('edit', selectedProveedor)
                  }}
                >
                  <FaEdit className="me-2" />
                  Editar Proveedor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
