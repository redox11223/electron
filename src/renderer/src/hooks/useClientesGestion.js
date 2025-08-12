import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useClientesGestion = () => {
  const queryClient = useQueryClient()

  // Query para obtener todos los clientes
  const clientesQuery = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await window.api.clients.getAll()
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar clientes')
      }
      return response.data
    }
  })

  // Mutation para crear cliente
  const createMutation = useMutation({
    mutationFn: async (clienteData) => {
      const response = await window.api.clients.create(clienteData)
      if (!response.success) {
        throw new Error(response.error || 'Error al crear cliente')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })

  // Mutation para actualizar cliente
  const updateMutation = useMutation({
    mutationFn: async ({ id, clienteData }) => {
      const response = await window.api.clients.update(id, clienteData)
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar cliente')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })

  // Mutation para desactivar cliente
  const deactivateMutation = useMutation({
    mutationFn: async (id) => {
      const response = await window.api.clients.deactivate(id)
      if (!response.success) {
        throw new Error(response.error || 'Error al desactivar cliente')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] })
    }
  })

  // Query para buscar clientes
  const searchClientes = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      return clientesQuery.data || []
    }
    
    const response = await window.api.clients.search(searchTerm)
    if (!response.success) {
      throw new Error(response.error || 'Error al buscar clientes')
    }
    return response.data
  }

  return {
    // Data
    clientes: clientesQuery.data || [],
    
    // Loading states
    isLoading: clientesQuery.isLoading,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
    
    // Error states
    error: clientesQuery.error,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deactivateError: deactivateMutation.error,
    
    // Success states
    isCreateSuccess: createMutation.isSuccess,
    isUpdateSuccess: updateMutation.isSuccess,
    isDeactivateSuccess: deactivateMutation.isSuccess,
    
    // Actions
    createCliente: createMutation.mutate,
    updateCliente: updateMutation.mutate,
    deactivateCliente: deactivateMutation.mutate,
    searchClientes,
    
    // Utils
    resetCreateMutation: createMutation.reset,
    resetUpdateMutation: updateMutation.reset,
    resetDeactivateMutation: deactivateMutation.reset,
    
    // Refetch
    refetch: clientesQuery.refetch
  }
}
