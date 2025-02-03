import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { chatService } from '../api/chat'
import { STORAGE_KEYS } from '../config'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  status: 'sending' | 'success' | 'error'
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export const useChatStore = defineStore('chat', () => {
  // state
  const currentSessionId = ref('')
  const sessions = ref<ChatSession[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 初始化时从本地存储加载会话
  const initSessions = () => {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions)
    if (savedSessions) {
      sessions.value = JSON.parse(savedSessions)
      if (sessions.value.length > 0)
        currentSessionId.value = sessions.value[0].id
    }
  }

  // 保存会话到本地存储
  const saveSessions = () => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
  }

  // getters
  const currentSession = computed(() =>
    sessions.value.find(session => session.id === currentSessionId.value),
  )

  const currentMessages = computed(() =>
    currentSession.value?.messages || [],
  )

  const sessionList = computed(() =>
    sessions.value.map(({ id, title, updatedAt }) => ({ id, title, updatedAt })),
  )

  // actions
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

  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  async function sendMessage(content: string) {
    if (!content.trim())
      return

    // 如果没有当前会话，创建一个新会话
    if (!currentSessionId.value)
      createSession()

    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'sending',
    }

    // 添加到当前会话
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session)
      return

    // 使用数组方法触发响应式更新
    session.messages = [...session.messages, userMessage]
    session.updatedAt = Date.now()
    saveSessions()

    try {
      loading.value = true
      error.value = null

      // 创建 AI 消息占位
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        status: 'sending',
      }

      // 使用数组方法触发响应式更新
      session.messages = [...session.messages, aiMessage]
      saveSessions()

      // 发送请求
      const response = await chatService.sendStreamMessage(
        session.messages.slice(0, -1), // 不包含占位消息
        {},
        (text) => {
          // 创建新的消息数组来触发响应式更新
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

      // 更新消息状态
      const finalMessages = [...session.messages]
      const userIndex = finalMessages.findIndex(msg => msg.id === userMessage.id)
      const aiIndex = finalMessages.findIndex(msg => msg.id === aiMessage.id)

      if (userIndex !== -1) {
        finalMessages[userIndex] = {
          ...finalMessages[userIndex],
          status: 'success',
        }
      }

      if (aiIndex !== -1) {
        finalMessages[aiIndex] = {
          ...finalMessages[aiIndex],
          content: response.content,
          status: 'success',
        }
      }

      session.messages = finalMessages
      session.updatedAt = Date.now()

      // 如果是第一条消息，更新会话标题
      if (session.messages.length === 2)
        session.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')

      saveSessions()
    }
    catch (err) {
      // 更新错误状态
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
      loading.value = false
    }
  }

  function clearCurrentSession() {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.messages = []
      session.updatedAt = Date.now()
      saveSessions()
    }
  }

  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (sessionId === currentSessionId.value)
        currentSessionId.value = sessions.value[0]?.id || ''

      saveSessions()
    }
  }

  // 初始化
  initSessions()

  return {
    // state
    currentSessionId,
    sessions,
    loading,
    error,
    // getters
    currentSession,
    currentMessages,
    sessionList,
    // actions
    createSession,
    switchSession,
    sendMessage,
    clearCurrentSession,
    deleteSession,
  }
})
