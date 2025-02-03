# Chat Content 组件设计文档

## 组件职责

消息内容区域组件，负责：
1. 展示对话消息列表
2. 管理消息滚动
3. 处理消息交互
4. 显示加载状态

## 组件结构

```vue
<template>
  <div class="chat-content">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner" />
      <span>正在思考...</span>
    </div>

    <!-- 消息列表 -->
    <div ref="messageListRef" class="message-list">
      <MessageItem
        v-for="message in currentMessages"
        :key="message.id"
        :message="message"
        @retry="handleRetry"
        @copy="handleCopy"
      />
    </div>
  </div>
</template>
```

## 状态管理

### Store 集成
```typescript
const store = useChatStore()
const { currentMessages, loading } = storeToRefs(store)
```

### 组件状态
```typescript
const messageListRef = ref<HTMLElement | null>(null)
```

## 功能实现

### 1. 自动滚动
```typescript
// 滚动到底部
const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    const { scrollHeight } = messageListRef.value
    messageListRef.value.scrollTop = scrollHeight
  }
}

// 监听消息变化
watch(currentMessages, () => {
  scrollToBottom()
})
```

### 2. 消息交互
```typescript
// 消息重试
const handleRetry = async (message: Message) => {
  // TODO: 实现消息重试逻辑
}

// 消息复制
const handleCopy = async (content: string) => {
  try {
    await navigator.clipboard.writeText(content)
    // TODO: 添加复制成功提示
  } catch (err) {
    console.error('复制失败:', err)
  }
}
```

## 样式设计

1. **布局结构**
   - 使用 flex 布局
   - 固定高度，自动滚动
   - 合理的内边距和间距

2. **加载状态**
   - 居中显示
   - 半透明背景
   - 加载动画

3. **滚动条样式**
   - 细滚动条
   - 圆角设计
   - 悬浮显示

4. **空状态**
   - 居中显示
   - 图标和文字提示
   - 柔和的颜色

## 依赖组件

1. **MessageItem**
   - 消息气泡组件
   - 处理消息显示
   - 提供交互功能

## 已完成功能

- [x] 基础消息列表展示
- [x] 自动滚动到最新消息
- [x] 加载状态显示
- [x] 空状态展示
- [x] 滚动条美化
- [x] Store 集成

## 待办事项

1. 消息交互
   - [ ] 实现消息重试逻辑
   - [ ] 添加复制成功/失败提示
   - [ ] 添加消息操作菜单

2. 性能优化
   - [ ] 虚拟滚动
   - [ ] 消息懒加载
   - [ ] 滚动性能优化

3. 用户体验
   - [ ] 消息动画效果
   - [ ] 滚动到底部按钮
   - [ ] 未读消息提示

4. 功能增强
   - [ ] 消息搜索
   - [ ] 消息分组
   - [ ] 时间线显示

## 注意事项

1. **性能考虑**
   - 监听消息变化时使用防抖
   - 大量消息时考虑虚拟滚动
   - 优化重复渲染

2. **交互优化**
   - 平滑滚动效果
   - 适当的加载反馈
   - 错误处理和提示

3. **可访问性**
   - 键盘导航支持
   - 屏幕阅读器支持
   - 合适的语义化标签