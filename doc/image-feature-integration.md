# Muggle Chat 图片功能集成方案

## 一、功能分析

### 1.1 现有功能
1. **消息系统**
   - 文本消息的发送和接收
   - 消息状态管理
   - 会话管理
   - 本地存储

2. **API系统**
   - OpenAI API封装
   - 统一的HTTP客户端
   - 错误处理机制
   - 认证管理

3. **组件系统**
   - 消息展示组件
   - 消息列表管理
   - 输入组件
   - 状态管理集成

### 1.2 新增功能
1. **图片生成**
   - 提示词输入
   - 图片生成
   - 图片预览
   - 生成历史

2. **消息扩展**
   - 图片消息类型
   - 图片消息展示
   - 图片预览
   - 保存功能

## 二、技术方案

### 2.1 类型系统扩展
```typescript
// types/message.ts
interface BaseMessage {
  id: string
  role: 'user' | 'assistant'
  timestamp: number
  status: 'sending' | 'success' | 'error'
}

interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

interface ImageMessage extends BaseMessage {
  type: 'image'
  content: string        // 提示词
  imageUrls: string[]   // 生成的图片URL
}

type Message = TextMessage | ImageMessage
```

### 2.2 API扩展
```typescript
// api/image.ts
import { http } from './chat'

export const imageService = {
  generateImage(options: ImageGenerationOptions) {
    return http({
      url: '/images/generations',
      method: 'POST',
      data: options
    })
  }
}
```

### 2.3 状态管理扩展
```typescript
// store/chat.ts
export const useChatStore = defineStore('chat', {
  state: () => ({
    // 保持现有状态不变
  }),
  actions: {
    // 新增图片生成action
    async sendImagePrompt(prompt: string) {
      // 1. 创建用户消息
      const userMessage: ImageMessage = {
        id: generateId(),
        type: 'image',
        role: 'user',
        content: prompt,
        imageUrls: [],
        timestamp: Date.now(),
        status: 'sending'
      }

      // 2. 更新会话
      this.updateSession(userMessage)

      try {
        // 3. 调用图片生成API
        const response = await imageService.generateImage({
          prompt,
          n: 1,
          size: '1024x1024'
        })

        // 4. 创建图片消息
        const imageMessage: ImageMessage = {
          id: generateId(),
          type: 'image',
          role: 'assistant',
          content: prompt,
          imageUrls: response.data.map(item => item.url),
          timestamp: Date.now(),
          status: 'success'
        }

        // 5. 更新会话
        this.updateSession(imageMessage)
      } catch (error) {
        // 错误处理
      }
    }
  }
})
```

## 三、组件开发

### 3.1 新增组件
1. **图片生成组件**
```typescript
// components/ImageGeneration/index.vue
interface Props {
  onGenerate: (prompt: string) => Promise<void>
}
```

2. **图片消息组件**
```typescript
// components/Chat/ImageMessage.vue
interface Props {
  message: ImageMessage
}
```

### 3.2 现有组件修改
1. **MessageItem.vue**
```typescript
const renderMessage = (message: Message) => {
  switch (message.type) {
    case 'text':
      return <TextMessage message={message} />
    case 'image':
      return <ImageMessage message={message} />
  }
}
```

2. **Content.vue**
```typescript
// 保持现有逻辑不变
// 消息列表会自动处理新的消息类型
```

## 四、开发步骤

### 4.1 基础设施（1天）
1. 类型定义扩展
   - 新增消息类型
   - 更新现有类型

2. API模块扩展
   - 创建图片服务
   - 集成错误处理

### 4.2 状态管理（1天）
1. Store扩展
   - 添加图片生成action
   - 更新消息处理逻辑

2. 本地存储适配
   - 确保新消息类型可以正确序列化
   - 处理历史数据兼容

### 4.3 组件开发（2天）
1. 图片生成组件
   - 提示词输入
   - 生成选项
   - 预览功能

2. 图片消息组件
   - 消息展示
   - 图片预览
   - 保存功能

### 4.4 集成测试（1天）
1. 功能测试
   - 图片生成流程
   - 消息展示
   - 错误处理

2. 性能测试
   - 图片加载
   - 消息列表性能

## 五、注意事项

### 5.1 兼容性
- 保持现有消息系统的兼容性
- 确保历史数据不受影响
- 平滑处理类型转换

### 5.2 性能
- 图片懒加载
- 消息列表性能优化
- 合理的缓存策略

### 5.3 用户体验
- 生成过程的loading状态
- 友好的错误提示
- 图片预览体验

## 六、后续优化

### 6.1 功能优化
- 批量生成支持
- 图片编辑功能
- 提示词模板

### 6.2 性能优化
- 图片压缩
- 预加载策略
- 缓存优化 