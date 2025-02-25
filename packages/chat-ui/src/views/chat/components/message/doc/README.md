# 消息组件

## 一、组件概述

消息组件用于展示聊天消息，支持文本消息和图片消息两种类型。组件包含消息内容、发送时间、状态等信息，并提供复制和重试等交互功能。

## 二、组件结构

```
message/
├── MessageItem.vue    # 消息项组件
├── MessageStatus.vue  # 消息状态组件
└── doc/
    └── README.md      # 文档
```

## 三、功能特性

### 3.1 消息类型支持
1. **文本消息**
   - Markdown 渲染
   - 代码高亮
   - 链接处理
   - 加载动画

2. **图片消息**
   - 图片网格展示
   - 图片预览
   - 生成进度
   - 元数据显示（仅AI助手）

### 3.2 交互功能
- 复制消息内容
- 重试失败消息
- 图片预览
- 状态提示

### 3.3 样式特点
- 用户/助手消息区分
- 响应式布局
- 加载动画
- 悬停效果

## 四、使用方法

### 4.1 基本使用
```vue
<script setup lang="ts">
import { MessageItem } from './components/message'
import type { Message } from '@/store/chat'

// 文本消息
const textMessage: Message = {
  id: '1',
  role: 'user',
  type: 'text',
  content: 'Hello',
  timestamp: Date.now(),
  status: 'success'
}

// 图片消息
const imageMessage: Message = {
  id: '2',
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
  <MessageItem
    :message="message"
    @retry="handleRetry"
    @copy="handleCopy"
  />
</template>
```

### 4.2 Props
| 名称 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | Message | 是 | 消息对象 |

### 4.3 Events
| 名称 | 参数 | 说明 |
|------|------|------|
| retry | message: Message | 重试消息 |
| copy | content: string | 复制内容 |

## 五、样式定制

### 5.1 CSS 变量
```css
:root {
  --message-bg: #fff;
  --message-user-bg: #1a1a1a;
  --message-text: #333;
  --message-user-text: #fff;
  --message-time: #999;
  --message-border: rgba(0, 0, 0, 0.1);
}
```

### 5.2 主要样式类
- `.message-item`: 消息容器
- `.avatar`: 头像
- `.content`: 内容区域
- `.message-content`: 消息内容
- `.message-footer`: 底部状态栏

## 六、注意事项

### 6.1 性能考虑
- 图片懒加载
- 状态缓存
- 动画性能

### 6.2 兼容性
- 图片加载失败处理
- 移动端适配
- 暗色模式支持

### 6.3 安全性
- XSS 防护
- 链接安全
- 图片安全

## 七、后续优化

### 7.1 功能扩展
- 更多消息类型
- 消息引用
- 消息编辑
- 消息撤回

### 7.2 交互优化
- 手势操作
- 快捷键
- 动画效果

### 7.3 性能优化
- 虚拟滚动
- 图片优化
- 渲染优化 