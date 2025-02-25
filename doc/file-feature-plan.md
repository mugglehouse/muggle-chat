# Muggle Chat 文件功能开发计划

## 一、功能概述

### 1.1 基础功能
- 支持图片上传（jpg、png、gif等）
- 支持PDF文件上传
- 文件预览功能
- 文件大小限制
- 文件类型验证

### 1.2 高级功能
- 图片压缩
- 上传进度显示
- 失败重试机制
- 文件秒传

## 二、技术方案

### 2.1 文件存储方案

#### 方案一：免费图床（前期测试）
- 使用 ImgBB API
- 优点：免费、简单
- 缺点：不稳定、有限制

#### 方案二：云存储（正式环境）
- 七牛云/阿里云OSS
- 优点：稳定、可控
- 缺点：付费

### 2.2 代码结构

```typescript
packages/chat-ui/src/
  ├── components/
  │   ├── FileUpload/
  │   │   ├── index.vue          // 文件上传组件
  │   │   ├── ImagePreview.vue   // 图片预览
  │   │   ├── PDFPreview.vue     // PDF预览
  │   │   └── UploadProgress.vue // 上传进度
  │   └── Chat/
  │       └── MessageItem.vue    // 支持文件消息
  ├── hooks/
  │   └── useFileUpload.ts       // 上传逻辑
  ├── api/
  │   └── upload.ts             // 上传API封装
  └── types/
      └── file.ts              // 类型定义
```

### 2.3 核心接口设计

#### 文件上传接口
```typescript
interface UploadResponse {
  url: string;        // 文件URL
  fileName: string;   // 文件名
  fileSize: number;   // 文件大小
  mimeType: string;   // 文件类型
}

interface UploadOptions {
  maxSize?: number;   // 最大文件大小
  compress?: boolean; // 是否压缩
  types?: string[];   // 允许的文件类型
}

// 上传方法
async function uploadFile(
  file: File, 
  options?: UploadOptions
): Promise<UploadResponse>
```

#### 消息类型扩展
```typescript
interface FileMessage extends Message {
  type: 'image' | 'pdf';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}
```

## 三、开发步骤

### 3.1 基础设施搭建（2天）
1. 创建文件相关组件
2. 实现文件类型定义
3. 配置图床API

### 3.2 文件上传功能（3天）
1. 实现基础上传功能
2. 添加文件验证
3. 实现上传进度
4. 错误处理机制

### 3.3 文件预览功能（2天）
1. 图片预览组件
2. PDF预览组件
3. 预览loading状态

### 3.4 消息集成（2天）
1. 改造消息组件
2. 消息存储适配
3. 消息展示优化

### 3.5 优化和测试（3天）
1. 性能优化
2. 兼容性测试
3. 极限情况测试

## 四、注意事项

### 4.1 安全性
- 文件类型校验
- 文件大小限制
- 文件名安全处理
- 存储安全控制

### 4.2 性能
- 图片压缩阈值：2MB
- 文件大小限制：
  - 图片：最大10MB
  - PDF：最大20MB
- 使用 Web Worker 处理大文件

### 4.3 用户体验
- 上传进度显示
- 预览加载状态
- 失败重试机制
- 友好的错误提示

## 五、后续优化

### 5.1 功能扩展
- 支持更多文件类型
- 图片编辑功能
- 文件管理功能
- 分享功能

### 5.2 性能优化
- 文件缓存策略
- 预加载机制
- 懒加载优化

### 5.3 体验优化
- 拖拽上传
- 粘贴上传
- 批量上传
- 上传队列管理 