import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/welcome/index.vue'),
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/chat/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
export async function setupRouter(app: App) {
  app.use(router)
  await router.isReady()
}
