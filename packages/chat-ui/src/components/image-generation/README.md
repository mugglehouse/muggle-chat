# 图片生成组件

## 一、组件概述

图片生成模块包含两个主要组件：
1. `ImageGeneration`: 用于生成AI图片的交互组件
2. `ImageMessage`: 用于展示图片消息的组件

## 二、组件结构

```
image-generation/
├── index.vue         # 图片生成组件
├── ImageMessage.vue  # 图片消息组件
└── README.md         # 文档
```

## 三、ImageGeneration 组件

### 3.1 基础功能
- 提示词输入（支持多行）
- 图片尺寸选择（256x256、512x512、1024x1024）
- 图片数量选择（1-10张）
- 生成进度显示
- 错误提示

### 3.2 交互设计
- Enter 键快速生成（Shift + Enter 换行）
- 实时字数统计
- 生成按钮状态管理
- 进度条动画

### 3.3 状态管理
- 加载状态
- 错误状态
- 进度状态

## 四、ImageMessage 组件

### 4.1 基础功能
- 显示提示词
- 图片网格展示
- 图片预览
- 加载状态
- 错误状态
- 元数据显示

### 4.2 Props
| 名称 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| message | ImageMessage | - | 图片消息对象 |
| showMetadata | boolean | false | 是否显示元数据 |

### 4.3 交互特性
- 点击图片放大预览
- 图片加载状态显示
- 错误状态处理
- 响应式网格布局

## 五、使用方法

### 5.1 图片生成组件
```vue
<script setup lang="ts">
import ImageGeneration from '@/components/image-generation'
</script>

<template>
  <ImageGeneration placeholder="请输入图片描述..." />
</template>
```

### 5.2 图片消息组件
```vue
<script setup lang="ts">
import { ImageMessage } from '@/components/image-generation/ImageMessage.vue'
import type { ImageMessage as IImageMessage } from '@/store/chat'

const message: IImageMessage = {
  id: '1',
  role: 'assistant',
  type: 'image',
  content: '一只可爱的猫咪',
  imageUrls: ['https://...'],
  timestamp: Date.now(),
  status: 'success',
  metadata: {
    size: '1024x1024',
    n: 1,
    model: 'dall-e-3',
    created: Date.now()
  }
}
</script>

<template>
  <ImageMessage
    :message="message"
    :show-metadata="true"
  />
</template>
```

## 六、样式定制

### 6.1 CSS 变量
组件使用以下 CSS 变量，可以通过覆盖这些变量来自定义样式：

```css
:root {
  --border-color: #e5e7eb;
  --bg-color: #ffffff;
  --bg-secondary: #f3f4f6;
  --text-color: #374151;
  --text-secondary: #6b7280;
  --primary-color: #3b82f6;
  --error-bg: #fee2e2;
  --error-color: #ef4444;
}
```

### 6.2 主要样式类
- `.image-generation`: 生成组件容器
- `.image-message`: 消息组件容器
- `.image-list`: 图片网格容器
- `.image-item`: 单个图片项
- `.preview-overlay`: 预览遮罩

## 七、注意事项

### 7.1 性能考虑
- 图片懒加载
- 预览图片优化
- 状态缓存

### 7.2 限制说明
- 提示词最大长度：4000字符
- 图片数量限制：1-10张
- 支持的图片尺寸：256x256、512x512、1024x1024

### 7.3 错误处理
- 输入验证
- 图片加载错误
- API错误处理

## 八、后续优化

### 8.1 功能扩展
- 提示词模板
- 图片编辑
- 批量操作
- 图片下载

### 8.2 交互优化
- 拖拽排序
- 手势操作
- 快捷键支持

### 8.3 性能优化
- 图片压缩
- 预加载策略
- 虚拟滚动 