# Muggle Chat API 实现文档

## 一、API架构

### 1.1 文件结构
```
src/api/
├── chat.ts    # 聊天相关API
├── image.ts   # 图片生成API
└── http.ts    # HTTP请求封装
```

### 1.2 配置系统
```typescript
// API配置
export const API_CONFIG = {
  baseURL: '...',           // API基础URL
  model: '...',            // 对话模型
  temperature: 0.7,        // 温度系数
  imageGeneration: {
    model: 'dall-e-3',     // 图片生成模型
    defaultSize: '1024x1024', // 默认图片尺寸
    maxTokens: 4000,       // 最大token数
    supportedFormats: ['url', 'b64_json'], // 支持的格式
    limits: {
      maxImages: 10,       // 最大图片数
      minSize: 256,        // 最小尺寸
      maxSize: 1024        // 最大尺寸
    }
  }
}
```

## 二、图片生成API实现

### 2.1 核心功能
`imageService` 对象提供以下方法：

1. **generateImage**: 生成图片
   ```typescript
   async generateImage(
     options: ImageGenerationOptions,
     onProgress?: (progress: number) => void
   ): Promise<ImageGenerationResponse>
   ```

2. **getSupportedSizes**: 获取支持的图片尺寸
   ```typescript
   getSupportedSizes(): string[]
   ```

3. **getSupportedFormats**: 获取支持的返回格式
   ```typescript
   getSupportedFormats(): string[]
   ```

4. **getLimits**: 获取图片生成限制
   ```typescript
   getLimits(): ImageGenerationLimits
   ```

### 2.2 使用示例

#### 基本使用
```typescript
import { imageService } from '@/api/image'

try {
  const result = await imageService.generateImage({
    prompt: '一只可爱的猫咪',
    n: 1,
    size: '1024x1024'
  })
  console.log('生成的图片URL:', result.data[0].url)
} catch (error) {
  console.error('图片生成失败:', error.message)
}
```

#### 带进度回调
```typescript
const onProgress = (progress: number) => {
  console.log(`生成进度: ${progress}%`)
}

await imageService.generateImage({
  prompt: '一只可爱的猫咪'
}, onProgress)
```

#### 选项验证
```typescript
// 验证会自动进行，包括：
// - 提示词长度检查
// - 图片数量限制
// - 尺寸范围检查
```

## 三、注意事项

### 3.1 API限制
1. 提示词长度限制：4000字符
2. 单次请求最大图片数：10张
3. 图片尺寸限制：256x256 到 1024x1024

### 3.2 错误处理
1. 网络错误
2. 参数验证错误
3. API限额错误
4. 服务器错误

### 3.3 性能考虑
1. 大文件上传进度监控
2. 请求超时处理
3. 错误重试机制

## 四、后续优化

### 4.1 功能扩展
1. 支持更多图片格式
2. 添加图片编辑功能
3. 实现图片变体生成

### 4.2 性能优化
1. 请求缓存
2. 并发请求限制
3. 失败重试策略

### 4.3 用户体验
1. 更详细的进度反馈
2. 更友好的错误提示
3. 预览功能优化 