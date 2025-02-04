# Chat API 服务设计文档

## 概述

Chat API 服务是一个封装了 OpenAI API 调用的模块，提供了以下核心功能：
- 消息发送（普通消息和流式消息）
- API 密钥管理
- 错误处理
- 请求/响应拦截
- SSE（Server-Sent Events）处理

## 技术栈

- Axios：HTTP 客户端
- TypeScript：类型系统
- SSE：流式数据处理
- LocalStorage：本地存储

## 核心功能

### 1. 消息发送

#### 1.1 普通消息
```typescript
async sendMessage(messages: Message[], options = {}): Promise<ChatMessage>
```
- 功能：发送单次请求并获取完整响应
- 参数：
  - messages：消息历史记录
  - options：配置选项（可选）
- 返回：助手的响应消息
- 错误处理：统一处理网络错误和 API 错误

#### 1.2 流式消息
```typescript
async sendStreamMessage(
  messages: Message[],
  options = {},
  onProgress?: (text: string) => void,
): Promise<ChatMessage>
```
- 功能：使用 SSE 获取实时响应
- 参数：
  - messages：消息历史记录
  - options：配置选项（可选）
  - onProgress：进度回调函数
- 返回：完整的响应消息
- 特点：
  - 实时响应
  - 增量更新
  - 错误恢复

### 2. 配置管理

#### 2.1 基础配置
```typescript
const API_CONFIG = {
  baseURL: string       // API 基础地址
  model: string        // 使用的模型
  temperature: number  // 温度参数
}
```

#### 2.2 API Key 管理
```typescript
setApiKey(apiKey: string): void    // 设置 API Key
getApiKey(): string | null         // 获取 API Key
```

### 3. 请求处理

#### 3.1 请求拦截器
- 自动添加认证信息
- 设置请求头
- 错误处理

#### 3.2 响应拦截器
- 统一的错误处理
- 友好的错误信息
- 错误状态码映射

## 数据类型

### 1. 消息类型
```typescript
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
```

### 2. 请求类型
```typescript
interface ChatCompletionRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  stream?: boolean
}
```

### 3. 响应类型
```typescript
interface ChatCompletionResponse {
  id: string
  choices: {
    message: ChatMessage
    finish_reason: string
  }[]
}
```

### 4. 流式响应类型
```typescript
interface ChatStreamResponse {
  id: string
  choices: {
    delta: {
      content?: string
    }
    finish_reason?: string
  }[]
}
```

## 错误处理

### 1. 错误类型
- 401：API Key 无效或过期
- 403：权限不足
- 429：请求频率限制
- 500：服务器错误
- 网络错误
- 解析错误

### 2. 错误处理策略
- 统一的错误拦截
- 友好的错误提示
- 错误日志记录
- 错误恢复机制

## 性能优化

### 1. 请求优化
- 超时控制（60秒）
- 请求取消支持
- 错误重试机制

### 2. 数据处理优化
- 增量更新
- 数据缓存
- 内存管理

## 安全性

### 1. API Key 安全
- 本地存储
- 请求时动态获取
- 传输加密

### 2. 请求安全
- HTTPS
- CSRF 防护
- XSS 防护

## 使用示例

### 1. 发送普通消息
```typescript
const response = await chatService.sendMessage([
  { role: 'user', content: '你好' }
])
console.log(response.content)
```

### 2. 发送流式消息
```typescript
await chatService.sendStreamMessage(
  [{ role: 'user', content: '你好' }],
  {},
  (text) => {
    console.log('实时响应:', text)
  }
)
```

### 3. API Key 管理
```typescript
// 设置 API Key
chatService.setApiKey('your-api-key')

// 获取 API Key
const apiKey = chatService.getApiKey()
```

## 最佳实践

### 1. 错误处理
- 始终使用 try-catch 包装 API 调用
- 提供友好的错误提示
- 实现错误恢复机制

### 2. 流式处理
- 实现进度回调
- 处理断线重连
- 优化内存使用

### 3. 性能优化
- 合理设置超时时间
- 实现请求缓存
- 控制并发请求

## 注意事项

1. **API Key 管理**
   - 定期更新
   - 安全存储
   - 权限控制

2. **错误处理**
   - 完整的错误捕获
   - 友好的错误提示
   - 错误日志记录

3. **性能考虑**
   - 避免内存泄漏
   - 控制请求频率
   - 优化数据处理

4. **安全性**
   - 数据加密
   - 输入验证
   - 权限检查