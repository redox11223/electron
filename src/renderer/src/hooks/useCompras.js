import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useCompras = () => {
  const queryClient = useQueryClient()

  // Query para obtener todas las compras
  const comprasQuery = useQuery({
    queryKey: ['compras'],
    queryFn: async () => {
      const response = await window.api.compras.getAll()
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar compras')
      }
      return response.data
    }
  })

  // Mutation para crear compra
  const createMutation = useMutation({
    mutationFn: async ({ compraData, productos }) => {
      const response = await window.api.compras.create(compraData, productos)
      if (!response.success) {
        throw new Error(response.error || 'Error al crear compra')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compras'] })
      queryClient.invalidateQueries({ queryKey: ['products'] }) // Invalidar productos por actualización de stock
    }
  })

  // Mutation para actualizar estado
  const updateEstadoMutation = useMutation({
    mutationFn: async ({ id, estado }) => {
      const response = await window.api.compras.updateEstado(id, estado)
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar estado')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compras'] })
    }
  })

  // Query para obtener compra por ID
  const useCompraById = (id) => {
    return useQuery({
      queryKey: ['compra', id],
      queryFn: async () => {
        const response = await window.api.compras.getById(id)
        if (!response.success) {
          throw new Error(response.error || 'Error al cargar compra')
        }
        return response.data
      },
      enabled: !!id
    })
  }

  return {
    // Data
    compras: comprasQuery.data || [],
    
    // Loading states
    isLoading: comprasQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdatingEstado: updateEstadoMutation.isPending,
    
    // Error states
    error: comprasQuery.error,
    createError: createMutation.error,
    updateError: updateEstadoMutation.error,
    
    // Success states
    isCreateSuccess: createMutation.isSuccess,
    isUpdateSuccess: updateEstadoMutation.isSuccess,
    
    // Actions
    createCompra: createMutation.mutate,
    updateEstado: updateEstadoMutation.mutate,
    
    // Utils
    refetch: comprasQuery.refetch,
    useCompraById,
    
    // Reset mutations
    resetCreateMutation: createMutation.reset,
    resetUpdateMutation: updateEstadoMutation.reset
  }
}

export const useProductosSolicitados = () => {
  const queryClient = useQueryClient()

  // Query para obtener productos solicitados
  const productosQuery = useQuery({
    queryKey: ['productos-solicitados'],
    queryFn: async () => {
      const response = await window.api.compras.getAllProductosSolicitados()
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar productos solicitados')
      }
      return response.data
    }
  })

  // Mutation para actualizar estado de producto solicitado
  const updateEstadoMutation = useMutation({
    mutationFn: async ({ id, estado }) => {
      const response = await window.api.compras.updateEstadoProductoSolicitado(id, estado)
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar estado')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos-solicitados'] })
    }
  })

  // Función para buscar productos solicitados
  const searchProductos = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return productosQuery.data || []
    }
    
    const response = await window.api.compras.searchProductosSolicitados(searchTerm)
    if (!response.success) {
      throw new Error(response.error || 'Error al buscar productos')
    }
    return response.data
  }

  return {
    // Data
    productos: productosQuery.data || [],
    
    // Loading states
    isLoading: productosQuery.isLoading,
    isUpdatingEstado: updateEstadoMutation.isPending,
    
    // Error states
    error: productosQuery.error,
    updateError: updateEstadoMutation.error,
    
    // Success states
    isUpdateSuccess: updateEstadoMutation.isSuccess,
    
    // Actions
    updateEstado: updateEstadoMutation.mutate,
    searchProductos,
    
    // Utils
    refetch: productosQuery.refetch,
    resetUpdateMutation: updateEstadoMutation.reset
  }
}
