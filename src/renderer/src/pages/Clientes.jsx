import { useState, useEffect, useMemo } from 'react'
import { FaPlus, FaEdit, FaInfoCircle, FaTrash, FaSearch } from 'react-icons/fa'
import { useClientesGestion } from '../hooks/useClientesGestion'

export const Clientes = () => {
  const {
    clientes,
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
    createCliente,
    updateCliente,
    deactivateCliente,
    searchClientes,
    resetCreateMutation,
    resetUpdateMutation,
    resetDeactivateMutation
  } = useClientesGestion()

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create', 'edit'
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [formData, setFormData] = useState({
    razon_social: '',
    numero_ruc: '',
    direccion: '',
    email: '',
    celular: '',
    estado: 'Activa'
  })

  // Filtrar clientes usando useMemo para optimizar
  const filteredClientes = useMemo(() => {
    if (!searchTerm.trim()) {
      return clientes
    }
    return clientes.filter(cliente =>
      cliente.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.numero_ruc?.includes(searchTerm) ||
      cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, clientes])

  // Manejo de efectos para mostrar mensajes de éxito y error
  useEffect(() => {
    if (isCreateSuccess) {
      setShowModal(false)
      resetFormData()
      resetCreateMutation()
    }
  }, [isCreateSuccess, resetCreateMutation])

  useEffect(() => {
    if (isUpdateSuccess) {
      setShowModal(false)
      resetFormData()
      resetUpdateMutation()
    }
  }, [isUpdateSuccess, resetUpdateMutation])

  useEffect(() => {
    if (isDeactivateSuccess) {
      resetDeactivateMutation()
    }
  }, [isDeactivateSuccess, resetDeactivateMutation])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const resetFormData = () => {
    setFormData({
      razon_social: '',
      numero_ruc: '',
      direccion: '',
      email: '',
      celular: '',
      estado: 'Activa'
    })
  }

  const handleOpenModal = (mode, cliente = null) => {
    setModalMode(mode)
    if (mode === 'edit' && cliente) {
      setSelectedCliente(cliente)
      setFormData({
        razon_social: cliente.razon_social || '',
        numero_ruc: cliente.numero_ruc || '',
        direccion: cliente.direccion || '',
        email: cliente.email || '',
        celular: cliente.celular || '',
        estado: cliente.estado || 'Activa'
      })
    } else {
      resetFormData()
      setSelectedCliente(null)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setShowInfoModal(false)
    resetFormData()
    setSelectedCliente(null)
  }

  const handleShowInfo = (cliente) => {
    setSelectedCliente(cliente)
    setShowInfoModal(true)
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
    
    if (modalMode === 'create') {
      createCliente(formData)
    } else if (modalMode === 'edit') {
      updateCliente({
        id: selectedCliente.id_cliente,
        clienteData: formData
      })
    }
  }

  const handleDeactivate = (cliente) => {
    if (window.confirm(`¿Estás seguro de que deseas desactivar al cliente "${cliente.razon_social}"?`)) {
      deactivateCliente(cliente.id_cliente)
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Clientes</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleOpenModal('create')}
          disabled={isCreating}
        >
          <FaPlus className="me-2" />
          Agregar Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
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

      {/* Tabla de clientes */}
      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
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
                {filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                    </td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente) => (
                    <tr key={cliente.id_cliente}>
                      <td>{cliente.razon_social}</td>
                      <td>{cliente.numero_ruc}</td>
                      <td>{cliente.email}</td>
                      <td>
                        <span className={`badge ${cliente.estado === 'Activa' ? 'bg-success' : 'bg-danger'}`}>
                          {cliente.estado}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenModal('edit', cliente)}
                            disabled={isUpdating}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleShowInfo(cliente)}
                            title="Información"
                          >
                            <FaInfoCircle />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeactivate(cliente)}
                            disabled={isDeactivating || cliente.estado === 'Inactiva'}
                            title="Desactivar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar cliente */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === 'create' ? 'Agregar Nuevo Cliente' : 'Editar Cliente'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
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
                    <div className="col-12 mb-3">
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

                  {/* Mostrar errores */}
                  {(createError || updateError) && (
                    <div className="alert alert-danger mt-3">
                      {createError?.message || updateError?.message}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {modalMode === 'create' ? 'Creando...' : 'Actualizando...'}
                      </>
                    ) : (
                      modalMode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de información */}
      {showInfoModal && selectedCliente && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Información del Cliente</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Razón Social:</strong>
                    <p className="mb-0">{selectedCliente.razon_social}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>RUC:</strong>
                    <p className="mb-0">{selectedCliente.numero_ruc}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <strong>Dirección:</strong>
                    <p className="mb-0">{selectedCliente.direccion || 'No especificada'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Email:</strong>
                    <p className="mb-0">{selectedCliente.email}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Celular:</strong>
                    <p className="mb-0">{selectedCliente.celular}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Estado:</strong>
                    <p className="mb-0">
                      <span className={`badge ${selectedCliente.estado === 'Activa' ? 'bg-success' : 'bg-danger'}`}>
                        {selectedCliente.estado}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>ID Cliente:</strong>
                    <p className="mb-0">{selectedCliente.id_cliente}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleCloseModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop de los modales */}
      {(showModal || showInfoModal) && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  )
}

export default Clientes
