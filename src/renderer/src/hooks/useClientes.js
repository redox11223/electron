import { useQuery } from '@tanstack/react-query'

export const useSearchClientes = (searchTerm) => {
  return useQuery({
    queryKey: ['search-clientes', searchTerm],
    queryFn: async () => {
      const response = await window.api.clients.searchClientes(searchTerm.trim())
      
      if (response.success) {
        return response.data || []
      }
      
      throw new Error(response.error || 'Error al buscar clientes')
    },
    enabled: Boolean(searchTerm && searchTerm.trim().length >= 2),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
    retry: 1,
    refetchOnMount: false
  })
}
