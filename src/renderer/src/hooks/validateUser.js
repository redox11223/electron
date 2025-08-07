import { useMutation } from '@tanstack/react-query'

export const useValidateUser = () => {
    return useMutation({
        mutationFn: (credentials) => window.api.users.validateUser(credentials),
       
    })
}