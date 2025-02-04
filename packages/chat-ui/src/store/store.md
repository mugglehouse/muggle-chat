# Chat Store 设计文档

## 整体架构

```typescript
// 基于 Pinia 的 Store 设计
export const useChatStore = defineStore('chat', () => {
  // State 管理
  // Getters 计算
  // 工具函数
  // 存储操作
  // 会话管理
  // 消息处理
  // 导出接口
})
```

## 状态定义

### 消息类型
```typescript
interface Message {
  id: string                // 消息唯一标识
  role: 'user' | 'assistant' // 消息角色：用户/AI助手
  content: string          // 消息内容
  timestamp: number       // 时间戳
  status: 'sending' | 'success' | 'error' // 消息状态
}
```

### 会话类型
```typescript
interface ChatSession {
  id: string           // 会话唯一标识
  title: string        // 会话标题
  messages: Message[]  // 消息列表
  createdAt: number   // 创建时间
  updatedAt: number   // 更新时间
}
```

## 核心状态

```typescript
// 响应式状态
const currentSessionId = ref('') // 当前会话ID
const sessions = ref<ChatSession[]>([]) // 会话列表
const loading = ref(false) // 加载状态
const error = ref<string | null>(null) // 错误信息

// 计算属性
const currentSession = computed(() => // 当前会话
  sessions.value.find(session => session.id === currentSessionId.value)
)

const currentMessages = computed(() => // 当前消息列表
  currentSession.value?.messages || []
)

const sessionList = computed(() => // 会话列表（简化版）
  sessions.value.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
)
```

## 工具函数

### 消息和会话创建
```typescript
// 创建新消息
function createMessage(role: Message['role'], content: string): Message {
  return {
    id: Date.now().toString(),
    role,
    content,
    timestamp: Date.now(),
    status: 'sending',
  }
}

// 创建新会话
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
```

## 存储操作

```typescript
// 保存会话到本地存储
function saveSessions() {
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
}

// 从本地存储加载会话
function initSessions() {
  const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions)
  if (savedSessions) {
    sessions.value = JSON.parse(savedSessions)
    if (sessions.value.length > 0)
      currentSessionId.value = sessions.value[0].id
  }
}
```

## 会话管理

```typescript
// 切换会话
function switchSession(sessionId: string) {
  currentSessionId.value = sessionId
}

// 清空会话
function clearCurrentSession() {
  const session = sessions.value.find(s => s.id === currentSessionId.value)
  if (session) {
    session.messages = []
    session.updatedAt = Date.now()
    saveSessions()
  }
}

// 删除会话
function deleteSession(sessionId: string) {
  const index = sessions.value.findIndex(s => s.id === sessionId)
  if (index > -1) {
    sessions.value.splice(index, 1)
    if (sessionId === currentSessionId.value)
      currentSessionId.value = sessions.value[0]?.id || ''
    saveSessions()
  }
}
```

## 消息处理

### 发送消息流程
```typescript
async function sendMessage(content: string) {
  // 1. 输入验证
  if (!content.trim()) return

  // 2. 准备会话
  if (!currentSessionId.value)
    createSession()

  const session = sessions.value.find(s => s.id === currentSessionId.value)
  if (!session) return

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

    // 6. 发送请求并处理流式响应
    const response = await chatService.sendStreamMessage(
      session.messages.slice(0, -1),
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
      }
    )

    // 7. 更新最终状态
    const finalMessages = [...session.messages]
    updateMessageStatuses(finalMessages, userMessage.id, aiMessage.id, response.content)
    session.messages = finalMessages
    session.updatedAt = Date.now()

    // 8. 更新会话标题（如果是第一条消息）
    if (session.messages.length === 2)
      session.title = content.slice(0, 20) + (content.length > 20 ? '...' : '')

    saveSessions()
  } catch (err) {
    // 9. 错误处理
    handleMessageError(session, userMessage.id)
    error.value = '发送消息失败'
    console.error('发送消息失败:', err)
  } finally {
    // 10. 清理状态
    loading.value = false
  }
}
```

## 最佳实践

### 1. 状态管理
- 使用 `ref` 和 `computed` 管理响应式状态
- 统一使用 `saveSessions` 持久化数据
- 保持状态更新的原子性

### 2. 性能优化
- 使用 `computed` 缓存计算结果
- 批量更新状态
- 避免不必要的存储操作

### 3. 错误处理
- 完善的错误状态管理
- 用户友好的错误提示
- 错误状态的及时清理

### 4. 代码组织
- 按功能模块划分代码
- 清晰的函数命名
- 完善的注释说明

## 注意事项

1. **状态更新**
   - 使用展开运算符创建新数组
   - 及时更新 `updatedAt` 时间戳
   - 及时调用 `saveSessions`

2. **消息处理**
   - 验证输入内容
   - 处理流式响应
   - 维护消息状态

3. **会话管理**
   - 处理会话切换
   - 清理无效会话
   - 维护会话标题

4. **存储安全**
   - 验证存储数据
   - 处理解析异常
   - 维护数据完整性 