# Store 状态管理设计文档

## 状态结构

### 消息类型
```typescript
interface Message {
  id: string              // 消息唯一标识
  role: 'user' | 'assistant'  // 消息角色
  content: string         // 消息内容
  timestamp: number       // 时间戳
  status: 'sending' | 'success' | 'error'  // 消息状态
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

## 状态管理

### 核心状态
```typescript
const currentSessionId = ref('')  // 当前会话ID
const sessions = ref<ChatSession[]>([])  // 会话列表
const loading = ref(false)  // 加载状态
const error = ref<string | null>(null)  // 错误信息
```

### 计算属性
```typescript
const currentSession = computed(() =>
  sessions.value.find(session => session.id === currentSessionId.value)
)

const currentMessages = computed(() =>
  currentSession.value?.messages || []
)

const sessionList = computed(() =>
  sessions.value.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
)
```

## 功能实现

### 1. 会话管理
```typescript
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

// 切换会话
function switchSession(sessionId: string) {
  currentSessionId.value = sessionId
}

// 清空当前会话
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

### 2. 消息处理
```typescript
async function sendMessage(content: string) {
  // 创建用户消息
  const userMessage: Message = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: Date.now(),
    status: 'sending',
  }

  // 使用数组方法触发响应式更新
  session.messages = [...session.messages, userMessage]

  // 创建 AI 消息占位
  const aiMessage: Message = {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: '',
    timestamp: Date.now(),
    status: 'sending',
  }
  session.messages = [...session.messages, aiMessage]

  // 处理流式响应
  const response = await chatService.sendStreamMessage(
    session.messages.slice(0, -1),
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
      }
    }
  )
}
```

## 本地存储

### 1. 存储实现
```typescript
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
```

## 响应式更新

### 1. 数组更新
- 使用展开运算符创建新数组
- 避免直接修改数组元素
- 触发深层响应式更新

### 2. 对象更新
- 使用解构赋值创建新对象
- 保持对象引用的一致性
- 确保响应式追踪

## 最佳实践

### 1. 状态管理
- 集中管理应用状态
- 保持状态的响应式
- 及时持久化数据

### 2. 性能优化
- 避免不必要的更新
- 优化大量数据的处理
- 合理使用计算属性

### 3. 错误处理
- 完善的错误状态
- 用户友好的提示
- 异常状态的恢复

### 4. 数据持久化
- 定期保存状态
- 防止数据丢失
- 优化存储结构 