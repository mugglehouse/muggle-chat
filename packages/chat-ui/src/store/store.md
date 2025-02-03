# Chat Store 设计文档

## 数据结构

### Message（消息）
```typescript
interface Message {
  id: string          // 消息唯一标识
  role: 'user' | 'assistant'  // 消息角色：用户/AI助手
  content: string     // 消息内容
  timestamp: number   // 时间戳
  status: 'sending' | 'success' | 'error'  // 消息状态
}
```

### ChatSession（会话）
```typescript
interface ChatSession {
  id: string          // 会话唯一标识
  title: string       // 会话标题
  messages: Message[] // 消息列表
  createdAt: number   // 创建时间
  updatedAt: number   // 更新时间
}
```

## 状态管理 (Setup Store)

### State
```typescript
const currentSessionId = ref('')              // 当前选中的会话 ID
const sessions = ref<ChatSession[]>([])       // 所有会话列表
const loading = ref(false)                    // 加载状态
const error = ref<string | null>(null)        // 错误信息
```

### Getters (Computed)
```typescript
const currentSession = computed(() =>         // 获取当前会话详情
  sessions.value.find(session => session.id === currentSessionId.value)
)

const currentMessages = computed(() =>        // 获取当前会话的消息列表
  currentSession.value?.messages || []
)

const sessionList = computed(() =>            // 获取会话列表（用于侧边栏显示）
  sessions.value.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
)
```

### Actions
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
}

// 切换会话
function switchSession(sessionId: string) {
  currentSessionId.value = sessionId
}

// 发送消息
async function sendMessage(content: string) {
  // 创建消息
  // 更新会话
  // 调用 API
  // 处理响应
}

// 清空当前会话
function clearCurrentSession() {
  const session = sessions.value.find(s => s.id === currentSessionId.value)
  if (session) {
    session.messages = []
    session.updatedAt = Date.now()
  }
}

// 删除会话
function deleteSession(sessionId: string) {
  // 删除指定会话
  // 如果是当前会话，切换到其他会话
}
```

## 使用示例

```typescript
import { useChatStore } from '@/store'
import { storeToRefs } from 'pinia'  // 用于保持响应性

// 在组件中使用
const store = useChatStore()

// 解构时保持响应性
const { currentMessages, loading } = storeToRefs(store)
const { createSession, sendMessage } = store

// 创建新会话
createSession()

// 发送消息
await sendMessage('Hello, ChatGPT!')

// 监听消息列表变化
watchEffect(() => {
  console.log('当前消息列表：', currentMessages.value)
})
```

## 待办事项

1. 实现与 ChatGPT API 的集成
   - 创建 API 服务层
   - 处理流式响应
   - 实现打字机效果

2. 添加消息持久化存储
   - 使用 localStorage 或 IndexedDB
   - 自动保存/加载会话历史

3. 实现会话标题的自动生成
   - 基于首条消息内容
   - 使用 AI 总结对话主题

4. 添加消息重试机制
   - 失败消息重发
   - 错误提示优化

5. 优化用户体验
   - 添加加载动画
   - 实现消息状态提示
   - 支持快捷键操作 