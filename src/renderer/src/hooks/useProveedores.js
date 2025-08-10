import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useProveedores = () => {
  const queryClient = useQueryClient()

  // Query para obtener todos los proveedores
  const proveedoresQuery = useQuery({
    queryKey: ['proveedores'],
    queryFn: async () => {
      const response = await window.api.proveedores.getAll()
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar proveedores')
      }
      return response.data
    }
  })

  // Mutation para crear proveedor
  const createMutation = useMutation({
    mutationFn: async (proveedorData) => {
      const response = await window.api.proveedores.create(proveedorData)
      if (!response.success) {
        throw new Error(response.error || 'Error al crear proveedor')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })

  // Mutation para actualizar proveedor
  const updateMutation = useMutation({
    mutationFn: async ({ id, proveedorData }) => {
      const response = await window.api.proveedores.update(id, proveedorData)
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar proveedor')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })

  // Mutation para desactivar proveedor
  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      const response = await window.api.proveedores.deactivate(id)
      if (!response.success) {
        throw new Error(response.error || 'Error al desactivar proveedor')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
    }
  })

  // Query para buscar proveedores
  const searchProveedores = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return proveedoresQuery.data || []
    }
    
    const response = await window.api.proveedores.search(searchTerm)
    if (!response.success) {
      throw new Error(response.error || 'Error al buscar proveedores')
    }
    return response.data
  }

  return {
    // Data
    proveedores: proveedoresQuery.data || [],
    
    // Loading states
    isLoading: proveedoresQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    
    // Error states
    error: proveedoresQuery.error,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deactivateError: deactivateMutation.error,
    
    // Success states
    isCreateSuccess: createMutation.isSuccess,
    isUpdateSuccess: updateMutation.isSuccess,
    isDeactivateSuccess: deactivateMutation.isSuccess,
    
    // Actions
    createProveedor: createMutation.mutate,
    updateProveedor: updateMutation.mutate,
    deactivateProveedor: deactivateMutation.mutate,
    searchProveedores,
    
    // Utils
    refetch: proveedoresQuery.refetch,
    
    // Reset mutations
    resetCreateMutation: createMutation.reset,
    resetUpdateMutation: updateMutation.reset,
    resetDeactivateMutation: deactivateMutation.reset
  }
}
