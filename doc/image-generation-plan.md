# Muggle Chat 图片生成功能开发计划

## 一、功能概述

### 1.1 基础功能
- 支持通过文本提示词生成图片
- 在聊天界面中显示生成的图片
- 支持图片尺寸选择
- 支持生成多张图片

### 1.2 用户体验
- 生成过程中显示加载状态
- 图片加载失败时显示错误提示
- 支持图片预览和放大
- 支持重新生成功能

## 二、技术方案

### 2.1 目录结构
```typescript
packages/chat-ui/src/
  ├── components/
  │   ├── ImageGeneration/
  │   │   ├── index.vue           // 图片生成主组件
  │   │   ├── PromptInput.vue     // 提示词输入组件
  │   │   ├── ImagePreview.vue    // 图片预览组件
  │   │   └── GenerationOptions.vue // 生成选项组件
  │   └── Chat/
  │       ├── MessageItem.vue     // 消息项组件（需要更新）
  │       └── ImageMessage.vue    // 图片消息组件
  ├── api/
  │   └── image.ts               // 图片生成API封装
  ├── types/
  │   ├── message.ts            // 消息类型定义
  │   └── image.ts              // 图片相关类型定义
  ├── hooks/
  │   └── useImageGeneration.ts // 图片生成逻辑封装
  └── store/
      └── chat.ts              // 聊天状态管理（需要更新）
```

### 2.2 类型定义
```typescript
// types/image.ts
export interface ImageGenerationOptions {
  prompt: string
  n?: number
  size?: '256x256' | '512x512' | '1024x1024'
  responseFormat?: 'url' | 'b64_json'
  user?: string
}

export interface ImageGenerationResponse {
  created: number
  data: {
    url: string
  }[]
}

// types/message.ts
export interface ImageMessage extends BaseMessage {
  type: 'image'
  content: string        // 提示词
  imageUrls: string[]   // 生成的图片URL数组
  options?: {
    size: string
    n: number
  }
}
```

### 2.3 API封装
```typescript
// api/image.ts
export const imageService = {
  generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse>
}
```

## 三、开发步骤

### 3.1 基础设施搭建（1天）
1. 创建必要的目录结构
2. 添加类型定义
3. 配置OpenAI图片生成API
4. 实现基础工具函数

### 3.2 API层实现（1天）
1. 实现图片生成API封装
2. 添加错误处理
3. 实现请求重试机制
4. 添加响应数据验证

### 3.3 组件开发（2天）
1. 实现提示词输入组件
   - 文本输入框
   - 字数限制（1000字）
   - 提交按钮
   
2. 实现生成选项组件
   - 图片尺寸选择
   - 图片数量选择
   
3. 实现图片预览组件
   - 图片展示
   - 加载状态
   - 错误处理
   - 放大预览

### 3.4 状态管理（1天）
1. 更新消息类型
2. 添加图片消息处理
3. 实现消息持久化
4. 添加生成历史记录

### 3.5 集成和测试（1天）
1. 组件集成
2. 功能测试
3. 性能优化
4. 用户体验改进

## 四、具体实现步骤

### 4.1 第一步：基础设施
1. 创建目录结构
2. 添加必要的依赖
3. 实现类型定义

### 4.2 第二步：API实现
1. 配置OpenAI API
2. 实现图片生成服务
3. 添加错误处理

### 4.3 第三步：核心组件
1. 实现提示词输入
2. 实现选项配置
3. 实现图片预览

### 4.4 第四步：消息集成
1. 更新消息组件
2. 实现图片消息展示
3. 添加交互功能

### 4.5 第五步：优化和测试
1. 性能优化
2. 错误处理
3. 用户体验改进

## 五、注意事项

### 5.1 API限制
- 提示词最大长度：1000字符
- 图片尺寸选项：256x256、512x512、1024x1024
- 单次生成数量：最多10张
- API费用考虑

### 5.2 性能考虑
- 图片懒加载
- 缓存策略
- 请求节流
- 错误重试

### 5.3 用户体验
- 加载状态提示
- 错误信息展示
- 操作反馈
- 移动端适配

## 六、后续优化

### 6.1 功能扩展
- 提示词模板
- 图片保存功能
- 历史记录管理
- 批量生成功能

### 6.2 性能优化
- 图片压缩
- 预加载优化
- 缓存策略优化

### 6.3 体验优化
- 快捷操作
- 键盘支持
- 手势操作
- 主题适配 