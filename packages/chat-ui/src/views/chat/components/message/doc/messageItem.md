# MessageItem 组件设计文档

## 组件职责

消息气泡组件，负责：
1. 展示单条消息内容
2. 显示消息状态
3. 处理消息交互
4. 提供消息操作

## 组件接口

### Props
```typescript
interface Props {
  message: Message  // 消息对象
}
```

### Events
```typescript
interface Events {
  retry: (message: Message) => void  // 重试发送消息
  copy: (content: string) => void    // 复制消息内容
}
```

## 组件结构

```vue
<template>
  <div class="message-item" :class="[message.role]">
    <!-- 头像部分 -->
    <div class="avatar">
      ...
    </div>

    <!-- 内容部分 -->
    <div class="content">
      <!-- Markdown 渲染的消息内容 -->
      <div class="message-content">
        ...
      </div>

      <!-- 底部状态栏 -->
      <div class="message-footer">
        ...
      </div>
    </div>
  </div>
</template>
```

## 功能实现

### 1. 消息时间格式化
```typescript
const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
})
```

### 2. 头像配置
```typescript
const avatarConfig = computed(() => ({
  user: {
    icon: '👤',
    alt: '用户',
  },
  assistant: {
    icon: '🤖',
    alt: 'AI助手',
  },
})[props.message.role])
```

### 3. 消息操作
```typescript
// 重试发送
const handleRetry = () => {
  emit('retry', props.message)
}

// 复制内容
const handleCopy = () => {
  emit('copy', props.message.content)
}
```

## 样式设计

1. **布局结构**
   - 使用 flex 布局
   - 用户消息靠右，AI消息靠左
   - 最大宽度限制为容器的 80%

2. **视觉样式**
   - 用户消息使用绿色背景 (#95ec69)
   - AI消息使用白色背景
   - 圆角头像
   - 消息气泡阴影效果

3. **响应式设计**
   - 适配不同屏幕尺寸
   - 保持合适的间距和留白

## 依赖组件

1. **MarkdownRenderer**
   - 负责渲染 Markdown 格式的消息内容
   - 支持代码高亮
   - 处理链接和图片

2. **MessageStatus**
   - 显示消息发送状态
   - 提供重试和复制功能
   - 显示发送时间

## 待办事项

1. 基础功能
   - [ ] 完善头像显示
   - [ ] 添加消息加载动画
   - [ ] 优化时间显示格式

2. 交互优化
   - [ ] 添加消息操作菜单
   - [ ] 实现长按操作
   - [ ] 添加消息选择功能

3. 样式优化
   - [ ] 优化暗色主题
   - [ ] 添加消息hover效果
   - [ ] 优化移动端适配

4. 性能优化
   - [ ] 优化渲染性能
   - [ ] 添加骨架屏
   - [ ] 优化大型消息的显示 