import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useUserProfile = (userId) => {
  const queryClient = useQueryClient()

  // Query para obtener el perfil del usuario
  const profileQuery = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null
      const response = await window.api.users.getUserProfile(userId)
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar perfil del usuario')
      }
      return response.data
    },
    enabled: !!userId
  })

  // Mutation para actualizar el perfil
  const updateMutation = useMutation({
    mutationFn: async (personData) => {
      const response = await window.api.users.updateUserProfile(userId, personData)
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar perfil')
      }
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', userId] })
    }
  })

  return {
    // Data
    profile: profileQuery.data,
    
    // Loading states
    isLoading: profileQuery.isLoading,
    isUpdating: updateMutation.isPending,
    
    // Error states
    error: profileQuery.error,
    updateError: updateMutation.error,
    
    // Success states
    isUpdateSuccess: updateMutation.isSuccess,
    
    // Actions
    updateProfile: updateMutation.mutate,
    
    // Reset functions
    resetUpdateMutation: updateMutation.reset
  }
}
