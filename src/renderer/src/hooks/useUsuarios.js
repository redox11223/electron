import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useUsuarios = () => {
  const queryClient = useQueryClient()

  // Query para obtener todos los usuarios
  const {
    data: usuarios = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await window.electronAPI.getAllUsuarios()
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error)
      }
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  // Mutation para crear usuario
  const createUsuarioMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await window.electronAPI.createUsuario(userData)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios'])
    },
    onError: (error) => {
      console.error('Error al crear usuario:', error)
    }
  })

  // Mutation para actualizar usuario
  const updateUsuarioMutation = useMutation({
    mutationFn: async ({ id, userData }) => {
      const response = await window.electronAPI.updateUsuario(id, userData)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios'])
    },
    onError: (error) => {
      console.error('Error al actualizar usuario:', error)
    }
  })

  // Mutation para soft delete
  const deleteUsuarioMutation = useMutation({
    mutationFn: async (id) => {
      const response = await window.electronAPI.deleteUsuario(id)
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['usuarios'])
    },
    onError: (error) => {
      console.error('Error al eliminar usuario:', error)
    }
  })

  // Query para obtener roles
  const {
    data: roles = [],
    isLoading: rolesLoading
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await window.electronAPI.getAllRoles()
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error)
      }
    },
    staleTime: 1000 * 60 * 10 // 10 minutos
  })

  return {
    usuarios,
    isLoading,
    error,
    refetch,
    roles,
    rolesLoading,
    createUsuario: createUsuarioMutation.mutate,
    updateUsuario: updateUsuarioMutation.mutate,
    deleteUsuario: deleteUsuarioMutation.mutate,
    isCreating: createUsuarioMutation.isPending,
    isUpdating: updateUsuarioMutation.isPending,
    isDeleting: deleteUsuarioMutation.isPending,
    createError: createUsuarioMutation.error,
    updateError: updateUsuarioMutation.error,
    deleteError: deleteUsuarioMutation.error,
    isCreateSuccess: createUsuarioMutation.isSuccess,
    isUpdateSuccess: updateUsuarioMutation.isSuccess,
    isDeleteSuccess: deleteUsuarioMutation.isSuccess,
    resetCreateMutation: createUsuarioMutation.reset,
    resetUpdateMutation: updateUsuarioMutation.reset,
    resetDeleteMutation: deleteUsuarioMutation.reset
  }
}
