# Muggle Chat 文件上传模块开发计划

## 1. 功能需求

### 1.1 基本功能
- 支持上传图片（jpg、png、gif等常见格式）
- 支持上传PDF文档
- 支持在聊天中显示上传的图片
- 支持预览PDF文件
- 支持文件大小限制
- 支持文件类型验证

### 1.2 技术需求
- 前端文件上传进度显示
- 文件预览功能
- 大文件分片上传
- 断点续传
- 文件秒传（通过文件hash判断）

## 2. 技术方案

### 2.1 前端实现
```typescript
// 目录结构
packages/chat-ui/src/
  ├── components/
  │   ├── FileUpload/
  │   │   ├── index.vue          // 文件上传组件
  │   │   ├── ImagePreview.vue   // 图片预览组件
  │   │   ├── PDFPreview.vue     // PDF预览组件
  │   │   └── UploadProgress.vue // 上传进度组件
  │   └── Chat/
  │       └── MessageItem.vue    // 增加文件消息类型支持
  ├── hooks/
  │   └── useFileUpload.ts       // 文件上传相关hooks
  └── types/
      └── file.ts               // 文件相关类型定义
```

### 2.2 后端实现
```typescript
packages/service/src/
  ├── modules/
  │   └── file/
  │       ├── file.controller.ts  // 文件控制器
  │       ├── file.service.ts     // 文件服务
  │       └── file.entity.ts      // 文件实体
  └── config/
      └── upload.config.ts       // 文件上传配置
```

## 3. 数据库设计

### 3.1 文件表(files)
```sql
CREATE TABLE files (
  id VARCHAR(36) PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(127) NOT NULL,
  size BIGINT NOT NULL,
  path VARCHAR(512) NOT NULL,
  hash VARCHAR(64) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 4. API设计

### 4.1 文件上传
```typescript
POST /api/files/upload
Content-Type: multipart/form-data

Response:
{
  code: 0,
  data: {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
  }
}
```

### 4.2 分片上传
```typescript
// 1. 初始化上传
POST /api/files/upload/init
{
  filename: string;
  size: number;
  hash: string;
  chunks: number;
}

// 2. 上传分片
POST /api/files/upload/chunk
Content-Type: multipart/form-data
{
  hash: string;
  chunk: number;
  file: File;
}

// 3. 合并分片
POST /api/files/upload/merge
{
  hash: string;
  filename: string;
  size: number;
}
```

## 5. 开发步骤

1. 后端开发
   - 创建文件模块基础结构
   - 实现文件上传基本功能
   - 实现分片上传
   - 实现文件服务
   - 单元测试

2. 前端开发
   - 创建文件上传组件
   - 实现文件预览组件
   - 集成到聊天界面
   - 实现上传进度显示
   - 实现断点续传功能

3. 测试与优化
   - 接口测试
   - 性能测试
   - 用户体验优化

## 6. 注意事项

1. 安全性考虑
   - 文件类型验证
   - 文件大小限制
   - 存储路径安全
   - 防止上传恶意文件

2. 性能考虑
   - 图片压缩
   - 大文件分片上传
   - CDN加速
   - 文件缓存策略

3. 存储考虑
   - 本地存储与云存储结合
   - 定期清理无用文件
   - 文件备份策略

## 7. 后续优化

1. 支持更多文件类型
2. 图片编辑功能
3. 在线预览Office文档
4. 文件分享功能
5. 文件管理系统 