// API 配置
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_OPENAI_API_URL,
  model: import.meta.env.VITE_OPENAI_API_MODEL,
  temperature: Number(import.meta.env.VITE_OPENAI_API_TEMPERATURE),
  imageGeneration: {
    model: 'dall-e-3',
    defaultSize: '1024x1024',
    maxTokens: 1000,
    supportedFormats: ['url', 'b64_json'],
    limits: {
      maxImages: 10,
      minSize: 256,
      maxSize: 1024,
    },
  },
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
  imageSettings: 'image_generation_settings',
}

// UI配置
export const UI_CONFIG = {
  messageMaxLength: 4000,
  historyMaxLength: 100,
  imageGeneration: {
    defaultSize: '1024x1024',
    supportedTypes: ['png', 'jpeg'],
    thumbnailSize: '256x256',
    previewSize: '512x512',
  },
}

// 默认配置
export const DEFAULT_CONFIG = {
  theme: 'light',
  language: 'zh-CN',
  pageSize: 20,
}
