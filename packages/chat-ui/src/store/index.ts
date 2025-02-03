import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useChatStore } from './chat'

const store = createPinia()

export function setupStore(app: App) {
  app.use(store)
}

export { useChatStore }
