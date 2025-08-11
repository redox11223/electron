import { useState, useMemo } from 'react'
import { FaPlus, FaEdit, FaInfoCircle, FaTrash, FaSearch, FaArrowLeft } from 'react-icons/fa'
import { useProductsManagement, useUpdateProduct } from '../hooks/useProducts'

export const GestionProducto = ({ onVolver }) => {
  const { data: productos = [], isLoading, error } = useProductsManagement()
  const updateProductMutation = useUpdateProduct()
  
  const [searchTerm, setSearchTerm] = useState('')
  
  // Estados para notificaciones
  const [notifications, setNotifications] = useState([])
  
  // Estados para loading
  const [isSaving, setIsSaving] = useState(false)
  
  // Estados para validación
  const [validationErrors, setValidationErrors] = useState({})
  
  // Estados para modales
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Estados para el formulario de edición
  const [editForm, setEditForm] = useState({
    nombre_producto: '',
    modelo: '',
    descripcion: '',
    stock: 0,
    precio_compra: 0,
    precio_venta: 0,
    id_proveedor: '',
    id_categoria: '',
    categoria_nombre: ''
  })

  // Funciones para manejar notificaciones
  const showNotification = (message, type = 'success') => {
    const id = Date.now()
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      timestamp: new Date()
    }
    
    setNotifications(prev => [...prev, notification])
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 4000)
  }

  // Función para cerrar notificación manualmente
  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Obtener categorías únicas de los productos
  const categorias = useMemo(() => {
    const categoriasUnicas = [...new Set(productos
      .filter(p => p.nombre_categoria)
      .map(p => ({ id: p.id_categoria, nombre: p.nombre_categoria })))]
    return categoriasUnicas.filter((categoria, index, self) => 
      index === self.findIndex(c => c.id === categoria.id)
    )
  }, [productos])

  // Filtrar productos usando useMemo para optimizar
  const filteredProductos = useMemo(() => {
    if (!searchTerm.trim()) {
      return productos
    }
    return productos.filter(producto =>
      producto.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, productos])

  // Función para formatear precio
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A'
    return `S/ ${parseFloat(price).toFixed(2)}`
  }

  // Función para obtener el color del badge según el stock
  const getStockBadgeClass = (stock) => {
    if (stock === 0) return 'bg-danger'
    if (stock <= 5) return 'bg-warning'
    return 'bg-success'
  }

  // Función para obtener el texto del estado del stock
  const getStockStatus = (stock) => {
    if (stock === 0) return 'Sin stock'
    if (stock <= 5) return 'Stock bajo'
    return 'Disponible'
  }

  // Funciones para manejar modales
  const handleShowInfo = (producto) => {
    setSelectedProduct(producto)
    setShowInfoModal(true)
  }

  const handleShowEdit = (producto) => {
    setSelectedProduct(producto)
    setEditForm({
      nombre_producto: producto.nombre_producto || '',
      modelo: producto.modelo || '',
      descripcion: producto.descripcion || '',
      stock: producto.stock || 0,
      precio_compra: producto.precio_compra || 0,
      precio_venta: producto.precio_venta || 0,
      id_proveedor: producto.id_proveedor || '',
      id_categoria: producto.id_categoria || '',
      categoria_nombre: producto.nombre_categoria || ''
    })
    setShowEditModal(true)
  }

  const handleShowDelete = (producto) => {
    setSelectedProduct(producto)
    setShowDeleteModal(true)
  }

  const handleCloseModals = () => {
    setShowInfoModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedProduct(null)
    setValidationErrors({}) // Limpiar errores de validación
    setEditForm({
      nombre_producto: '',
      modelo: '',
      descripcion: '',
      stock: 0,
      precio_compra: 0,
      precio_venta: 0,
      id_proveedor: '',
      id_categoria: '',
      categoria_nombre: ''
    })
  }

  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveEdit = async () => {
    // Limpiar errores previos
    setValidationErrors({})
    
    // Objeto para recopilar errores de validación
    const errors = {}
    
    // Validación de campos requeridos
    if (!editForm.nombre_producto.trim()) {
      errors.nombre_producto = 'El nombre del producto es requerido'
    }
    
    if (!editForm.modelo.trim()) {
      errors.modelo = 'El modelo es requerido'
    }
    
    if (editForm.stock < 0) {
      errors.stock = 'El stock no puede ser negativo'
    }
    
    if (editForm.precio_compra <= 0) {
      errors.precio_compra = 'El precio de compra debe ser mayor a 0'
    }
    
    if (editForm.precio_venta <= 0) {
      errors.precio_venta = 'El precio de venta debe ser mayor a 0'
    }
    
    if (!editForm.id_categoria) {
      errors.id_categoria = 'Debe seleccionar una categoría'
    }

    // Si hay errores, mostrarlos y detener el proceso
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      showNotification('❌ Por favor corrige los errores en el formulario', 'error')
      return
    }

    setIsSaving(true)
    
    try {
      // Preparar datos para el guardado
      const productData = {
        id_producto: selectedProduct.id_producto,
        nombre_producto: editForm.nombre_producto.trim(),
        modelo: editForm.modelo.trim(),
        descripcion: editForm.descripcion.trim(),
        stock: parseInt(editForm.stock, 10),
        precio_compra: parseFloat(editForm.precio_compra),
        precio_venta: parseFloat(editForm.precio_venta),
        id_proveedor: editForm.id_proveedor || selectedProduct.id_proveedor,
        id_categoria: parseInt(editForm.id_categoria, 10)
      }

      console.log('Guardando cambios:', productData)
      
      // Usar la mutación real para actualizar el producto
      await updateProductMutation.mutateAsync(productData)
      
      showNotification('✅ Producto actualizado exitosamente', 'success')
      handleCloseModals()
      
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      showNotification(`❌ Error al actualizar producto: ${error.message}`, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSoftDelete = () => {
    // TODO: Implementar soft delete
    console.log('Soft delete del producto:', selectedProduct)
    
    // Simular soft delete exitoso
    setTimeout(() => {
      showNotification('🗑️ Producto eliminado exitosamente', 'success')
      handleCloseModals()
    }, 500)
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error al cargar productos: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-secondary me-3"
            onClick={onVolver}
            title="Volver"
          >
            <FaArrowLeft />
          </button>
          <h2 className="mb-0">Productos</h2>
        </div>
        
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
              placeholder="Buscar por nombre, modelo o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex justify-content-end">
          
          </div>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="row">
        <div className="col-12">
          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando productos...</span>
              </div>
              <p className="mt-2">Cargando productos...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Modelo</th>
                 
                    <th>Stock</th>
                    <th>Estado Stock</th>
                    <th>Precio Compra</th>
                    <th>Precio Venta</th>
                    
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProductos.length === 0 ? (
                    <tr>
                      <td colSpan="11" className="text-center py-4">
                        {productos.length === 0 
                          ? 'No hay productos registrados' 
                          : 'No se encontraron productos que coincidan con la búsqueda'
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredProductos.map((producto) => (
                      <tr key={producto.id_producto}>
                        <td className="fw-bold">{producto.id_producto}</td>
                        <td>{producto.nombre_producto || 'N/A'}</td>
                        <td>{producto.modelo || 'N/A'}</td>
                        
                        <td className="text-center">
                          <span className="fw-bold">
                            {producto.stock ?? 0}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getStockBadgeClass(producto.stock ?? 0)}`}>
                            {getStockStatus(producto.stock ?? 0)}
                          </span>
                        </td>
                        <td>{formatPrice(producto.precio_compra)}</td>
                        <td>{formatPrice(producto.precio_venta)}</td>
                      
                        <td>{producto.nombre_categoria || 'Sin categoría'}</td>
                       
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-outline-info btn-sm"
                              title="Ver información"
                              onClick={() => handleShowInfo(producto)}
                            >
                              <FaInfoCircle />
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm"
                              title="Editar producto"
                              onClick={() => handleShowEdit(producto)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              title="Eliminar producto"
                              onClick={() => handleShowDelete(producto)}
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
          )}
        </div>
      </div>

      {/* Información adicional */}
      {filteredProductos.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Resumen de Inventario</h6>
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border-end">
                      <h5 className="text-primary">{filteredProductos.length}</h5>
                      <small className="text-muted">Total Productos</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h5 className="text-success">
                        {filteredProductos.filter(p => (p.stock ?? 0) > 5).length}
                      </h5>
                      <small className="text-muted">En Stock</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-end">
                      <h5 className="text-warning">
                        {filteredProductos.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length}
                      </h5>
                      <small className="text-muted">Stock Bajo</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <h5 className="text-danger">
                      {filteredProductos.filter(p => (p.stock ?? 0) === 0).length}
                    </h5>
                    <small className="text-muted">Sin Stock</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leyenda de Stock */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title mb-3">
                <FaInfoCircle className="me-2" />
                Leyenda de Estado de Stock
              </h6>
              <div className="mb-2">
                <div className="d-flex align-items-center">
                  <small className="text-muted me-2">Stock = 0</small>
                  <span className="badge bg-danger me-2">Sin stock</span>
                  
                </div>
              </div>

              <div className="mb-2">
                <div className="d-flex align-items-center">
                  
                  <small className="text-muted me-2">Stock ≤ 5</small>
                  <span className="badge bg-warning me-2">Stock bajo</span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="d-flex align-items-center">
                 
                  <small className="text-muted me-2">Stock {'>'} 5</small>
                   <span className="badge bg-success me-2">Disponible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Información */}
      {showInfoModal && selectedProduct && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaInfoCircle className="me-2" />
                  Información del Producto
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>ID:</strong> {selectedProduct.id_producto}
                    </div>
                    <div className="mb-3">
                      <strong>Nombre del Producto:</strong> {selectedProduct.nombre_producto || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Modelo:</strong> {selectedProduct.modelo || 'N/A'}
                    </div>
                    <div className="mb-3">
                      <strong>Precio de Compra:</strong> {formatPrice(selectedProduct.precio_compra)}
                    </div>
                    <div className="mb-3">
                      <strong>Precio de Venta:</strong> {formatPrice(selectedProduct.precio_venta)}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <strong>Stock:</strong> 
                      <span className={`badge ms-2 ${getStockBadgeClass(selectedProduct.stock ?? 0)}`}>
                        {selectedProduct.stock ?? 0} - {getStockStatus(selectedProduct.stock ?? 0)}
                      </span>
                    </div>
                    <div className="mb-3">
                      <strong>Proveedor:</strong> {selectedProduct.proveedor_nombre || 'Sin proveedor'}
                    </div>
                    <div className="mb-3">
                      <strong>Categoría:</strong> {selectedProduct.nombre_categoria || 'Sin categoría'}
                    </div>
                    
                  </div>
                  <div className="col-12">
                    <div className="mb-3">
                      <strong>Descripción:</strong>
                      <p className="mt-2">{selectedProduct.descripcion || 'Sin descripción disponible'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedProduct && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaEdit className="me-2" />
                  Editar Producto
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModals}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nombre del Producto *</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.nombre_producto ? 'is-invalid' : ''}`}
                          name="nombre_producto"
                          value={editForm.nombre_producto}
                          onChange={handleEditFormChange}
                          required
                        />
                        {validationErrors.nombre_producto && (
                          <div className="invalid-feedback">
                            {validationErrors.nombre_producto}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Modelo *</label>
                        <input
                          type="text"
                          className={`form-control ${validationErrors.modelo ? 'is-invalid' : ''}`}
                          name="modelo"
                          value={editForm.modelo}
                          onChange={handleEditFormChange}
                          required
                        />
                        {validationErrors.modelo && (
                          <div className="invalid-feedback">
                            {validationErrors.modelo}
                          </div>
                        )}
                      </div>
                     
                      <div className="mb-3">
                        <label className="form-label">Categoría *</label>
                        <select
                          className={`form-select ${validationErrors.id_categoria ? 'is-invalid' : ''}`}
                          name="id_categoria"
                          value={editForm.id_categoria || ''}
                          onChange={(e) => {
                            const selectedId = e.target.value
                            const categoria = categorias.find(c => c.id.toString() === selectedId)
                            setEditForm(prev => ({
                              ...prev,
                              id_categoria: selectedId,
                              categoria_nombre: categoria ? categoria.nombre : ''
                            }))
                          }}
                        >
                          <option value="">Selecciona una categoría</option>
                          {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nombre}
                            </option>
                          ))}
                        </select>
                        {validationErrors.id_categoria && (
                          <div className="invalid-feedback">
                            {validationErrors.id_categoria}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Stock *</label>
                        <input
                          type="number"
                          className={`form-control ${validationErrors.stock ? 'is-invalid' : ''}`}
                          name="stock"
                          value={editForm.stock}
                          onChange={handleEditFormChange}
                          min="0"
                          required
                        />
                        {validationErrors.stock && (
                          <div className="invalid-feedback">
                            {validationErrors.stock}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Precio de Compra *</label>
                        <input
                          type="number"
                          className={`form-control ${validationErrors.precio_compra ? 'is-invalid' : ''}`}
                          name="precio_compra"
                          value={editForm.precio_compra}
                          onChange={handleEditFormChange}
                          min="0"
                          step="0.01"
                          required
                        />
                        {validationErrors.precio_compra && (
                          <div className="invalid-feedback">
                            {validationErrors.precio_compra}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Precio de Venta *</label>
                        <input
                          type="number"
                          className={`form-control ${validationErrors.precio_venta ? 'is-invalid' : ''}`}
                          name="precio_venta"
                          value={editForm.precio_venta}
                          onChange={handleEditFormChange}
                          min="0"
                          step="0.01"
                          required
                        />
                        {validationErrors.precio_venta && (
                          <div className="invalid-feedback">
                            {validationErrors.precio_venta}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          name="descripcion"
                          value={editForm.descripcion}
                          onChange={handleEditFormChange}
                          rows="3"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals} disabled={isSaving}>
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && selectedProduct && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <FaTrash className="me-2" />
                  Confirmar Eliminación
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModals}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <strong>¿Estás seguro de que deseas eliminar este producto?</strong>
                </div>
                <p>
                  <strong>Producto:</strong> {selectedProduct.nombre_producto}
                  <br />
                  <strong>Modelo:</strong> {selectedProduct.modelo || 'N/A'}
                  <br />
                  <strong>Stock actual:</strong> {selectedProduct.stock ?? 0}
                </p>
                <div className="alert alert-info">
                  <small>
                    <FaInfoCircle className="me-1" />
                    El producto será marcado como eliminado pero se mantendrá en la base de datos por motivos de auditoría.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModals}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={handleSoftDelete}>
                  Eliminar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop para modales */}
      {(showInfoModal || showEditModal || showDeleteModal) && (
        <div className="modal-backdrop fade show" onClick={handleCloseModals}></div>
      )}

      {/* Contenedor de Notificaciones Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1060 }}>
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`toast show align-items-center text-bg-${
              notification.type === 'error' ? 'danger' : 
              notification.type === 'warning' ? 'warning' : 
              notification.type === 'info' ? 'info' : 'success'
            } border-0`}
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                <div className="d-flex align-items-center">
                  <span className="me-2">
                    {notification.type === 'success' && '✅'}
                    {notification.type === 'error' && '❌'}
                    {notification.type === 'warning' && '⚠️'}
                    {notification.type === 'info' && 'ℹ️'}
                  </span>
                  {notification.message}
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                aria-label="Close"
                onClick={() => closeNotification(notification.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
