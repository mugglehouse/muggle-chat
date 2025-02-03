import axios from 'axios'
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

// 创建 axios 实例
const chatAPI = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器：添加 API Key
chatAPI.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey)
  if (apiKey) {
    // 使用原始的 API Key
    config.headers.Authorization = `Bearer ${apiKey}`
    config.headers['x-requested-with'] = 'XMLHttpRequest'
  }
  return config
})

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
      const response = await chatAPI.post<ChatCompletionResponse>(
        '/chat/completions',
        request,
      )
      return response.data.choices[0].message
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

    console.log('发送请求:', request)

    try {
      const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.apiKey) || ''}`,
          'Accept': 'text/event-stream',
          'x-requested-with': 'XMLHttpRequest',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)

      // 获取响应文本
      const text = await response.text()
      console.log('原始响应:', text)

      // 处理响应文本
      let responseText = ''
      const lines = text.split('\n')

      for (const line of lines) {
        if (line.trim() === '')
          continue
        if (line.trim() === 'data: [DONE]')
          continue

        try {
          // 移除 'data: ' 前缀
          const data = line.startsWith('data: ') ? line.slice(6) : line
          const parsed = JSON.parse(data)
          console.log('解析的数据:', parsed)

          // 处理不同的响应格式
          let content = ''
          if (parsed.choices?.[0]?.delta?.content)
            content = parsed.choices[0].delta.content
          else if (parsed.choices?.[0]?.message?.content)
            content = parsed.choices[0].message.content

          if (content) {
            responseText += content
            console.log('收到内容:', content)
            onProgress?.(responseText)
          }
        }
        catch (error) {
          console.warn('解析行数据失败:', line, error)
        }
      }

      console.log('完整响应:', responseText)

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
    // 直接存储原始的 API Key
    localStorage.setItem(STORAGE_KEYS.apiKey, apiKey)
  },

  /**
   * 获取 API Key
   */
  getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.apiKey)
  },
}
