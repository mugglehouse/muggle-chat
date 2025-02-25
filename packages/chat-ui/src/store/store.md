# Muggle Chat Store 文档

## 一、概述

Store 使用 Pinia 进行状态管理，主要处理聊天会话和消息的状态。现支持文本消息和图片生成消息两种类型。

## 二、类型定义

### 2.1 基础消息类型
```typescript
interface BaseMessage {
  id: string          // 消息唯一标识符
  role: 'user' | 'assistant'  // 发送者角色
  timestamp: number   // 发送时间戳
  status: 'sending' | 'success' | 'error'  // 发送状态
}
```

### 2.2 具体消息类型

#### 文本消息
```typescript
interface TextMessage extends BaseMessage {
  type: 'text'      // 类型标识
  content: string   // 文本内容
}
```

#### 图片消息
```typescript
interface ImageMessage extends BaseMessage {
  type: 'image'     // 类型标识
  content: string   // 提示词
  imageUrls: string[]  // 图片URL数组
  metadata?: {
    size: '256x256' | '512x512' | '1024x1024'  // 图片尺寸
    n: number        // 生成数量
    model?: string   // 使用的模型
    created: number  // 创建时间
  }
}
```

### 2.3 会话类型
```typescript
interface ChatSession {
  id: string        // 会话唯一标识
  title: string     // 会话标题
  messages: Message[]  // 消息列表
  createdAt: number   // 创建时间
  updatedAt: number   // 更新时间
}
```

## 三、Store 功能

### 3.1 State
- `currentSessionId`: 当前选中的会话ID
- `sessions`: 所有会话列表
- `loading`: 加载状态标识
- `error`: 错误信息

### 3.2 Getters
- `currentSession`: 获取当前选中的会话
- `currentMessages`: 获取当前会话的消息列表
- `sessionList`: 获取会话列表（用于侧边栏显示）

### 3.3 Actions

#### 会话管理
- `createSession()`: 创建新会话
- `switchSession(sessionId)`: 切换当前会话
- `clearCurrentSession()`: 清空当前会话
- `deleteSession(sessionId)`: 删除指定会话
- `updateSessionTitle(sessionId, title)`: 更新会话标题

#### 消息发送
1. **文本消息**
```typescript
async function sendMessage(content: string)
```
- 发送文本消息并处理AI响应
- 支持流式响应
- 自动保存会话状态

2. **图片生成**
```typescript
async function sendImagePrompt(
  prompt: string,
  options?: Partial<ImageGenerationOptions>
)
```
- 发送图片生成请求
- 支持进度回调
- 自动保存生成结果

## 四、使用示例

### 4.1 基本使用
```typescript
import { useChatStore } from '@/store/chat'

const chatStore = useChatStore()

// 发送文本消息
await chatStore.sendMessage('你好')

// 生成图片
await chatStore.sendImagePrompt('一只可爱的猫咪', {
  size: '1024x1024',
  n: 1
})
```

### 4.2 会话管理
```typescript
// 创建新会话
chatStore.createSession()

// 切换会话
chatStore.switchSession('session-id')

// 清空当前会话
chatStore.clearCurrentSession()
```

## 五、注意事项

### 5.1 数据持久化
- 会话数据自动保存到 localStorage
- 使用 STORAGE_KEYS.sessions 作为存储键
- 每次会话更新都会触发保存

### 5.2 错误处理
- 所有操作都有适当的错误处理
- 错误信息存储在 error state 中
- 消息状态会反映失败情况

### 5.3 性能考虑
- 大量消息时的性能优化
- 消息列表的分页加载
- 图片资源的懒加载

## 六、后续优化

### 6.1 功能扩展
- 支持更多消息类型
- 消息搜索功能
- 会话分类管理

### 6.2 性能优化
- 虚拟滚动
- 消息缓存
- 图片预加载

### 6.3 用户体验
- 消息编辑
- 消息撤回
- 快捷操作
