const ADMIN_API_KEY_STORAGE_KEY = 'adminApiKey'
const SERVICE_API_KEY_STORAGE_KEY = 'serviceApiKey'

export const storage = {
  getAdminApiKey: () => localStorage.getItem(ADMIN_API_KEY_STORAGE_KEY),
  setAdminApiKey: (key: string) => localStorage.setItem(ADMIN_API_KEY_STORAGE_KEY, key),
  removeAdminApiKey: () => localStorage.removeItem(ADMIN_API_KEY_STORAGE_KEY),
  getServiceApiKey: () => localStorage.getItem(SERVICE_API_KEY_STORAGE_KEY),
  setServiceApiKey: (key: string) => localStorage.setItem(SERVICE_API_KEY_STORAGE_KEY, key),
  removeServiceApiKey: () => localStorage.removeItem(SERVICE_API_KEY_STORAGE_KEY),
}
