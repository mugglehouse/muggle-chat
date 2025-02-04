import { createApp } from 'vue'

import Antd from 'ant-design-vue'

// import 'ant-design-vue/dist/reset.css'
import './assets/style.css'
import App from './app.vue'
import { setupStore } from './store'
import { setupRouter } from './router'

async function bootstrap() {
  const app = createApp(App)

  app.use(Antd)
  setupStore(app)

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
