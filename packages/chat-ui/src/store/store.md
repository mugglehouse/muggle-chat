# Chat Store 设计文档

## 整体架构

聊天状态管理采用 Pinia 组合式 API 设计，主要管理聊天会话和消息的状态。Store 分为以下几个主要部分：

- State：核心状态管理
- Getters：计算属性
- Actions：状态操作方法
- 工具函数：辅助功能
- 本地存储：持久化处理

```typescript
export const useChatStore = defineStore('chat', () => {
  // State 管理
  const currentSessionId = ref('')
  const sessions = ref<ChatSession[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters 计算属性
  const currentSession = computed(() => sessions.value.find(session => session.id === currentSessionId.value))
  const currentMessages = computed(() => currentSession.value?.messages || [])
  const sessionList = computed(() => sessions.value.map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))

  // Actions 操作方法
  function createSession() { ... }
  function sendMessage(content: string) { ... }
  // ...其他方法
})
```

## 核心数据结构

### Message（消息）
```typescript
interface Message {
  id: string                // 消息唯一标识
  role: 'user' | 'assistant' // 消息角色：用户/AI助手
  content: string           // 消息内容
  timestamp: number         // 时间戳
  status: 'sending' | 'success' | 'error' // 消息状态
}
```

### ChatSession（会话）
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

### 核心状态
- `currentSessionId`：当前选中的会话 ID
- `sessions`：所有会话列表
- `loading`：加载状态标识
- `error`：错误信息

### 计算属性
- `currentSession`：当前选中的会话对象
- `currentMessages`：当前会话的消息列表
- `sessionList`：简化的会话列表（用于侧边栏显示）

## 工具函数

### 1. 会话管理

#### 创建会话
```typescript
function createSession() {
  // 创建新会话对象
  // 更新会话列表
  // 切换到新会话
  // 保存到本地存储
}
```

#### 切换会话
```typescript
function switchSession(sessionId: string) {
  // 更新当前会话 ID
}
```

#### 删除会话
```typescript
function deleteSession(sessionId: string) {
  // 从列表中移除会话
  // 如果是当前会话，切换到其他会话
  // 保存更改
}
```

### 2. 消息处理

#### 发送消息流程
1. 输入验证
2. 会话准备
3. 创建用户消息
4. 更新状态
5. 创建 AI 消息占位
6. 发送请求
7. 处理流式响应
8. 更新最终状态
9. 错误处理

```typescript
async function sendMessage(content: string) {
  // 1. 验证输入
  if (!content.trim()) return

  try {
    // 2-6. 消息处理流程
    // 7. 处理流式响应
    // 8. 更新状态
  } catch (err) {
    // 9. 错误处理
  }
}
```

### 3. 本地存储

#### 数据持久化
```typescript
// 保存数据
function saveSessions() {
  localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
}

// 加载数据
function initSessions() {
  const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions)
  if (savedSessions) {
    sessions.value = JSON.parse(savedSessions)
    // ...初始化逻辑
  }
}
```

## 最佳实践

### 1. 状态更新原则
- 使用不可变更新方式
- 保持状态同步
- 及时持久化

### 2. 性能优化
- 使用计算属性缓存
- 批量更新状态
- 避免不必要的存储操作

### 3. 错误处理
- 完善的错误状态管理
- 用户友好的错误提示
- 错误状态的及时清理

### 4. 代码组织
- 清晰的模块划分
- 统一的命名规范
- 完整的类型定义
- 详细的注释说明

## 使用示例

### 基础用法
```typescript
const chatStore = useChatStore()

// 创建新会话
chatStore.createSession()

// 发送消息
await chatStore.sendMessage('Hello, AI!')

// 切换会话
chatStore.switchSession(sessionId)

// 清空当前会话
chatStore.clearCurrentSession()

// 删除会话
chatStore.deleteSession(sessionId)
```

### 状态订阅
```typescript
// 监听当前会话变化
watch(() => chatStore.currentSession, (newSession) => {
  // 处理会话变化
})

// 监听消息列表变化
watch(() => chatStore.currentMessages, (messages) => {
  // 处理消息变化
})
```

## 注意事项

1. **状态更新**
   - 使用响应式方法更新状态
   - 保持状态的一致性
   - 及时同步到本地存储

2. **消息处理**
   - 处理好异步操作
   - 合理展示加载状态
   - 优雅处理错误情况

3. **性能考虑**
   - 避免频繁的存储操作
   - 合理使用计算属性
   - 及时清理无用数据

4. **安全性**
   - 验证输入数据
   - 处理异常情况
   - 保护敏感信息 

# 状态管理文档

## 聊天状态管理 (useChatStore)

### 状态定义

```typescript
interface State {
  currentSessionId: string       // 当前选中的会话 ID
  sessions: ChatSession[]       // 所有会话列表
  loading: boolean             // 加载状态标识
  error: string | null        // 错误信息
}

interface ChatSession {
  id: string                  // 会话唯一标识
  title: string              // 会话标题
  messages: Message[]        // 消息列表
  createdAt: number         // 创建时间
  updatedAt: number        // 更新时间
}

interface Message {
  id: string                // 消息唯一标识
  role: 'user' | 'assistant' // 消息角色：用户/AI助手
  content: string           // 消息内容
  timestamp: number        // 时间戳
  status: 'sending' | 'success' | 'error' // 消息状态
}
```

### Getters

| 名称 | 返回类型 | 说明 |
|------|----------|------|
| currentSession | ChatSession \| undefined | 获取当前选中的会话对象 |
| currentMessages | Message[] | 获取当前会话的消息列表 |
| sessionList | { id: string; title: string; updatedAt: number }[] | 获取会话列表（按更新时间排序） |

### Actions

#### 会话管理

##### createSession
创建新的会话。
```typescript
function createSession(): void
```
- 创建一个新的空会话
- 自动切换到新创建的会话
- 保存到本地存储

##### switchSession
切换当前选中的会话。
```typescript
function switchSession(sessionId: string): void
```
- 更新当前会话 ID

##### deleteSession
删除指定的会话。
```typescript
function deleteSession(sessionId: string): void
```
- 从会话列表中删除指定会话
- 如果删除的是当前会话，自动切换到其他会话
- 更新本地存储

##### updateSessionTitle
更新会话标题。
```typescript
function updateSessionTitle(sessionId: string, title: string): void
```
- 更新指定会话的标题
- 更新会话的 updatedAt 时间戳
- 保存到本地存储

#### 消息管理

##### sendMessage
发送消息并处理响应。
```typescript
async function sendMessage(content: string): Promise<void>
```
- 验证输入内容
- 创建用户消息
- 发送到 AI 服务
- 处理流式响应
- 更新消息状态
- 自动更新会话标题（首次发送消息时）

##### clearCurrentSession
清空当前会话的所有消息。
```typescript
function clearCurrentSession(): void
```
- 清空当前会话的消息列表
- 更新会话的 updatedAt 时间戳
- 保存到本地存储

### 数据持久化

- 使用 localStorage 存储会话数据
- 在以下情况下自动保存：
  - 创建新会话
  - 删除会话
  - 更新会话标题
  - 发送/接收消息
  - 清空会话

### 使用示例

```typescript
import { useChatStore } from '@/store/chat'

const chatStore = useChatStore()

// 创建新会话
chatStore.createSession()

// 发送消息
await chatStore.sendMessage('Hello, AI!')

// 切换会话
chatStore.switchSession(sessionId)

// 更新会话标题
chatStore.updateSessionTitle(sessionId, '新标题')

// 删除会话
chatStore.deleteSession(sessionId)

// 清空当前会话
chatStore.clearCurrentSession()
```

### 注意事项

1. 会话列表按最新更新时间排序
2. 消息发送失败时会自动更新状态
3. 首次发送消息时会自动设置会话标题
4. 删除会话时会自动切换到其他会话
5. 所有会话数据都会持久化到本地存储 
