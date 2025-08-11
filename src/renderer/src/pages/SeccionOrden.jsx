
import { useState, useEffect, useMemo, useRef } from 'react'
import { FaArrowLeft, FaSearch, FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { useProductsManagement } from '../hooks/useProducts'
import { useProveedores } from '../hooks/useProveedores'
import { useCompras } from '../hooks/useCompras'

export const SeccionOrden = ({ onVolver }) => {
  const { data: productos = [], isLoading: loadingProducts } = useProductsManagement()
  const { proveedores, isLoading: loadingProveedores } = useProveedores()
  const { createCompra, isCreating, createError, isCreateSuccess } = useCompras()
  
  // CSS para ocultar spinners de inputs numéricos
  const numberInputStyle = `
    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input[type=number] {
      -moz-appearance: textfield;
    }
  `
  
  // Referencias para dropdowns
  const proveedorDropdownRef = useRef(null)
  const productDropdownRef = useRef(null)
  const categoriaDropdownRef = useRef(null)
  
  // Estado para el formulario de producto individual
  const [formData, setFormData] = useState({
    nombre_producto: '',
    modelo: '',
    descripcion: '',
    cantidad: '',
    precio_unitario: '',
    categoria: '',
    id_categoria: ''
  })
  
  // Estado para la orden completa
  const [ordenData, setOrdenData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    id_proveedor: '',
    proveedor_nombre: '', // Para mostrar el nombre del proveedor seleccionado
    productos: [] // Array de productos agregados a la orden
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [editingIndex, setEditingIndex] = useState(-1) // -1 = nuevo producto, >= 0 = editando

  // Estados para búsqueda de proveedores
  const [proveedorSearchTerm, setProveedorSearchTerm] = useState('')
  const [showProveedorSuggestions, setShowProveedorSuggestions] = useState(false)
  const [selectedProveedor, setSelectedProveedor] = useState(null)

  // Estados para búsqueda de categorías
  const [categoriaSearchTerm, setCategoriaSearchTerm] = useState('')
  const [showCategoriaSuggestions, setShowCategoriaSuggestions] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState(null)

  // Filtrar productos basado en el término de búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return []
    
    return productos.filter(producto =>
      producto.nombre_producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.modelo?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
  }, [productos, searchTerm])

  // Filtrar proveedores basado en el término de búsqueda
  const filteredProveedores = useMemo(() => {
    if (!proveedorSearchTerm.trim()) return []
    
    return proveedores.filter(proveedor =>
      proveedor.razon_social?.toLowerCase().includes(proveedorSearchTerm.toLowerCase()) ||
      proveedor.numero_ruc?.includes(proveedorSearchTerm)
    ).slice(0, 5)
  }, [proveedores, proveedorSearchTerm])

  // Obtener categorías únicas de los productos
  const categorias = useMemo(() => {
    if (!productos.length) return []
    
    const categoriasMap = new Map()
    
    productos.forEach(producto => {
      if (producto.nombre_categoria && producto.id_categoria) {
        categoriasMap.set(producto.id_categoria, {
          id: producto.id_categoria,
          nombre: producto.nombre_categoria
        })
      }
    })
    
    return Array.from(categoriasMap.values())
  }, [productos])

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategorias = useMemo(() => {
    if (!categoriaSearchTerm.trim()) return []
    
    return categorias.filter(categoria =>
      categoria.nombre?.toLowerCase().includes(categoriaSearchTerm.toLowerCase())
    ).slice(0, 5)
  }, [categorias, categoriaSearchTerm])

  // Calcular total de la orden
  const totalOrden = useMemo(() => {
    return ordenData.productos.reduce((sum, prod) => 
      sum + (parseFloat(prod.precio_unitario || 0) * parseInt(prod.cantidad || 0)), 0
    )
  }, [ordenData.productos])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleOrdenInputChange = (e) => {
    const { name, value } = e.target
    setOrdenData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProductSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setFormData(prev => ({
      ...prev,
      nombre_producto: value
    }))
    setShowSuggestions(value.length > 0)
    
    // Limpiar selección si el usuario modifica el texto
    if (selectedProduct && selectedProduct.nombre_producto !== value) {
      setSelectedProduct(null)
      setFormData(prev => ({
        ...prev,
        modelo: '',
        descripcion: '',
        precio_unitario: ''
      }))
    }
  }

  const handleProductSelect = (producto) => {
    setSelectedProduct(producto)
    setSearchTerm(producto.nombre_producto)
    setFormData(prev => ({
      ...prev,
      nombre_producto: producto.nombre_producto,
      modelo: producto.modelo || '',
      descripcion: producto.descripcion || '',
      precio_unitario: producto.precio_unitario || '',
      categoria: producto.nombre_categoria || '',
      id_categoria: producto.id_categoria || ''
    }))
    setShowSuggestions(false)
    
    // También actualizar la categoría si el producto la tiene
    if (producto.nombre_categoria) {
      setCategoriaSearchTerm(producto.nombre_categoria)
      setSelectedCategoria({
        id: producto.id_categoria,
        nombre: producto.nombre_categoria
      })
    }
  }

  // Funciones para manejar proveedores
  const handleProveedorSearch = (e) => {
    const value = e.target.value
    setProveedorSearchTerm(value)
    setOrdenData(prev => ({
      ...prev,
      proveedor_nombre: value
    }))
    setShowProveedorSuggestions(value.length > 0)
    
    // Limpiar selección si el usuario modifica el texto
    if (selectedProveedor && selectedProveedor.razon_social !== value) {
      setSelectedProveedor(null)
      setOrdenData(prev => ({
        ...prev,
        id_proveedor: ''
      }))
    }
  }

  const handleProveedorSelect = (proveedor) => {
    setSelectedProveedor(proveedor)
    setProveedorSearchTerm(proveedor.razon_social)
    setOrdenData(prev => ({
      ...prev,
      id_proveedor: proveedor.id_proveedor,
      proveedor_nombre: proveedor.razon_social
    }))
    setShowProveedorSuggestions(false)
  }

  // Funciones para manejar categorías
  const handleCategoriaSearch = (e) => {
    const value = e.target.value
    setCategoriaSearchTerm(value)
    setFormData(prev => ({
      ...prev,
      categoria: value
    }))
    setShowCategoriaSuggestions(value.length > 0)
    
    // Limpiar selección si el usuario modifica el texto
    if (selectedCategoria && selectedCategoria.nombre !== value) {
      setSelectedCategoria(null)
      setFormData(prev => ({
        ...prev,
        id_categoria: ''
      }))
    }
  }

  const handleCategoriaSelect = (categoria) => {
    setSelectedCategoria(categoria)
    setCategoriaSearchTerm(categoria.nombre)
    setFormData(prev => ({
      ...prev,
      categoria: categoria.nombre,
      id_categoria: categoria.id
    }))
    setShowCategoriaSuggestions(false)
  }

  const resetFormData = () => {
    setFormData({
      nombre_producto: '',
      modelo: '',
      descripcion: '',
      cantidad: '',
      precio_unitario: '',
      categoria: '',
      id_categoria: ''
    })
    setSearchTerm('')
    setSelectedProduct(null)
    setCategoriaSearchTerm('')
    setSelectedCategoria(null)
    setEditingIndex(-1)
  }

  const handleAddProduct = (e) => {
    e.preventDefault()
    
    // Validación
    if (!formData.nombre_producto || !formData.cantidad || !formData.precio_unitario) {
      alert('Nombre del producto, cantidad y precio unitario son obligatorios')
      return
    }

    const nuevoProducto = {
      id_producto: selectedProduct?.id_producto || null,
      nombre_producto: formData.nombre_producto,
      modelo: formData.modelo,
      descripcion: formData.descripcion,
      cantidad: parseInt(formData.cantidad),
      precio_unitario: parseFloat(formData.precio_unitario),
      categoria: formData.categoria,
      id_categoria: formData.id_categoria || null,
      es_producto_nuevo: !selectedProduct,
      es_categoria_nueva: !selectedCategoria && formData.categoria.trim() !== ''
    }

    if (editingIndex >= 0) {
      // Editando producto existente
      const nuevosProductos = [...ordenData.productos]
      nuevosProductos[editingIndex] = nuevoProducto
      setOrdenData(prev => ({ ...prev, productos: nuevosProductos }))
    } else {
      // Agregando nuevo producto
      setOrdenData(prev => ({
        ...prev,
        productos: [...prev.productos, nuevoProducto]
      }))
    }

    resetFormData()
  }

  const handleEditProduct = (index) => {
    const producto = ordenData.productos[index]
    setFormData({
      nombre_producto: producto.nombre_producto,
      modelo: producto.modelo || '',
      descripcion: producto.descripcion || '',
      cantidad: producto.cantidad.toString(),
      precio_unitario: producto.precio_unitario.toString(),
      categoria: producto.categoria || '',
      id_categoria: producto.id_categoria || ''
    })
    setSearchTerm(producto.nombre_producto)
    setCategoriaSearchTerm(producto.categoria || '')
    setEditingIndex(index)
    
    // Si es un producto existente, marcarlo como seleccionado
    if (producto.id_producto) {
      const productoExistente = productos.find(p => p.id_producto === producto.id_producto)
      setSelectedProduct(productoExistente)
    }
    
    // Si tiene categoría, marcarla como seleccionada
    if (producto.categoria && producto.id_categoria) {
      setSelectedCategoria({
        id: producto.id_categoria,
        nombre: producto.categoria
      })
    }
  }

  const handleRemoveProduct = (index) => {
    const nuevosProductos = ordenData.productos.filter((_, i) => i !== index)
    setOrdenData(prev => ({ ...prev, productos: nuevosProductos }))
    
    // Si estamos editando este producto, resetear el formulario
    if (editingIndex === index) {
      resetFormData()
    }
  }

  const handleSubmitOrden = async () => {
    // Validación
    if (!ordenData.id_proveedor) {
      alert('Debe seleccionar un proveedor')
      return
    }
    
    if (ordenData.productos.length === 0) {
      alert('Debe agregar al menos un producto a la orden')
      return
    }

    // Obtener usuario actual (esto debería venir del contexto de usuario)
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    
    const compraData = {
      fecha: ordenData.fecha,
      estado: 'PENDIENTE',
      id_proveedor: parseInt(ordenData.id_proveedor),
      id_usuario: userData.id_usuario || 1 // Fallback temporal
    }

    createCompra({ compraData, productos: ordenData.productos })
  }

  // Efectos para manejar éxito y errores
  useEffect(() => {
    if (isCreateSuccess) {
      alert('Orden creada exitosamente!')
      onVolver()
    }
  }, [isCreateSuccess, onVolver])

  useEffect(() => {
    if (createError) {
      alert(`Error al crear la orden: ${createError.message}`)
    }
  }, [createError])

  // Manejar clic fuera para cerrar sugerencias
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (proveedorDropdownRef.current && !proveedorDropdownRef.current.contains(event.target)) {
        setShowProveedorSuggestions(false)
      }
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
      if (categoriaDropdownRef.current && !categoriaDropdownRef.current.contains(event.target)) {
        setShowCategoriaSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div>
      <style>{`
        .hover-bg-light:hover {
          background-color: #f8f9fa !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        
        /* Ocultar spinners de inputs numéricos */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-secondary me-3"
            onClick={onVolver}
          >
            <FaArrowLeft className="me-2" />
            
          </button>
          <h2>Nueva Orden de Compra</h2>
        </div>
      </div>
      
      <div className="row">
        {/* Información de la orden */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Información de la Orden</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="fecha" className="form-label">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  id="fecha"
                  name="fecha"
                  value={ordenData.fecha}
                  onChange={handleOrdenInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="id_proveedor" className="form-label">Proveedor *</label>
                <div className="position-relative" ref={proveedorDropdownRef}>
                  <input
                    type="text"
                    id="id_proveedor"
                    className={`form-control ${ordenData.id_proveedor ? 'is-valid' : ''}`}
                    placeholder="Buscar proveedor..."
                    value={proveedorSearchTerm}
                    onChange={handleProveedorSearch}
                    onFocus={() => setShowProveedorSuggestions(proveedorSearchTerm.length > 0)}
                    required
                  />
                  {showProveedorSuggestions && filteredProveedores.length > 0 && (
                    <div 
                      className="position-absolute top-100 start-0 w-100 bg-white border rounded-bottom shadow-sm" 
                      style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}
                    >
                      {filteredProveedores.map((proveedor) => (
                        <div
                          key={proveedor.id_proveedor}
                          className="px-3 py-2 border-bottom"
                          onClick={() => handleProveedorSelect(proveedor)}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <div className="fw-bold">{proveedor.razon_social}</div>
                          <small className="text-muted">{proveedor.email} - {proveedor.telefono}</small>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {loadingProveedores && (
                  <small className="text-muted">Cargando proveedores...</small>
                )}
              </div>

              <div className="border-top pt-3">
                <div className="row">
                  <div className="col-6">
                    <strong>Total productos:</strong>
                    <div className="fs-4 text-primary">{ordenData.productos.length}</div>
                  </div>
                  <div className="col-6">
                    <strong>Total orden:</strong>
                    <div className="fs-4 text-success">S/ {totalOrden.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-success w-100 mt-3" 
                onClick={handleSubmitOrden}
                disabled={isCreating || ordenData.productos.length === 0}
              >
                {isCreating && (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                )}
                Crear Orden de Compra
              </button>
            </div>
          </div>
        </div>

        {/* Formulario de producto */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                {editingIndex >= 0 ? 'Editar Producto' : 'Agregar Producto'}
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddProduct}>
                <div className="row">
                  {/* Campo de búsqueda de producto */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombre_producto" className="form-label">
                      <FaSearch className="me-2" />
                      Nombre del Producto *
                    </label>
                    <div className="position-relative" ref={productDropdownRef}>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre_producto"
                        name="nombre_producto"
                        value={formData.nombre_producto}
                        onChange={handleProductSearch}
                        placeholder="Buscar producto por nombre..."
                        required
                        autoComplete="off"
                      />
                      
                      {/* Dropdown de sugerencias */}
                      {showSuggestions && filteredProducts.length > 0 && (
                        <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                          {loadingProducts ? (
                            <div className="p-3 text-center">
                              <div className="spinner-border spinner-border-sm" role="status"></div>
                              <span className="ms-2">Cargando productos...</span>
                            </div>
                          ) : (
                            filteredProducts.map((producto) => (
                              <div
                                key={producto.id_producto}
                                className="p-2 border-bottom cursor-pointer hover-bg-light"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleProductSelect(producto)}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                <div className="fw-semibold">{producto.nombre_producto}</div>
                                <small className="text-muted">
                                  Modelo: {producto.modelo || 'N/A'} 
                                 
                                </small>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                      
                      {showSuggestions && filteredProducts.length === 0 && searchTerm.length > 0 && !loadingProducts && (
                        <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-3 text-center text-muted" style={{ zIndex: 1000 }}>
                          No se encontraron productos. Se creará como producto nuevo.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Campo de modelo */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="modelo" className="form-label">Modelo del Producto</label>
                    <input
                      type="text"
                      className="form-control"
                      id="modelo"
                      name="modelo"
                      value={formData.modelo}
                      onChange={handleInputChange}
                      placeholder="Modelo del producto"
                    />
                  </div>

                  {/* Campo de descripción */}
                  <div className="col-12 mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción del Producto</label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="Descripción detallada del producto..."
                      rows="2"
                    />
                  </div>

                  {/* Campo de categoría */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="categoria" className="form-label">Categoría</label>
                    <div className="position-relative" ref={categoriaDropdownRef}>
                      <input
                        type="text"
                        className="form-control"
                        id="categoria"
                        name="categoria"
                        value={categoriaSearchTerm}
                        onChange={handleCategoriaSearch}
                        placeholder="Buscar categoría o escribir nueva..."
                        autoComplete="off"
                      />
                      
                      {/* Dropdown de sugerencias de categorías */}
                      {showCategoriaSuggestions && filteredCategorias.length > 0 && (
                        <div 
                          className="position-absolute w-100 bg-white border border-top-0 shadow-sm" 
                          style={{ zIndex: 1000, maxHeight: '150px', overflowY: 'auto' }}
                        >
                          {filteredCategorias.map((categoria) => (
                            <div
                              key={categoria.id}
                              className="p-2 border-bottom cursor-pointer hover-bg-light"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleCategoriaSelect(categoria)}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              <div className="fw-semibold">{categoria.nombre}</div>
                              <small className="text-muted">Categoría existente</small>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Mensaje cuando no hay categorías coincidentes */}
                      {showCategoriaSuggestions && filteredCategorias.length === 0 && categoriaSearchTerm.length > 0 && (
                        <div 
                          className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-3 text-center text-muted" 
                          style={{ zIndex: 1000 }}
                        >
                          <div className="fw-semibold text-success">Nueva categoría: "{categoriaSearchTerm}"</div>
                          <small>Se creará como categoría nueva</small>
                        </div>
                      )}
                    </div>
                    
                    {/* Indicador de categoría seleccionada */}
                    {selectedCategoria && (
                      <small className="text-success">
                        ✓ Categoría existente seleccionada: {selectedCategoria.nombre}
                      </small>
                    )}
                    
                    {/* Indicador de nueva categoría */}
                    {!selectedCategoria && categoriaSearchTerm.trim() && (
                      <small className="text-warning">
                        ⚠ Se creará nueva categoría: "{categoriaSearchTerm.trim()}"
                      </small>
                    )}
                  </div>

                  {/* Precio unitario y cantidad */}
                  <div className="col-md-3 mb-3">
                    <label htmlFor="precio_unitario" className="form-label">Precio Unitario *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      id="precio_unitario"
                      name="precio_unitario"
                      value={formData.precio_unitario}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      required
                      style={{ appearance: 'textfield' }}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad *</label>
                    <input
                      type="number"
                      className="form-control"
                      id="cantidad"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                      placeholder="Cantidad"
                      min="1"
                      style={{ appearance: 'textfield' }}
                      onWheel={(e) => e.target.blur()}
                      required
                    />
                  </div>
                </div>

                {/* Información del producto seleccionado */}
                {selectedProduct && (
                  <div className="alert alert-info">
                    <h6 className="alert-heading">Producto Existente Seleccionado:</h6>
                    <div className="row">
                      <div className="col-md-3">
                        <strong>Nombre:</strong> {selectedProduct.nombre_producto}
                      </div>
                      <div className="col-md-2">
                        <strong>Modelo:</strong> {selectedProduct.modelo || 'N/A'}
                      </div>
                      <div className="col-md-2">
                        <strong>Stock:</strong> {selectedProduct.stock || 0}
                      </div>
                      <div className="col-md-3">
                        <strong>Precio de Compra Anterior:</strong> S/{selectedProduct.precio_compra || 'N/A'}
                      </div>
                      <div className="col-md-2">
                        <strong>Categoría:</strong> {selectedProduct.nombre_categoria || 'Sin categoría'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones del formulario */}
                <div className="d-flex justify-content-end gap-2">
                  {editingIndex >= 0 && (
                    <button type="button" className="btn btn-secondary" onClick={resetFormData}>
                      Cancelar
                    </button>
                  )}
                  <button type="submit" className="btn " style={{ backgroundColor: '#8B45FF', color: '#fff' }}>
                    <FaPlus className="me-2" />
                    {editingIndex >= 0 ? 'Guardar Cambios' : 'Agregar Producto'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Lista de productos agregados */}
          {ordenData.productos.length > 0 && (
            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">Productos en la Orden ({ordenData.productos.length})</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Producto</th>
                        <th>Modelo</th>
                        
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordenData.productos.map((producto, index) => (
                        <tr key={index}>
                          <td>{producto.nombre_producto}</td>
                          <td>{producto.modelo || '-'}</td>
                          <td>{producto.cantidad}</td>
                          <td>S/ {producto.precio_unitario.toFixed(2)}</td>
                          <td className="fw-bold">S/ {(producto.precio_unitario * producto.cantidad).toFixed(2)}</td>
                          <td>
                            <span className={`badge ${producto.es_producto_nuevo ? 'bg-warning' : 'bg-success'}`}>
                              {producto.es_producto_nuevo ? 'Nuevo' : 'Existente'}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-outline-primary"
                                onClick={() => handleEditProduct(index)}
                                title="Editar"
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleRemoveProduct(index)}
                                title="Eliminar"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
