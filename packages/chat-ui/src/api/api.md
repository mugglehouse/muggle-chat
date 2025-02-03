# Chat API 服务设计文档

## 服务职责

Chat API 服务负责：
1. 与 OpenAI API 通信
2. 处理消息发送和接收
3. 管理 API 配置
4. 处理流式响应

## 配置项

```typescript
// API 基础配置
const API_CONFIG = {
  baseURL: import.meta.env.VITE_OPENAI_API_URL,
  model: import.meta.env.VITE_OPENAI_API_MODEL,
  temperature: Number(import.meta.env.VITE_OPENAI_API_TEMPERATURE),
}
```

## 类型定义

### 请求类型
```typescript
interface ChatCompletionRequest {
  model: string                // 使用的模型
  messages: {                  // 消息历史
    role: 'system' | 'user' | 'assistant'
    content: string
  }[]
  temperature?: number        // 温度参数
  stream?: boolean           // 是否使用流式响应
}
```

### 响应类型
```typescript
interface ChatCompletionResponse {
  id: string
  choices: {
    message: {
      role: 'assistant'
      content: string
    }
    finish_reason: string
  }[]
}
```

## 功能实现

### 1. API 实例配置
```typescript
const chatAPI = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 添加 API Key
chatAPI.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey)
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`
    config.headers['x-requested-with'] = 'XMLHttpRequest'
  }
  return config
})
```

### 2. 普通消息发送
```typescript
async sendMessage(messages: Message[], options = {}) {
  const request = {
    model: API_CONFIG.model,
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    })),
    temperature: API_CONFIG.temperature,
    ...options,
  }
  
  const response = await chatAPI.post('/chat/completions', request)
  return response.data.choices[0].message
}
```

### 3. 流式消息处理
```typescript
async sendStreamMessage(
  messages: Message[],
  options = {},
  onProgress?: (text: string) => void,
) {
  const request = {
    model: API_CONFIG.model,
    messages,
    temperature: API_CONFIG.temperature,
    stream: true,
    ...options,
  }

  const response = await fetch(`${API_CONFIG.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify(request),
  })

  // 处理流式响应
  const text = await response.text()
  const lines = text.split('\n')
  let responseText = ''

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6)
      if (data === '[DONE]') continue

      const parsed = JSON.parse(data)
      const content = parsed.choices[0]?.delta?.content || ''
      if (content) {
        responseText += content
        onProgress?.(responseText)
      }
    }
  }

  return {
    role: 'assistant',
    content: responseText,
  }
}
```

## API 方法

1. **sendMessage**
   - 发送普通消息
   - 返回完整响应
   - 支持自定义选项

2. **sendStreamMessage**
   - 发送流式消息
   - 支持进度回调
   - 实时返回内容

3. **setApiKey/getApiKey**
   - 管理 API Key
   - 本地存储集成
   - 安全处理

## 错误处理

1. **网络错误**
   - 请求超时
   - 连接失败
   - 服务器错误

2. **认证错误**
   - API Key 无效
   - 权限不足
   - 认证过期

3. **响应解析错误**
   - JSON 解析失败
   - 数据格式错误
   - 流式数据处理错误

## 安全考虑

1. **API Key 管理**
   - 本地安全存储
   - 请求时动态获取
   - 不进行加密存储

2. **请求安全**
   - HTTPS 传输
   - 添加 CSRF 防护
   - 验证响应来源

## 性能优化

1. **请求优化**
   - 避免重复请求
   - 合理的超时设置
   - 错误重试机制

2. **响应处理**
   - 流式数据高效处理
   - 增量更新优化
   - 内存使用优化

## 最佳实践

1. **API Key 使用**
   - 及时验证有效性
   - 错误提示友好化
   - 支持快速更新

2. **流式响应**
   - 实时显示响应
   - 优雅降级处理
   - 完整性保证

3. **错误处理**
   - 详细的错误信息
   - 用户友好提示
   - 日志记录完善

## 使用示例

```typescript
// 发送普通消息
const response = await chatService.sendMessage([
  { role: 'user', content: '你好' }
])

// 发送流式消息
await chatService.sendStreamMessage(
  [{ role: 'user', content: '你好' }],
  {},
  (text) => {
    console.log('实时响应:', text)
  }
)

// 设置 API Key
chatService.setApiKey('your-api-key')
```

## 待办事项

1. 功能完善
   - [ ] 添加更多模型支持
   - [ ] 实现重试机制
   - [ ] 添加请求超时处理
   - [ ] 支持并发请求限制

2. 错误处理
   - [ ] 完善错误类型
   - [ ] 添加错误重试
   - [ ] 优化错误提示
   - [ ] 实现错误日志

3. 性能优化
   - [ ] 添加请求缓存
   - [ ] 优化流式处理
   - [ ] 实现请求队列
   - [ ] 添加请求取消支持

4. 安全性
   - [ ] 加密 API Key
   - [ ] 添加请求验证
   - [ ] 实现速率限制
   - [ ] 添加安全检查

## 注意事项

1. **API 密钥管理**
   - 安全存储
   - 定期更新
   - 访问控制

2. **错误处理**
   - 网络错误
   - API 限制
   - 响应超时

3. **性能考虑**
   - 避免重复请求
   - 优化数据处理
   - 控制并发数量 