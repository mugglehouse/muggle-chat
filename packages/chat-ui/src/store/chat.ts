import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { chatService } from '../api/chat'
import { STORAGE_KEYS } from '../config'

// ---------------------------- 类型定义 ----------------------------

/**
 * 消息类型
 */
export interface Message {
  id: string // 消息唯一标识
  role: 'user' | 'assistant' // 消息角色：用户/AI助手
  content: string // 消息内容
  timestamp: number // 时间戳
  status: 'sending' | 'success' | 'error' // 消息状态
}

/**
 * 会话类型
 */
export interface ChatSession {
  id: string // 会话唯一标识
  title: string // 会话标题
  messages: Message[] // 消息列表
  createdAt: number // 创建时间
  updatedAt: number // 更新时间
}

// ---------------------------- Store 定义 ----------------------------

export const useChatStore = defineStore('chat', () => {
  // ---------------------------- State ----------------------------

  const currentSessionId = ref('') // 当前会话ID
  const sessions = ref<ChatSession[]>([]) // 会话列表
  const loading = ref(false) // 加载状态
  const error = ref<string | null>(null) // 错误信息

  // ---------------------------- Getters ----------------------------

  /**
   * 当前会话
   */
  const currentSession = computed(() =>
    sessions.value.find(session => session.id === currentSessionId.value),
  )

  /**
   * 当前会话的消息列表
   */
  const currentMessages = computed(() =>
    currentSession.value?.messages || [],
  )

  /**
   * 会话列表（简化版，用于显示）
   */
  const sessionList = computed(() =>
    sessions.value.map(({ id, title, updatedAt }) => ({ id, title, updatedAt })),
  )

  // ---------------------------- 工具函数 ----------------------------

  /**
   * 创建新消息
   */
  function createMessage(role: Message['role'], content: string): Message {
    return {
      id: Date.now().toString(),
      role,
      content,
      timestamp: Date.now(),
      status: 'sending',
    }
  }

  /**
   * 创建新会话
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

  // ---------------------------- 存储操作 ----------------------------

  /**
   * 保存会话到本地存储
   */
  function saveSessions() {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
  }

  /**
   * 从本地存储加载会话
   */
  function initSessions() {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions)
    if (savedSessions) {
      sessions.value = JSON.parse(savedSessions)
      if (sessions.value.length > 0)
        currentSessionId.value = sessions.value[0].id
    }
  }

  // ---------------------------- 会话管理 ----------------------------

  /**
   * 切换当前会话
   */
  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  /**
   * 清空当前会话
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
   * 删除会话
   */
  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (sessionId === currentSessionId.value)
        currentSessionId.value = sessions.value[0]?.id || ''
      saveSessions()
    }
  }

  // ---------------------------- 消息处理 ----------------------------

  /**
   * 发送消息
   * @param content 消息内容
   */
  async function sendMessage(content: string) {
    // 1. 输入验证
    if (!content.trim())
      return

    // 2. 准备会话
    if (!currentSessionId.value)
      createSession()

    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session)
      return

    // 3. 创建用户消息
    const userMessage = createMessage('user', content)
    session.messages = [...session.messages, userMessage]
    session.updatedAt = Date.now()
    saveSessions()

    try {
      // 4. 更新状态
      loading.value = true
      error.value = null

      // 5. 创建 AI 消息占位
      const aiMessage = createMessage('assistant', '')
      session.messages = [...session.messages, aiMessage]
      saveSessions()

      // 6. 发送请求
      const response = await chatService.sendStreamMessage(
        session.messages.slice(0, -1), // 不包含占位消息
        {},
        (text) => {
          // 实时更新 AI 消息内容
          const messageIndex = session.messages.findIndex(msg => msg.id === aiMessage.id)
          if (messageIndex !== -1) {
            const updatedMessages = [...session.messages]
            updatedMessages[messageIndex] = {
              ...aiMessage,
              content: text,
            }
            session.messages = updatedMessages
            session.updatedAt = Date.now()
            saveSessions()
          }
        },
      )

      // 7. 更新最终状态
      const finalMessages = [...session.messages]
      const userIndex = finalMessages.findIndex(msg => msg.id === userMessage.id)
      const aiIndex = finalMessages.findIndex(msg => msg.id === aiMessage.id)

      // 更新用户消息状态
      if (userIndex !== -1) {
        finalMessages[userIndex] = {
          ...finalMessages[userIndex],
          status: 'success',
        }
      }

      // 更新 AI 消息状态和内容
      if (aiIndex !== -1) {
        finalMessages[aiIndex] = {
          ...finalMessages[aiIndex],
          content: response.content,
          status: 'success',
        }
      }

      session.messages = finalMessages
      session.updatedAt = Date.now()

      // 8. 更新会话标题（如果是第一条消息）
      if (session.messages.length === 2)
        session.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')

      saveSessions()
    }
    catch (err) {
      // 9. 错误处理
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

  // 初始化
  initSessions()

  // ---------------------------- 导出接口 ----------------------------
  return {
    // State
    currentSessionId,
    sessions,
    loading,
    error,
    // Getters
    currentSession,
    currentMessages,
    sessionList,
    // Actions
    createSession,
    switchSession,
    sendMessage,
    clearCurrentSession,
    deleteSession,
  }
})
