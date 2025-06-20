import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { chatService } from '../api/chat'
import { imageService } from '../api/image'
import { STORAGE_KEYS } from '../config'

// import type { ImageGenerationOptions } from '../types/image'

/**
 * 基础消息接口定义
 * @interface BaseMessage
 * @property {string} id - 消息唯一标识符
 * @property {'user' | 'assistant'} role - 消息发送者角色
 * @property {number} timestamp - 消息发送时间戳
 * @property {'sending' | 'success' | 'error'} status - 消息发送状态
 */
export interface BaseMessage {
  id: string
  role: 'user' | 'assistant'
  timestamp: number
  status: 'sending' | 'success' | 'error'
}

/**
 * 文本消息接口定义
 * @interface TextMessage
 * @extends {BaseMessage}
 * @property {'text'} type - 消息类型标识
 * @property {string} content - 文本内容
 */
export interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

/**
 * 图片消息接口定义
 * @interface ImageMessage
 * @extends {BaseMessage}
 * @property {'image'} type - 消息类型标识
 * @property {string} content - 生成图片的提示词
 * @property {string[]} imageUrls - 生成的图片URL数组
 * @property {ImageMetadata} [metadata] - 图片相关元数据
 */
export interface ImageMessage extends BaseMessage {
  type: 'image'
  content: string
  imageUrls: string[]
  metadata?: {
    size: '256x256' | '512x512' | '1024x1024'
    n: number
    model?: string
    created: number
    description?: string
  }
}

/**
 * 消息类型联合
 * @type {Message}
 */
export type Message = TextMessage | ImageMessage

/**
 * 聊天会话接口定义
 * @interface ChatSession
 * @property {string} id - 会话唯一标识符
 * @property {string} title - 会话标题
 * @property {Message[]} messages - 会话中的消息列表
 * @property {number} createdAt - 会话创建时间戳
 * @property {number} updatedAt - 会话最后更新时间戳
 */
export interface ChatSession {
  id: string // 会话唯一标识
  title: string // 会话标题
  messages: Message[] // 消息列表
  createdAt: number // 创建时间
  updatedAt: number // 更新时间
}

/**
 * 聊天状态管理 Store
 * 使用 Pinia 的组合式 API 定义 Store
 */
export const useChatStore = defineStore('chat', () => {
  // === State 定义 ===
  const currentSessionId = ref('') // 当前选中的会话 ID
  const sessions = ref<ChatSession[]>([]) // 所有会话列表
  const loading = ref(false) // 加载状态标识
  const error = ref<string | null>(null) // 错误信息

  /**
   * 初始化函数：从本地存储加载会话数据
   * 在 Store 创建时自动执行
   */
  const initSessions = () => {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions)
    if (savedSessions) {
      sessions.value = JSON.parse(savedSessions)
      // 按更新时间排序
      sessions.value.sort((a, b) => b.updatedAt - a.updatedAt)
      // 如果有会话，选中第一条（最新的会话）
      if (sessions.value.length > 0)
        currentSessionId.value = sessions.value[0].id
    }
  }

  /**
   * 将会话数据保存到本地存储
   * 在每次会话数据更新时调用
   */
  const saveSessions = () => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
  }

  // === Getters ===
  /**
   * 获取当前选中的会话对象
   */
  const currentSession = computed(() =>
    sessions.value.find(session => session.id === currentSessionId.value),
  )

  /**
   * 获取当前会话的消息列表
   */
  const currentMessages = computed(() =>
    currentSession.value?.messages || [],
  )

  /**
   * 获取会话列表的简化信息（用于侧边栏显示）
   */
  const sessionList = computed(() =>
    sessions.value
      .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
      .sort((a, b) => b.updatedAt - a.updatedAt),
  )

  // === Actions ===
  /**
   * 创建新的会话
   * 会自动切换到新创建的会话
   */
  function createSession() {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    sessions.value.push(newSession)
    currentSessionId.value = newSession.id
    saveSessions()
  }

  /**
   * 切换当前选中的会话
   * @param sessionId 目标会话的 ID
   */
  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  /**
   * 发送消息并处理响应
   * @param content 消息内容
   */
  async function sendMessage(content: string) {
    // 1. 输入验证
    if (!content.trim())
      return

    // 确保有当前会话，没有则创建新会话
    if (!currentSessionId.value)
      createSession()

    // 创建用户消息对象
    const userMessage: TextMessage = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content,
      timestamp: Date.now(),
      status: 'sending',
    }

    // 获取当前会话
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session)
      return

    // 添加用户消息到会话
    session.messages = [...session.messages, userMessage]
    session.updatedAt = Date.now()
    saveSessions()

    try {
      // 4. 更新状态
      loading.value = true
      error.value = null

      // 创建 AI 响应消息占位
      const aiMessage: TextMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        type: 'text',
        content: '',
        timestamp: Date.now(),
        status: 'sending',
      }

      // 添加 AI 消息到会话
      session.messages = [...session.messages, aiMessage]
      saveSessions()

      // 发送请求并处理流式响应
      const response = await chatService.sendStreamMessage(
        session.messages.slice(0, -1), // 不包含占位消息
        {},
        (text) => {
          // 实时更新 AI 响应内容
          const messageIndex = session.messages.findIndex(msg => msg.id === aiMessage.id)
          if (messageIndex !== -1) {
            const updatedMessages = [...session.messages]
            updatedMessages[messageIndex] = {
              ...aiMessage,
              content: text,
            }
            console.log('updatedMessages', updatedMessages[messageIndex])
            session.messages = updatedMessages
            session.updatedAt = Date.now()
            saveSessions()
          }
        },
      )

      // 更新消息最终状态
      const finalMessages = [...session.messages]
      const userIndex = finalMessages.findIndex(msg => msg.id === userMessage.id)
      const aiIndex = finalMessages.findIndex(msg => msg.id === aiMessage.id)

      // 更新用户消息状态
      if (userIndex !== -1) {
        finalMessages[userIndex] = {
          ...userMessage,
          status: 'success',
        }
      }

      // 更新 AI 消息状态和内容
      if (aiIndex !== -1) {
        finalMessages[aiIndex] = {
          ...aiMessage,
          content: response.content,
          status: 'success',
        }
      }

      session.messages = finalMessages
      session.updatedAt = Date.now()

      // 如果是会话的第一条消息，使用用户输入内容更新会话标题
      if (session.messages.length === 2)
        session.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')

      saveSessions()
    }
    catch (err) {
      // 错误处理：更新消息状态
      const errorMessages = [...session.messages]
      const userIndex = errorMessages.findIndex(msg => msg.id === userMessage.id)
      if (userIndex !== -1) {
        errorMessages[userIndex] = {
          ...errorMessages[userIndex],
          status: 'error',
        }
      }
      session.messages = errorMessages
      error.value = '发送消息失败'
      console.error('发送消息失败:', err)
      saveSessions()
    }
    finally {
      // 10. 清理状态
      loading.value = false
    }
  }

  /**
   * 发送图片生成请求
   * @param prompt 图片生成提示词
   */
  async function sendImagePrompt(
    prompt: string,
  ) {
    // 1. 输入验证
    if (!prompt.trim())
      return

    // 确保有当前会话，没有则创建新会话
    if (!currentSessionId.value)
      createSession()

    // 创建用户消息对象
    const userMessage: ImageMessage = {
      id: Date.now().toString(),
      role: 'user',
      type: 'image',
      content: prompt,
      imageUrls: [],
      timestamp: Date.now(),
      status: 'sending',
    }

    // 获取当前会话
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session)
      return

    // 添加用户消息到会话
    session.messages = [...session.messages, userMessage]
    session.updatedAt = Date.now()
    saveSessions()

    try {
      // 更新状态
      loading.value = true
      error.value = null

      // 创建 AI 响应消息占位
      const aiMessage: ImageMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        type: 'image',
        content: '',
        imageUrls: [],
        timestamp: Date.now(),
        status: 'sending',
        metadata: {
          size: '1024x1024',
          n: 1,
          model: 'dall-e-3',
          created: Date.now(),
        },
      }

      // 添加 AI 消息到会话
      session.messages = [...session.messages, aiMessage]
      saveSessions()

      // 发送图片生成请求
      const response = await imageService.generateImage(
        {
          prompt,
          size: '1024x1024',
          n: 1,
        },
      )

      // 更新消息最终状态
      const finalMessages = [...session.messages]
      const userIndex = finalMessages.findIndex(msg => msg.id === userMessage.id)
      const aiIndex = finalMessages.findIndex(msg => msg.id === aiMessage.id)

      // 更新用户消息状态
      if (userIndex !== -1) {
        finalMessages[userIndex] = {
          ...userMessage,
          status: 'success',
        }
      }

      // 更新 AI 消息状态和图片URL
      if (aiIndex !== -1 && response.data && response.data.length > 0) {
        finalMessages[aiIndex] = {
          ...aiMessage,
          imageUrls: response.data.map(item => item.url || ''),
          status: 'success',
          metadata: {
            ...aiMessage.metadata,
            description: response.data[0].revised_prompt || response.data[0].prompt || prompt,
          },
        }
      }

      session.messages = finalMessages
      session.updatedAt = Date.now()

      // 如果是会话的第一条消息，使用提示词更新会话标题
      if (session.messages.length === 2)
        session.title = prompt.slice(0, 20) + (prompt.length > 20 ? '...' : '')

      saveSessions()
    }
    catch (err: any) {
      // 错误处理：更新消息状态
      const errorMessages = [...session.messages]
      const userIndex = errorMessages.findIndex(msg => msg.id === userMessage.id)
      if (userIndex !== -1) {
        errorMessages[userIndex] = {
          ...errorMessages[userIndex],
          status: 'error',
        }
      }
      session.messages = errorMessages
      error.value = err.message || '图片生成失败'
      console.error('图片生成失败:', err)
      saveSessions()
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 清空当前会话的所有消息
   */
  function clearCurrentSession() {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.messages = []
      session.updatedAt = Date.now()
      saveSessions()
    }
  }

  /**
   * 删除指定的会话
   * @param sessionId 要删除的会话 ID
   */
  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      // 如果删除的是当前会话，切换到第一个会话或清空当前会话 ID
      if (sessionId === currentSessionId.value)
        currentSessionId.value = sessions.value[0]?.id || ''

      saveSessions()
    }
  }

  /**
   * 更新会话标题
   * @param sessionId 会话ID
   * @param title 新标题
   */
  function updateSessionTitle(sessionId: string, title: string) {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      session.title = title
      session.updatedAt = Date.now()
      saveSessions()
    }
  }

  // 初始化 Store
  initSessions()

  // 导出 Store 接口
  return {
    // State
    currentSessionId, // 当前会话ID
    sessions, // 所有会话列表
    loading, // 加载状态
    error, // 错误信息
    // Getters
    currentSession, // 当前会话
    currentMessages, // 当前会话的消息列表
    sessionList, // 会话列表
    // Actions
    createSession, // 创建会话
    switchSession, // 切换会话
    sendMessage, // 发送消息
    sendImagePrompt, // 发送图片生成请求
    clearCurrentSession, // 清空当前会话
    deleteSession, // 删除会话
    updateSessionTitle, // 更新会话标题
  }
})
