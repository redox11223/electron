import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Hook para obtener todos los productos
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await window.api.products.getProducts()
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar productos')
      }
      return response.data
    },
  })
}

// Hook para obtener un producto por ID
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await window.api.products.getProductId(id)
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar producto')
      }
      return response.data
    },
    enabled: !!id, // Solo ejecutar si hay un ID
  })
}

// Hook para filtrar productos
export const useFilterProducts = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (filterOptions) => {
      const response = await window.api.products.filterProducts(filterOptions)
      if (!response.success) {
        throw new Error(response.error || 'Error al filtrar productos')
      }
      return response.data
    },
    onSuccess: (data) => {
      // Opcional: actualizar el cache de productos con los resultados filtrados
      queryClient.setQueryData(['filtered-products'], data)
    },
  })
}

// Hook para invalidar y refrescar la lista de productos
export const useRefreshProducts = () => {
  const queryClient = useQueryClient()
  
  return () => {
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }
}

// Hook específico para gestión de productos con información completa
export const useProductsManagement = () => {
  return useQuery({
    queryKey: ['products-management'],
    queryFn: async () => {
      const response = await window.api.products.getProductsForManagement()
      if (!response.success) {
        throw new Error(response.error || 'Error al cargar productos para gestión')
      }
      return response.data
    },
  })
}

// Hook para actualizar un producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (productData) => {
      const response = await window.api.products.updateProduct(productData)
      if (!response.success) {
        throw new Error(response.error || 'Error al actualizar producto')
      }
      return response.data
    },
    onSuccess: () => {
      // Invalidar y refrescar tanto los productos generales como los de gestión
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products-management'] })
    },
  })
}
