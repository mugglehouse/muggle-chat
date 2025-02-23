# 视图组件设计文档

## 视图结构

```
views/
├── chat/
│   ├── Content.vue          # 聊天内容区域
│   ├── Footer.vue          # 输入区域
│   ├── Header.vue          # 顶部导航
│   └── components/         # 聊天相关组件
│       └── message/        # 消息相关组件
└── exception/              # 异常页面
```

## 主要视图组件

### 1. Content.vue
聊天内容显示区域，负责消息列表的渲染和滚动管理。

```typescript
// 状态
const messageListRef = ref<HTMLElement | null>(null)
const { currentMessages, loading } = storeToRefs(store)

// 功能特性
- 消息列表渲染
- 自动滚动
- 加载状态
- 空状态处理
```

### 2. Footer.vue
消息输入区域，处理用户输入和消息发送。

```typescript
// 状态
const messageInput = ref('')
const chatStore = useChatStore()

// 功能特性
- 消息输入
- 发送处理
- 快捷键支持
- 文件上传（待实现）
```

### 3. Header.vue
顶部导航栏，包含设置和用户相关功能。

```typescript
// 状态
const showSettings = ref(false)

// 功能特性
- 设置面板
- 用户头像
- 退出登录
- 响应式布局
```

## 布局设计

### 1. 整体布局
```html
<template>
  <div class="chat-layout">
    <Header />
    <Content />
    <Footer />
  </div>
</template>
```

### 2. 响应式布局
```scss
.chat-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .chat-content {
    flex: 1;
    overflow: hidden;
  }

  .chat-footer {
    flex-shrink: 0;
  }
}
```

## 状态管理

### 1. Store 集成
```typescript
// 在组件中使用 Store
const store = useChatStore()
const { currentMessages, loading } = storeToRefs(store)

// 分发 actions
await store.sendMessage(content)
```

### 2. 消息流处理
```typescript
// 发送消息
async function handleSend() {
  if (!messageInput.value.trim()) return
  
  try {
    await chatStore.sendMessage(messageInput.value)
    messageInput.value = ''
  } catch (err) {
    message.error('发送失败')
  }
}
```

## 交互实现

### 1. 消息列表
```typescript
// 监听消息变化，自动滚动
watch(
  currentMessages,
  (newMessages, oldMessages) => {
    const hasNewMessage = newMessages.length !== oldMessages?.length
    const hasContentUpdate = newMessages.some((msg, index) => {
      const oldMsg = oldMessages?.[index]
      return oldMsg && (msg.content !== oldMsg.content || msg.status !== oldMsg.status)
    })

    if (hasNewMessage || hasContentUpdate) {
      scrollToBottom()
    }
  },
  { deep: true, immediate: true },
)
```

### 2. 输入区域
```typescript
// 处理回车发送
function handleKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
```

## 异常处理

### 1. 加载状态
```html
<div v-if="loading" class="loading-wrapper">
  <div class="loading-spinner" />
  <span>正在思考...</span>
</div>
```

### 2. 错误提示
```typescript
// 错误处理
catch (err) {
  message.error('发送消息失败，请重试')
  console.error('发送失败:', err)
}
```

## 性能优化

### 1. 消息渲染
- 使用 `v-show` 替代 `v-if`
- 键值优化
- 避免不必要的计算

### 2. 滚动优化
- 节流处理
- 虚拟滚动（待实现）
- 懒加载

## 最佳实践

### 1. 组件通信
- Props 向下传递
- Events 向上传递
- Store 管理共享状态

### 2. 性能考虑
- 合理的计算属性
- 优化的监听器
- 适当的组件拆分

### 3. 用户体验
- 友好的加载状态
- 清晰的错误提示
- 平滑的动画过渡

### 4. 代码组织
- 逻辑复用
- 类型定义
- 注释完善 