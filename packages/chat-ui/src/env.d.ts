/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_URL: string
  readonly VITE_OPENAI_API_MODEL: string
  readonly VITE_OPENAI_API_TEMPERATURE: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_DEV_MODE?: string
  readonly VITE_API_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
