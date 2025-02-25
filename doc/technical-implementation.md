# Muggle Chat 多模态对话技术方案

## 一、API升级方案

### 1.1 模型升级
```typescript
// config.ts
export const API_CONFIG = {
  // 升级模型
  model: 'gpt-4-vision-preview',  // 支持图像理解
  baseURL: 'https://api.openai.com/v1',
  temperature: 0.7,
  max_tokens: 4096,              // 新增token限制
  // 图片相关配置
  image: {
    maxSize: 20 * 1024 * 1024,  // 20MB
    supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxDimension: 2048,         // OpenAI对图片尺寸有限制
    quality: 0.8                // 压缩质量
  },
  // PDF相关配置
  pdf: {
    maxSize: 50 * 1024 * 1024,  // 50MB
    supportedVersion: '1.7',     // PDF版本支持
    maxPages: 100               // 页数限制
  }
}
```

### 1.2 消息结构升级
```typescript
// types/message.ts
export interface BaseMessage {
  id: string
  role: 'user' | 'assistant'
  timestamp: number
  status: 'sending' | 'success' | 'error'
}

// 文本消息
export interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
}

// 图片消息
export interface ImageMessage extends BaseMessage {
  type: 'image'
  content: {
    type: 'image_url'
    image_url: {
      url: string
      detail: 'auto' | 'low' | 'high'
    }
    caption?: string  // 图片描述
  }[]
  fileInfo: {
    fileName: string
    fileSize: number
    mimeType: string
    dimensions?: {
      width: number
      height: number
    }
  }
}

// PDF消息
export interface PDFMessage extends BaseMessage {
  type: 'pdf'
  content: string        // PDF文本内容（提取的）
  fileInfo: {
    fileName: string
    fileSize: number
    pageCount: number
    url: string         // PDF文件URL
  }
}

export type Message = TextMessage | ImageMessage | PDFMessage
```

## 二、文件处理流程

### 2.1 图片处理流程
```typescript
// hooks/useImageUpload.ts
async function handleImageUpload(file: File): Promise<ImageMessage> {
  // 1. 验证文件
  validateImage(file)
  
  // 2. 图片预处理
  const processedImage = await preprocessImage(file)
  
  // 3. 上传到图床
  const uploadResult = await uploadToStorage(processedImage)
  
  // 4. 构建消息
  return {
    id: generateId(),
    role: 'user',
    type: 'image',
    content: [{
      type: 'image_url',
      image_url: {
        url: uploadResult.url,
        detail: 'auto'
      },
      caption: file.name
    }],
    fileInfo: {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      dimensions: await getImageDimensions(file)
    },
    timestamp: Date.now(),
    status: 'sending'
  }
}
```

### 2.2 PDF处理流程
```typescript
// hooks/usePDFUpload.ts
async function handlePDFUpload(file: File): Promise<PDFMessage> {
  // 1. 验证文件
  validatePDF(file)
  
  // 2. 提取文本内容
  const textContent = await extractPDFText(file)
  
  // 3. 上传文件
  const uploadResult = await uploadToStorage(file)
  
  // 4. 构建消息
  return {
    id: generateId(),
    role: 'user',
    type: 'pdf',
    content: textContent,
    fileInfo: {
      fileName: file.name,
      fileSize: file.size,
      pageCount: await getPDFPageCount(file),
      url: uploadResult.url
    },
    timestamp: Date.now(),
    status: 'sending'
  }
}
```

## 三、API通信升级

### 3.1 发送消息
```typescript
// api/chat.ts
async function sendMessage(messages: Message[]) {
  const formattedMessages = messages.map(formatMessage)
  
  const response = await http<ChatCompletionResponse>({
    url: '/chat/completions',
    data: {
      model: API_CONFIG.model,
      messages: formattedMessages,
      temperature: API_CONFIG.temperature,
      max_tokens: API_CONFIG.max_tokens,
      response_format: {
        type: "text"  // 或 "json_object"
      }
    }
  })
  
  return response.choices[0].message
}

// 消息格式化
function formatMessage(message: Message) {
  switch (message.type) {
    case 'text':
      return {
        role: message.role,
        content: message.content
      }
    case 'image':
      return {
        role: message.role,
        content: message.content
      }
    case 'pdf':
      return {
        role: message.role,
        content: message.content  // PDF提取的文本
      }
  }
}
```

### 3.2 流式响应处理
```typescript
// api/chat.ts
async function sendStreamMessage(
  messages: Message[],
  onProgress?: (text: string) => void,
) {
  const formattedMessages = messages.map(formatMessage)
  
  let responseText = ''
  
  await http<string>({
    url: '/chat/completions',
    data: {
      model: API_CONFIG.model,
      messages: formattedMessages,
      temperature: API_CONFIG.temperature,
      max_tokens: API_CONFIG.max_tokens,
      stream: true
    },
    headers: {
      'Accept': 'text/event-stream'
    },
    onDownloadProgress: handleStreamProgress(
      (text) => {
        responseText = text
        onProgress?.(text)
      }
    )
  })
  
  return {
    role: 'assistant' as const,
    type: 'text' as const,
    content: responseText
  }
}
```

## 四、存储方案实现

### 4.1 前期测试方案（ImgBB）
```typescript
// api/upload.ts
async function uploadToImgBB(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('key', IMGBB_API_KEY)
  
  const response = await axios.post('https://api.imgbb.com/1/upload', formData)
  
  return {
    url: response.data.data.url,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type
  }
}
```

### 4.2 正式方案（七牛云）
```typescript
// api/upload.ts
async function uploadToQiniu(file: File): Promise<UploadResponse> {
  // 1. 获取上传token
  const token = await getQiniuToken()
  
  // 2. 构建上传请求
  const formData = new FormData()
  formData.append('file', file)
  formData.append('token', token)
  
  // 3. 上传文件
  const response = await axios.post('https://upload.qiniup.com', formData)
  
  return {
    url: QINIU_DOMAIN + response.data.key,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type
  }
}
```

## 五、开发步骤

### 5.1 基础设施（3天）
1. 升级API配置
2. 实现新的类型定义
3. 配置图床服务
4. 实现基础工具函数

### 5.2 文件处理（4天）
1. 图片预处理功能
2. PDF文本提取
3. 文件验证
4. 上传功能

### 5.3 消息系统升级（3天）
1. 升级消息组件
2. 实现预览功能
3. 适配新的API格式

### 5.4 UI组件（3天）
1. 文件上传组件
2. 预览组件
3. 进度显示

### 5.5 测试和优化（2天）
1. 单元测试
2. 性能测试
3. 用户体验优化

## 六、注意事项

### 6.1 API限制
- 图片大小：最大20MB
- 图片格式：JPEG, PNG, GIF, WebP
- 图片分辨率：建议不超过2048x2048
- Token限制：最大128k tokens

### 6.2 性能考虑
- 大文件分片上传
- 图片压缩和优化
- 缓存策略
- 并发请求限制

### 6.3 错误处理
- 网络错误重试
- 文件格式验证
- 大小限制提示
- 友好的错误信息 