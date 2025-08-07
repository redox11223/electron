import { useState, useRef, useEffect } from 'react'
import { useSearchClientes } from '../hooks/useClientes'

export const ClienteSearch = ({ onClienteSelect, selectedCliente }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  const { 
    data: clientes = [], 
    isLoading, 
    error,
    isFetching 
  } = useSearchClientes(searchTerm)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowDropdown(value.length >= 2)
  }

  const handleClienteSelect = (cliente) => {
    setSearchTerm(cliente.razon_social)
    setShowDropdown(false)
    onClienteSelect(cliente)
  }

  const clearSelection = () => {
    setSearchTerm('')
    setShowDropdown(false)
    onClienteSelect(null)
  }

  // Mostrar loading si está cargando o haciendo fetch
  const isSearching = isLoading || isFetching

  return (
    <div className="cliente-search-container" ref={dropdownRef}>
      <div className="mb-3">
        <label htmlFor="cliente-search" className="form-label fw-bold">
          Cliente
        </label>
        <div className="position-relative">
          <input
            ref={searchRef}
            id="cliente-search"
            type="text"
            className="form-control"
            placeholder="Buscar cliente por nombre o RUC..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
          />
          {searchTerm && (
            <button
              type="button"
              className="btn btn-sm position-absolute end-0 top-50 translate-middle-y me-2"
              onClick={clearSelection}
              style={{ border: 'none', background: 'none', fontSize: '1.2rem', color: '#999' }}
            >
              ×
            </button>
          )}
          
          {showDropdown && (
            <div 
              className="dropdown-menu show position-absolute w-100 mt-1"
              style={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                zIndex: 1050,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              {isSearching ? (
                <div className="dropdown-item text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="dropdown-item text-danger">
                  Error: {error.message}
                </div>
              ) : clientes.length === 0 ? (
                <div className="dropdown-item text-muted">
                  No se encontraron clientes
                </div>
              ) : (
                clientes.map((cliente) => (
                  <button
                    key={cliente.id_cliente}
                    type="button"
                    className="dropdown-item d-flex align-items-center p-3"
                    onClick={() => handleClienteSelect(cliente)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="me-3">
                      <div 
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: '40px', height: '40px', fontSize: '18px' }}
                      >
                        {cliente.razon_social.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark">{cliente.razon_social}</div>
                      <div className="small text-muted">
                        RUC: {cliente.numero_ruc}
                        {cliente.email && ` • ${cliente.email}`}
                      </div>
                      {cliente.celular && (
                        <div className="small text-muted">
                          Tel: {cliente.celular}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {selectedCliente && (
        <div className="alert alert-info d-flex align-items-center p-3">
          <div className="me-3">
            <div 
              className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '40px', height: '40px', fontSize: '18px' }}
            >
              {selectedCliente.razon_social.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="fw-bold">{selectedCliente.razon_social}</div>
            <div className="small text-muted">
              RUC: {selectedCliente.numero_ruc}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clearSelection}
          >
            Cambiar
          </button>
        </div>
      )}
    </div>
  )
}
