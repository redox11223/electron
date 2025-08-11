import { useState, useMemo } from 'react'
import { FaInfoCircle, FaPlus, FaTrash, FaSearch } from 'react-icons/fa'
import { SeccionOrden } from './SeccionOrden'
import { GestionProducto } from './GestionProducto'
import { useCompras } from '../hooks/useCompras'
import { useProveedores } from '../hooks/useProveedores'

export const Inventario = () => {
  const [showNuevaOrden, setShowNuevaOrden] = useState(false)
  const [showGestionProducto, setShowGestionProducto] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProveedor, setSelectedProveedor] = useState('')
  const [selectedEstado, setSelectedEstado] = useState('')

  // Estados para modales
  const [showDetalleModal, setShowDetalleModal] = useState(false)
  const [showEstadoModal, setShowEstadoModal] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState(null)
  const [newEstado, setNewEstado] = useState('PENDIENTE')

  // Hooks para obtener datos
  const { compras, isLoading: loadingCompras, updateEstado, isUpdatingEstado, useCompraById } = useCompras()
  const { proveedores, isLoading: loadingProveedores } = useProveedores()

  // Hook para obtener detalles de compra específica
  const { data: compraDetalle, isLoading: loadingDetalle } = useCompraById(selectedCompra?.id_compra)

  const handleNuevaOrden = () => {
    setShowNuevaOrden(true)
  }

  const handleVolverInventario = () => {
    setShowNuevaOrden(false)
  }

  const handleGestionProducto = () => {
    setShowGestionProducto(true)
  }

  const handleVolverDesdeGestion = () => {
    setShowGestionProducto(false)
  }

  // Filtrar compras basado en los criterios de búsqueda
  const filteredCompras = useMemo(() => {
    if (!compras) return []

    return compras.filter(compra => {
      const matchesSearch = searchTerm === '' ||
        compra.id_compra.toString().includes(searchTerm) ||
        (compra.proveedor_nombre && compra.proveedor_nombre.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesProveedor = selectedProveedor === '' || compra.id_proveedor.toString() === selectedProveedor

      const matchesEstado = selectedEstado === '' || compra.estado.toLowerCase() === selectedEstado.toLowerCase()

      return matchesSearch && matchesProveedor && matchesEstado
    })
  }, [compras, searchTerm, selectedProveedor, selectedEstado])

  // Función para obtener el color del badge según el estado
  const getEstadoBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente': return 'bg-warning'
      case 'completada': return 'bg-success'
      case 'cancelada': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('es-PE')
  }

  // Función para formatear monto
  const formatAmount = (amount) => {
    if (!amount) return 'S/ 0.00'
    return `S/ ${parseFloat(amount).toFixed(2)}`
  }

  // Funciones para manejar modales
  const handleShowDetalle = (compra) => {
    setSelectedCompra(compra)
    setShowDetalleModal(true)
  }

  const handleShowEstado = (compra) => {
    setSelectedCompra(compra)
    setNewEstado(compra.estado || 'PENDIENTE')
    setShowEstadoModal(true)
  }

  const handleCloseModals = () => {
    setShowDetalleModal(false)
    setShowEstadoModal(false)
    setSelectedCompra(null)
    setNewEstado('PENDIENTE')
  }

  const handleUpdateEstado = () => {
    if (selectedCompra && newEstado !== selectedCompra.estado) {
      updateEstado({
        id: selectedCompra.id_compra,
        estado: newEstado
      })
      handleCloseModals()
    }
  }

  // Si está en modo nueva orden, mostrar SeccionOrden
  if (showNuevaOrden) {
    return <SeccionOrden onVolver={handleVolverInventario} />
  }

  // Si está en modo gestión de productos, mostrar GestionProducto
  if (showGestionProducto) {
    return <GestionProducto onVolver={handleVolverDesdeGestion} />
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Control de Stock</h2>
        <div>
          <button
            className="btn" style={{ backgroundColor: '#8B45FF', color: '#fff' ,marginRight: '20px'}}
            onClick={handleNuevaOrden}
          >
            <FaPlus className="me-2" />
            Nueva Orden
          </button>
          <button
            className="btn" style={{ backgroundColor: '#8B45FF', color: '#fff',marginRight: '20px' }}
            onClick={handleGestionProducto}
          >
            Gestión de Productos
          </button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">
            <FaSearch className="me-2" />
            Buscar Orden
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="ID de orden o proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Proveedor</label>
          <select
            className="form-select"
            value={selectedProveedor}
            onChange={(e) => setSelectedProveedor(e.target.value)}
          >
            <option value="">Todos los proveedores</option>
            {proveedores?.map((proveedor) => (
              <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                {proveedor.razon_social}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          {loadingCompras ? (
            <div className="text-center py-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID Orden</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Monto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompras.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      {compras?.length === 0 ? 'No hay órdenes registradas' : 'No se encontraron órdenes que coincidan con los filtros'}
                    </td>
                  </tr>
                ) : (
                  filteredCompras.map((compra) => (
                    <tr key={compra.id_compra}>
                      <td>{compra.id_compra}</td>
                      <td>
                        <span className={`badge ${getEstadoBadgeClass(compra.estado)}`}>
                          {compra.estado || 'Sin estado'}
                        </span>
                      </td>
                      <td>{formatDate(compra.fecha)}</td>
                      <td>{compra.proveedor_nombre || 'Proveedor no disponible'}</td>
                      <td>{formatAmount(compra.monto)}</td>
                      <td>
                        <button
                          className="btn btn-outline-info btn-sm me-2"
                          onClick={() => handleShowDetalle(compra)}
                          title="Ver detalles"
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleShowEstado(compra)}
                          disabled={isUpdatingEstado}
                        >
                          {isUpdatingEstado ? 'Actualizando...' : 'Cambiar estado'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal de Detalles de la Orden */}
      {showDetalleModal && selectedCompra && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles de la Orden #{selectedCompra.id_compra}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="text-primary">Información General</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>ID Orden:</strong></td>
                          <td>{selectedCompra.id_compra}</td>
                        </tr>
                        <tr>
                          <td><strong>Fecha:</strong></td>
                          <td>{formatDate(selectedCompra.fecha)}</td>
                        </tr>
                        <tr>
                          <td><strong>Estado:</strong></td>
                          <td>
                            <span className={`badge ${getEstadoBadgeClass(selectedCompra.estado)}`}>
                              {selectedCompra.estado || 'Sin estado'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Cantidad Total:</strong></td>
                          <td>{selectedCompra.cantidad || 'N/A'} unidades</td>
                        </tr>
                        <tr>
                          <td><strong>Monto Total:</strong></td>
                          <td className="fw-bold text-success">{formatAmount(selectedCompra.monto)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-primary">Información del Proveedor</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Proveedor:</strong></td>
                          <td>{selectedCompra.proveedor_nombre || 'No disponible'}</td>
                        </tr>
                        <tr>
                          <td><strong>ID Proveedor:</strong></td>
                          <td>{selectedCompra.id_proveedor}</td>
                        </tr>
                      </tbody>
                    </table>

                    <h6 className="text-primary mt-3">Información del Usuario</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Usuario:</strong></td>
                          <td>
                            {selectedCompra.usuario_nombre && selectedCompra.usuario_apellido
                              ? `${selectedCompra.usuario_nombre} ${selectedCompra.usuario_apellido}`
                              : 'No disponible'
                            }
                          </td>
                        </tr>
                        <tr>
                          <td><strong>ID Usuario:</strong></td>
                          <td>{selectedCompra.id_usuario}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sección de Productos */}
                <div className="row mt-4">
                  <div className="col-12">
                    <h6 className="text-primary">Productos de la Orden</h6>
                    {loadingDetalle ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando productos...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-sm table-striped">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Modelo</th>
                              <th>Cantidad</th>
                              <th>Precio Unitario</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {compraDetalle?.detalles && compraDetalle.detalles.length > 0 ? (
                              compraDetalle.detalles.map((detalle, index) => (
                                <tr key={index}>
                                  <td>
                                    {detalle.producto_nombre || detalle.producto_solicitado_nombre || 'N/A'}
                                  </td>
                                  <td>
                                    {detalle.producto_modelo || detalle.producto_solicitado_modelo || 'N/A'}
                                  </td>
                                  <td className="text-center">{detalle.unidades}</td>
                                  <td>{formatAmount(detalle.precio_unitario)}</td>
                                  <td className="fw-bold">{formatAmount(detalle.precio_unitario * detalle.unidades)}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center py-3">
                                  No se encontraron productos para esta orden
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModals}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cambio de Estado */}
      {showEstadoModal && selectedCompra && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Estado - Orden #{selectedCompra.id_compra}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Estado Actual:</label>
                  <div>
                    <span className={`badge ${getEstadoBadgeClass(selectedCompra.estado)} fs-6`}>
                      {selectedCompra.estado || 'Sin estado'}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="nuevoEstado" className="form-label">Nuevo Estado:</label>
                  <select
                    id="nuevoEstado"
                    className="form-select"
                    value={newEstado}
                    onChange={(e) => setNewEstado(e.target.value)}
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>

                {newEstado !== selectedCompra.estado && (
                  <div className="alert alert-info">
                    <small>
                      <strong>Cambio:</strong> {selectedCompra.estado || 'Sin estado'} → {newEstado}
                    </small>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModals}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateEstado}
                  disabled={isUpdatingEstado || newEstado === selectedCompra.estado}
                >
                  {isUpdatingEstado ? 'Actualizando...' : 'Confirmar Cambio'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
