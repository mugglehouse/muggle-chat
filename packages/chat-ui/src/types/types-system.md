# Muggle Chat 类型系统文档

## 一、消息类型系统

### 1.1 基础消息类型
```typescript
interface BaseMessage {
  id: string          // 消息唯一标识符
  role: 'user' | 'assistant'  // 发送者角色
  timestamp: number   // 发送时间戳
  status: 'sending' | 'success' | 'error'  // 发送状态
}
```

### 1.2 具体消息类型

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
  metadata?: ImageMetadata  // 图片元数据
}

interface ImageMetadata {
  size: '256x256' | '512x512' | '1024x1024'  // 图片尺寸
  n: number        // 生成数量
  model?: string   // 使用的模型
  created: number  // 创建时间
}
```

### 1.3 类型使用示例
```typescript
// 创建文本消息
const textMessage: TextMessage = {
  id: '1',
  role: 'user',
  type: 'text',
  content: 'Hello',
  timestamp: Date.now(),
  status: 'success'
}

// 创建图片消息
const imageMessage: ImageMessage = {
  id: '2',
  role: 'assistant',
  type: 'image',
  content: 'A beautiful sunset',
  imageUrls: ['https://...'],
  metadata: {
    size: '1024x1024',
    n: 1,
    created: Date.now()
  },
  timestamp: Date.now(),
  status: 'success'
}
```

## 二、图片生成类型系统

### 2.1 请求选项
```typescript
interface ImageGenerationOptions {
  prompt: string    // 提示词
  n?: number        // 生成数量（1-10）
  size?: '256x256' | '512x512' | '1024x1024'  // 图片尺寸
  responseFormat?: 'url' | 'b64_json'  // 返回格式
  user?: string     // 用户标识
}
```

### 2.2 响应数据
```typescript
interface ImageGenerationResponse {
  created: number   // 创建时间戳
  data: ImageData[] // 图片数据数组
}

interface ImageData {
  url?: string      // 图片URL
  b64_json?: string // Base64图片数据
}
```

### 2.3 错误类型
```typescript
interface ImageGenerationError {
  message: string   // 错误信息
  type: string      // 错误类型
  code: string      // 错误代码
}
```

## 三、类型系统设计说明

### 3.1 设计原则
1. **可扩展性**：
   - 使用基础接口（BaseMessage）作为基类
   - 通过类型字段区分不同消息
   - 支持元数据扩展

2. **类型安全**：
   - 使用严格的类型定义
   - 避免使用any类型
   - 提供完整的类型注释

3. **代码复用**：
   - 合理使用接口继承
   - 提取共用类型
   - 保持类型定义的一致性

### 3.2 使用注意事项
1. **消息类型**：
   - 始终指定消息类型（type字段）
   - 确保必填字段完整
   - 正确处理可选字段

2. **图片生成**：
   - 验证提示词长度
   - 检查图片数量限制
   - 处理不同的返回格式

3. **错误处理**：
   - 类型化的错误处理
   - 提供详细的错误信息
   - 支持错误追踪

### 3.3 后续扩展
1. **新消息类型**：
   - 文件消息
   - 语音消息
   - 富文本消息

2. **元数据扩展**：
   - 消息引用
   - 消息标签
   - 消息统计

3. **类型优化**：
   - 性能优化
   - 类型推导优化
   - 文档完善 