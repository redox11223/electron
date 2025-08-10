

import { useMutation } from '@tanstack/react-query'

export const useValidateUser = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const result = await window.api.users.validateUser(credentials)
      if (!result.success) {
        throw new Error(result.error || 'Credenciales invalidas')
      }
      return result
    }
  })
}