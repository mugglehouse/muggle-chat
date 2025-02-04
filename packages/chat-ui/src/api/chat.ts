/**
 * Chat API 服务模块
 * 负责处理与 OpenAI API 的通信，包括普通消息和流式消息的发送
 * 提供消息发送、流式处理、API密钥管理等功能
 */
import axios, { type AxiosProgressEvent, type AxiosResponse } from 'axios'
import type { Message } from '../store/chat'
import { API_CONFIG, STORAGE_KEYS } from '../config'

// API 类型定义
/**
 * 聊天消息接口
 * @property role - 消息角色：system(系统消息)、user(用户消息)、assistant(助手消息)
 * @property content - 消息内容
 */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

/**
 * 聊天请求参数接口
 * @property model - 使用的模型名称
 * @property messages - 消息历史记录
 * @property temperature - 温度参数，控制响应的随机性，范围0-2，默认1
 * @property stream - 是否使用流式响应
 */
interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  stream?: boolean
}

/**
 * 普通聊天响应接口
 * @property id - 响应ID
 * @property choices - 响应选项数组
 * @property choices[].message - 响应消息
 * @property choices[].finish_reason - 结束原因
 */
interface ChatCompletionResponse {
  id: string
  choices: {
    message: ChatMessage
    finish_reason: string
  }[]
}

/**
 * 流式响应接口
 * @property id - 响应ID
 * @property choices - 响应选项数组
 * @property choices[].delta - 增量内容
 * @property choices[].delta.content - 文本内容
 * @property choices[].finish_reason - 结束原因
 */
interface ChatStreamResponse {
  id: string
  choices: {
    delta: {
      content?: string
    }
    finish_reason?: string
  }[]
}

/**
 * HTTP请求配置接口
 * @property url - 请求地址
 * @property data - 请求数据
 * @property method - 请求方法
 * @property headers - 请求头
 * @property onDownloadProgress - 下载进度回调
 * @property signal - 请求取消信号
 */
interface ChatHttpOption {
  url: string
  data?: any
  method?: string
  headers?: Record<string, string>
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: AbortSignal
}

/**
 * 创建 axios 实例并配置
 * 设置基础URL、请求头和超时时间
 */
const chatAPI = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 设置超时时间为60秒
})

/**
 * 请求拦截器：添加认证信息
 * 在每个请求发送前自动添加 API Key 到请求头
 */
chatAPI.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey)
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`
    config.headers['x-requested-with'] = 'XMLHttpRequest'
  }
  return config
})

/**
 * 响应拦截器：统一处理响应和错误
 * 处理常见的错误情况并提供友好的错误信息
 */
chatAPI.interceptors.response.use(
  response => response,
  (error) => {
    const errorMap = {
      401: 'API Key 无效或已过期',
      403: '没有访问权限',
      429: '请求次数超限',
      500: '服务器错误',
    }

    if (error.response) {
      const status = error.response.status
      console.error(errorMap[status] || `请求失败: ${status}`, error.response.data)
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

/**
 * HTTP 请求处理函数
 * 统一处理 GET 和 POST 请求，支持流式数据和进度回调
 * @template T - 响应数据类型
 * @param options - 请求配置选项
 * @param options.url - 请求地址
 * @param options.data - 请求数据
 * @param options.method - 请求方法，默认为 'POST'
 * @param options.headers - 请求头
 * @param options.onDownloadProgress - 下载进度回调
 * @param options.signal - 请求取消信号
 * @returns Promise<T> - 响应数据
 */
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

/**
 * Chat API 服务
 * 提供消息发送、流式处理、API密钥管理等功能
 */
export const chatService = {
  /**
   * 发送普通消息
   * 向 OpenAI API 发送请求并获取完整响应
   * @param messages - 消息历史记录数组
   * @param options - 请求配置选项
   * @returns Promise<ChatMessage> - 返回助手的响应消息
   * @throws Error - 当请求失败时抛出错误
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
   * 使用 SSE(Server-Sent Events) 获取实时响应
   * @param messages - 消息历史记录数组
   * @param options - 请求配置选项
   * @param onProgress - 进度回调函数，用于实时显示生成的文本
   * @returns Promise<ChatMessage> - 返回完整的响应消息
   * @throws Error - 当请求失败或未收到有效响应时抛出错误
   */
  async sendStreamMessage(
    messages: Message[],
    options = {},
    onProgress?: (text: string) => void,
  ) {
    // 构建请求参数
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

    // 状态变量：用于累积响应文本和跟踪数据块
    let responseText = '' // 完整的响应文本
    let currentChunk = '' // 当前处理的数据块

    try {
      await http<string>({
        url: '/chat/completions',
        data: request,
        headers: {
          'Accept': 'text/event-stream', // 指定接收 SSE 格式数据
        },
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          // 获取并处理新增的响应数据
          const chunk = progressEvent.event.target.response as string || ''
          const newContent = chunk.substring(currentChunk.length)
          currentChunk = chunk

          // 处理 SSE 数据：解析和提取文本内容
          const lines = newContent.split('\n')
          let newText = ''

          for (const line of lines) {
            // 跳过空行和结束标记
            if (!line.trim() || line.includes('[DONE]'))
              continue

            try {
              // 解析 SSE 数据格式并提取内容
              const data = line.replace(/^data: /, '').trim()
              if (!data)
                continue

              const parsed = JSON.parse(data) as ChatStreamResponse
              const content = parsed.choices[0]?.delta?.content || ''

              if (content)
                newText += content
            }
            catch {
              continue // 忽略解析错误，继续处理下一行
            }
          }

          // 更新响应文本并触发进度回调
          if (newText) {
            responseText += newText
            onProgress?.(responseText)
          }
        },
      })

      // 验证响应有效性
      if (!responseText)
        throw new Error('未收到有效的响应内容')

      // 返回完整的响应消息
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
   * 将 API Key 保存到本地存储
   * @param apiKey - OpenAI API Key
   */
  setApiKey(apiKey: string) {
    localStorage.setItem(STORAGE_KEYS.apiKey, apiKey)
  },

  /**
   * 获取 API Key
   * 从本地存储获取保存的 API Key
   * @returns string | null - 返回保存的 API Key，如果不存在则返回 null
   */
  getApiKey() {
    return localStorage.getItem(STORAGE_KEYS.apiKey)
  },
}
