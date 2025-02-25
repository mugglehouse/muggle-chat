# Muggle Chat 图片生成功能集成方案

## 一、现有项目分析

### 1.1 已有模块
1. **API模块** (`packages/chat-ui/src/api/`)
   - `chat.ts`: 封装了OpenAI聊天API
   - 已实现的功能：
     - HTTP请求封装
     - 认证处理
     - 错误处理
     - 流式响应处理

2. **配置模块** (`packages/chat-ui/src/config/`)
   - `index.ts`: 全局配置文件
   - 已包含：
     - API基础配置
     - 模型配置
     - 存储键配置

3. **状态管理** (`packages/chat-ui/src/store/`)
   - 使用Pinia管理状态
   - 已实现消息管理功能

4. **组件系统** (`packages/chat-ui/src/components/`)
   - 已有聊天相关组件
   - 消息展示组件

### 1.2 需要新增/修改的模块

1. **类型定义** (`packages/chat-ui/src/types/`)
   ```typescript
   // types/image.ts（新增）
   export interface ImageGenerationOptions {
     prompt: string
     n?: number
     size?: '256x256' | '512x512' | '1024x1024'
     responseFormat?: 'url' | 'b64_json'
   }

   // types/message.ts（扩展）
   export interface ImageMessage extends BaseMessage {
     type: 'image'
     content: string
     imageUrls: string[]
     options?: {
       size: string
       n: number
     }
   }
   ```

2. **API扩展** (`packages/chat-ui/src/api/`)
   ```typescript
   // api/image.ts（新增）
   import { http } from './chat'  // 复用现有的HTTP客户端

   export const imageService = {
     generateImage(options: ImageGenerationOptions) {
       return http<ImageGenerationResponse>({
         url: '/images/generations',
         method: 'POST',
         data: options
       })
     }
   }
   ```

3. **配置扩展** (`packages/chat-ui/src/config/`)
   ```typescript
   // config/index.ts（扩展）
   export const API_CONFIG = {
     // 现有配置
     ...existingConfig,
     
     // 图片生成配置
     image: {
       baseURL: 'https://api.openai.com/v1/images',
       defaultSize: '1024x1024',
       maxTokens: 1000,
       supportedFormats: ['url', 'b64_json']
     }
   }
   ```

4. **组件开发** (`packages/chat-ui/src/components/`)
   - ImageGeneration/（新增目录）
     - index.vue
     - PromptInput.vue
     - ImagePreview.vue
   - Chat/（修改现有）
     - MessageItem.vue（扩展支持图片消息）
     - ImageMessage.vue（新增）

## 二、开发步骤

### 2.1 基础设施扩展（1天）
1. 扩展配置文件
   - 添加图片生成相关配置
   - 配置API endpoints

2. 添加类型定义
   - 创建 types/image.ts
   - 扩展 types/message.ts

3. 扩展API模块
   - 创建 api/image.ts
   - 复用现有HTTP客户端
   - 实现图片生成API

### 2.2 状态管理扩展（1天）
1. 扩展消息类型
   ```typescript
   // store/chat.ts
   export interface ChatState {
     // 现有状态
     messages: (TextMessage | ImageMessage)[]
     // ...
   }
   ```

2. 添加图片消息处理
   ```typescript
   // store/chat.ts
   export const useChatStore = defineStore('chat', {
     // ...现有代码
     actions: {
       async sendImagePrompt(prompt: string, options?: ImageGenerationOptions) {
         // 实现图片生成逻辑
       }
     }
   })
   ```

### 2.3 组件开发（3天）

1. 创建基础组件
   - PromptInput.vue
   - ImagePreview.vue
   - GenerationOptions.vue

2. 扩展现有组件
   - 修改 MessageItem.vue
   - 添加 ImageMessage.vue

3. 样式集成
   - 确保与现有UI风格一致
   - 响应式设计
   - 动画效果

### 2.4 功能集成（2天）

1. 路由集成
   - 添加图片生成相关路由（如需要）
   - 更新导航菜单

2. 消息流集成
   - 图片生成消息处理
   - 消息展示适配
   - 历史记录支持

3. 错误处理
   - API错误处理
   - 用户提示
   - 重试机制

### 2.5 测试和优化（1天）

1. 功能测试
   - API调用测试
   - 消息流测试
   - 界面交互测试

2. 性能优化
   - 图片加载优化
   - 缓存策略
   - 请求优化

## 三、注意事项

### 3.1 代码复用
- 尽可能复用现有的HTTP客户端
- 复用现有的错误处理机制
- 复用现有的状态管理模式

### 3.2 兼容性
- 确保新功能不影响现有功能
- 保持代码风格一致
- 保持类型定义完整

### 3.3 性能考虑
- 图片懒加载
- 合理的缓存策略
- 请求节流和防抖

## 四、后续规划

### 4.1 功能优化
- 提示词联想
- 图片编辑
- 批量生成
- 历史记录管理

### 4.2 性能优化
- 图片压缩
- 预加载策略
- 缓存优化

### 4.3 用户体验
- 快捷操作
- 移动端适配
- 主题支持 