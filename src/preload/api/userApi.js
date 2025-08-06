import { ipcRenderer } from 'electron'

export const userApi = {
  getUsers: () => {
    return ipcRenderer.invoke('get-users')
  },
  createUserPersona: (data) => {
    return ipcRenderer.invoke('create-user-persona', data)
  },
  validateUser: (userLogin) => {
    return ipcRenderer.invoke('validate-user', userLogin)
  }
}
