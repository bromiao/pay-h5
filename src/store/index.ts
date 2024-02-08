import { createPinia } from 'pinia'
import { useEntryStore } from './modules/entry'
import { useAuthStore } from './modules/auth'

import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(
  createPersistedState({
    storage: sessionStorage
  })
)

export { useEntryStore, useAuthStore }
export default pinia
