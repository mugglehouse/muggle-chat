// API 配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_OPENAI_API_URL,
  model: import.meta.env.VITE_OPENAI_API_MODEL,
  temperature: Number(import.meta.env.VITE_OPENAI_API_TEMPERATURE),
}

// 应用配置
export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE,
  description: import.meta.env.VITE_APP_DESCRIPTION,
}

// 开发配置
export const DEV_CONFIG = {
  isDev: import.meta.env.VITE_DEV_MODE === 'true',
  useMock: import.meta.env.VITE_API_MOCK === 'true',
}

// 存储键名
export const STORAGE_KEYS = {
  apiKey: 'openai_api_key',
  theme: 'app_theme',
  sessions: 'chat_sessions',
}

// 默认配置
export const DEFAULT_CONFIG = {
  theme: 'light',
  language: 'zh-CN',
  pageSize: 20,
}
