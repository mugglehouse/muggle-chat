import axios, { type AxiosProgressEvent, type AxiosResponse } from 'axios'
import type { Message } from '../store/chat'
import { API_CONFIG, STORAGE_KEYS } from '../config'

// API 类型定义
interface ChatCompletionRequest {
  model: string
  messages: {
    role: 'system' | 'user' | 'assistant'
    content: string
  }[]
  temperature?: number
  stream?: boolean
}

interface ChatCompletionResponse {
  id: string
  choices: {
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: string
  }[]
}

interface ChatStreamResponse {
  id: string
  choices: {
    delta: {
      content?: string
    }
    finish_reason?: string
  }[]
}

interface ChatHttpOption {
  url: string
  data?: any
  method?: string
  headers?: Record<string, string>
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: AbortSignal
}

// 创建 axios 实例
const chatAPI = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加认证信息
chatAPI.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey)
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`
    config.headers['x-requested-with'] = 'XMLHttpRequest'
  }
  return config
})

// 响应拦截器：统一处理响应和错误
chatAPI.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('API Key 无效或已过期')
          break
        case 403:
          console.error('没有访问权限')
          break
        case 429:
          console.error('请求次数超限')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败:', error.response.status, error.response.data)
      }
    }
    else if (error.request) {
      console.error('网络错误，未收到响应')
    }
    else {
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  },
)

// HTTP 请求处理函数
async function http<T = any>({
  url,
  data,
  method = 'POST',
  headers,
  onDownloadProgress,
  signal,
}: ChatHttpOption): Promise<T> {
  const config: any = {
    url,
    method,
    headers,
    signal,
    onDownloadProgress,
  }

  if (method === 'GET')
    config.params = data
  else
    config.data = data

  const response: AxiosResponse<T> = await chatAPI(config)
  return response.data
}

// API 方法
export const chatService = {
  /**
   * 发送消息
   * @param messages 消息历史
   * @param options 配置选项
   */
  async sendMessage(messages: Message[], options = {}) {
    const request: ChatCompletionRequest = {
      model: API_CONFIG.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: API_CONFIG.temperature,
      ...options,
    }

    try {
      const response = await http<ChatCompletionResponse>({
        url: '/chat/completions',
        method: 'POST',
        data: request,
      })
      return response.choices[0].message
    }
    catch (error) {
      console.error('发送消息失败:', error)
      throw error
    }
  },

  /**
   * 发送流式消息
   * @param messages 消息历史
   * @param options 配置选项
   * @param onProgress 进度回调
   */
  async sendStreamMessage(
    messages: Message[],
    options = {},
    onProgress?: (text: string) => void,
  ) {
    const request: ChatCompletionRequest = {
      model: API_CONFIG.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: API_CONFIG.temperature,
      stream: true,
      ...options,
    }

    let responseText = ''

    try {
      await http<string>({
        url: '/chat/completions',
        method: 'POST',
        data: request,
        headers: {
          'Accept': 'text/event-stream',
        },
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          const chunk = progressEvent.event.target.response as string || ''
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (!line.trim() || line.includes('[DONE]'))
              continue

            try {
              const data = line.replace(/^data: /, '').trim()
              if (!data)
                continue

              const parsed = JSON.parse(data) as ChatStreamResponse
              const content = parsed.choices[0]?.delta?.content || ''

              if (content) {
                responseText += content
                onProgress?.(responseText)
              }
            }
            catch (error) {
              continue
            }
          }
        },
      })

      if (!responseText)
        throw new Error('未收到有效的响应内容')

      return {
        role: 'assistant' as const,
        content: responseText,
      }
    }
    catch (error) {
      console.error('发送流式消息失败:', error)
      throw error
    }
  },

  /**
   * 设置 API Key
   * @param apiKey OpenAI API Key
   */
  setApiKey(apiKey: string) {
    localStorage.setItem(STORAGE_KEYS.apiKey, apiKey)
  },

  /**
   * 获取 API Key
   */
  getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.apiKey)
  },
}
