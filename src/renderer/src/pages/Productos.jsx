


import '../assets/productos.css'
import { useState, useMemo } from 'react'
import { useProducts, useRefreshProducts } from '../hooks/useProducts'
import { ClienteSearch } from '../components/ClienteSearch'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const Productos = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('nombre_producto')
  const [priceRange, setPriceRange] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [isProcessingVenta, setIsProcessingVenta] = useState(false)

  const queryClient = useQueryClient()

  // Usar React Query para manejar los productos
  const {
    data: productos = [],
    isLoading,
    error,
    refetch
  } = useProducts()

  const refreshProducts = useRefreshProducts()

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value)
    setSearchTerm('') // Limpiar término de búsqueda al cambiar filtro
  }

  const handlePriceRangeChange = (e) => {
    setPriceRange(e.target.value)
  }

  // Opciones para el tipo de filtro
  const filterOptions = [
    { value: 'nombre_producto', label: 'Nombre del producto' },
    { value: 'modelo', label: 'Modelo' }
  ]

  // Opciones para rangos de precio
  const priceRangeOptions = [
    { value: '', label: 'Todos los precios' },
    { value: '<50', label: 'Menor a $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '>100', label: 'Mayor a $100' }
  ]

  // Usar useMemo para optimizar el filtrado
  const filteredProducts = useMemo(() => {
    let filtered = productos

    // Filtrar por término de búsqueda según el tipo seleccionado
    if (searchTerm) {
      filtered = filtered.filter(producto => {
        const fieldValue = producto[filterType]?.toLowerCase() || ''
        return fieldValue.includes(searchTerm.toLowerCase())
      })
    }

        // Filtrar por rango de precio
        if (priceRange) {
          filtered = filtered.filter(producto => {
            const precio = producto.precio_venta || 0
            switch (priceRange) {
              case '<50':
                return precio < 50
              case '50-100':
                return precio >= 50 && precio <= 100
              case '>100':
                return precio > 100
              default:
                return true
            }
          })
        }    return filtered
  }, [productos, searchTerm, filterType, priceRange])

  const handleRefresh = () => {
    refreshProducts()
  }

  const handleAddToCart = (producto) => {
    // Verificar si el producto ya está en el carrito
    const existingProductIndex = selectedProducts.findIndex(
      item => item.id_producto === producto.id_producto
    )

    if (existingProductIndex !== -1) {
      // Si existe, verificar stock antes de incrementar
      const currentQuantity = selectedProducts[existingProductIndex].cantidad
      if (currentQuantity < producto.stock) {
        const updatedProducts = [...selectedProducts]
        updatedProducts[existingProductIndex].cantidad += 1
        setSelectedProducts(updatedProducts)
      }
    } else {
      // Si no existe, agregarlo con cantidad 1 (solo si hay stock)
      if (producto.stock > 0) {
        const newProduct = {
          id_producto: producto.id_producto,
          nombre_producto: producto.nombre_producto,
          precio_venta: producto.precio_venta,
          cantidad: 1,
          stock: producto.stock
        }
        setSelectedProducts([...selectedProducts, newProduct])
      }
    }
  }

  const handleRemoveFromCart = (productId) => {
    setSelectedProducts(selectedProducts.filter(item => item.id_producto !== productId))
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId)
      return
    }

    const updatedProducts = selectedProducts.map(item => {
      if (item.id_producto === productId) {
        const quantity = parseInt(newQuantity) || 1
        // Limitar la cantidad al stock disponible
        const finalQuantity = Math.min(quantity, item.stock)
        return { ...item, cantidad: finalQuantity }
      }
      return item
    })
    setSelectedProducts(updatedProducts)
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.precio_venta * item.cantidad), 0).toFixed(2)
  }

  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente)
  }

  // Mutación para procesar la venta
  const ventaMutation = useMutation({
    mutationFn: async (ventaData) => {
      const response = await window.api.venta.registerVenta(ventaData)
      if (!response.success) {
        throw new Error(response.error || 'Error al procesar la venta')
      }
      return response.data
    },
    onSuccess: () => {
      // Limpiar el carrito y cliente seleccionado
      setSelectedProducts([])
      setSelectedCliente(null)
      
      // Refrescar la lista de productos para actualizar stock
      queryClient.invalidateQueries(['products'])
      
      // Mostrar mensaje de éxito (opcional)
      alert('¡Venta procesada exitosamente!')
    },
    onError: (error) => {
      alert(`Error al procesar la venta: ${error.message}`)
    },
    onSettled: () => {
      setIsProcessingVenta(false)
    }
  })

  const handleProcesarVenta = async () => {
    if (!selectedCliente || selectedProducts.length === 0) {
      alert('Debe seleccionar un cliente y al menos un producto')
      return
    }

    setIsProcessingVenta(true)

    // Preparar datos para la venta
    const ventaData = {
      id_cliente: selectedCliente.id_cliente, // Usar id_cliente correcto
      id_empresa: selectedCliente.id_empresa, // Pasar también id_empresa por si necesitamos crear el cliente
      fecha: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
      total: parseFloat(calculateTotal()),
      estado: 'completada',
      // Omitir id_usuario si es null
      productos: selectedProducts.map(product => ({
        id_producto: product.id_producto,
        unidades: product.cantidad
      }))
    }

    ventaMutation.mutate(ventaData)
  }

  return (
    <>

      <div className="productos-container" >
        <div className="row">
          {/* Columna izquierda - Lista de productos */}
          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Venta</h2>
            </div>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder={`Buscar por ${filterType === 'nombre_producto' ? 'nombre del producto' : 'modelo'}...`}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select mb-3"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select mb-3"
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                >
                  {priceRangeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Mostrar errores si los hay */}
            {error && (
              <div className="alert alert-danger" role="alert">
                Error al cargar productos: {error.message}
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => refetch()}
                >
                  Reintentar
                </button>
              </div>
            )}

            {/* Cards de productos */}
            <div className="row">
              {isLoading ? (
                <div className="col-12 text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2">Cargando productos...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((producto) => (
                  <div key={producto.id_producto} className="col-md-4 mb-3">
                    <div 
                      className={`card h-100 shadow-sm product-card ${producto.stock === 0 ? 'disabled' : ''}`}
                      onClick={() => producto.stock > 0 && handleAddToCart(producto)}
                      style={{ userSelect: 'none' }}
                    >
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{producto.nombre_producto}</h5>
                        <p className="card-text flex-grow-1 text-muted">
                          {producto.modelo || 'Sin descripción disponible'}
                        </p>
                        <div className="mt-auto">
                          <h6 className="text-dark mb-2">
                            Precio: ${producto.precio_venta?.toFixed(2) || '0.00'}
                          </h6>
                          {producto.stock !== undefined && (
                            <small className="text-muted d-block mb-2">
                              Stock: {producto.stock} unidades
                            </small>
                          )}
                          <div className="d-grid gap-2">
                            <button
                              className="btn btn-sm" 
                              style={{backgroundColor: '#8B45FF', color: '#fff'}}
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar doble click
                                handleAddToCart(producto);
                              }}
                              disabled={producto.stock === 0}
                            >
                              {producto.stock === 0 ? 'Sin Stock' : 'Agregar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <div className="alert alert-info">
                    <h5>No se encontraron productos</h5>
                    <p className="mb-0">
                      {searchTerm
                        ? `No hay productos que coincidan con "${searchTerm}"`
                        : 'No hay productos disponibles'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha - Input, listado y botón */}
          <div className="col-md-4" style={{ borderLeft: '5px solid #dee2e6' }}>
            <h3>Orden de Venta</h3>
            <div className="card">

              <div className="card-body">
                {/* Búsqueda de cliente */}
                <ClienteSearch 
                  onClienteSelect={handleClienteSelect}
                  selectedCliente={selectedCliente}
                />

                {/* Productos seleccionados */}
                <div className="mb-3">
                  <label className="form-label">Productos Seleccionados</label>
                  <div className="border rounded" style={{ maxHeight: '250px', overflowY: 'auto', padding: '8px' }}>

                    {selectedProducts.length > 0 ? (
                      selectedProducts.map((item) => (
                        <div key={item.id_producto} className="border-bottom py-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="flex-grow-1">
                              <div className="fw-bold text-dark">{item.nombre_producto}</div>
                              <div className="small text-muted">
                                Precio Venta: ${item.precio_venta.toFixed(2)} • Stock: {item.stock}
                              </div>
                            </div>
                            <button 
                              className="btn btn-outline-dark btn-sm" 
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                              onClick={() => handleRemoveFromCart(item.id_producto)}
                              title="Eliminar producto"
                            >
                              🗑️
                            </button>
                          </div>
                          
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <label className="small text-muted me-2">Cantidad:</label>
                              <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                style={{ width: '80px' }}
                                value={item.cantidad}
                                min="1"
                                max={item.stock}
                                onChange={(e) => handleQuantityChange(item.id_producto, e.target.value)}
                              />
                            </div>
                            <div className="text-end">
                              <div className="fw-bold text-success">
                                ${(item.precio_venta * item.cantidad).toFixed(2)}
                              </div>
                            </div>
                          </div>
                          
                          {item.cantidad >= item.stock && (
                            <div className="mt-2">
                              <small className="text-danger">
                                ⚠️ Cantidad máxima disponible: {item.stock}
                              </small>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted py-3">
                        <p>No hay productos seleccionados</p>
                        <small>Haz clic en "Agregar al Carrito" en cualquier producto</small>
                      </div>
                    )}

                  </div>
                </div>

                {/* Total */}
                {selectedProducts.length > 0 && (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>Total:</strong>
                      <strong className="text-success">${calculateTotal()}</strong>
                    </div>
                  </div>
                )}

                {/* Botón de acción */}
                <button 
                  className="btn btn-success w-100"
                  disabled={selectedProducts.length === 0 || !selectedCliente || isProcessingVenta}
                  onClick={handleProcesarVenta}
                  title={!selectedCliente ? 'Selecciona un cliente primero' : ''}
                >
                  {isProcessingVenta ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Procesando...
                    </>
                  ) : (
                    'Procesar Venta'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



export default Productos
