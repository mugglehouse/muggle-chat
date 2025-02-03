import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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
  }

  function switchSession(sessionId: string) {
    currentSessionId.value = sessionId
  }

  async function sendMessage(content: string) {
    if (!currentSessionId.value || !content.trim())
      return

    const message: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'sending',
    }

    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (session) {
      session.messages.push(message)
      session.updatedAt = Date.now()
    }

    try {
      loading.value = true
      // TODO: 实现与 API 的集成
      // const response = await chatAPI.sendMessage(content)
      message.status = 'success'
    }
    catch (err) {
      message.status = 'error'
      error.value = '发送消息失败'
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
    }
  }

  function deleteSession(sessionId: string) {
    const index = sessions.value.findIndex(s => s.id === sessionId)
    if (index > -1) {
      sessions.value.splice(index, 1)
      if (sessionId === currentSessionId.value)
        currentSessionId.value = sessions.value[0]?.id || ''
    }
  }

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
