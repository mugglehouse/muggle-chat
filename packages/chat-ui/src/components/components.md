# 组件设计文档

## 组件结构

```
components/
├── markdown/
│   └── MarkdownRenderer.vue    # Markdown 渲染组件
├── settings/
│   └── ApiKeySettings.vue      # API Key 设置组件
└── message/
    ├── MessageItem.vue         # 消息项组件
    └── MessageStatus.vue       # 消息状态组件
```

## 核心组件

### 1. MarkdownRenderer
负责渲染 Markdown 格式的消息内容。

```typescript
// Props
interface Props {
  content: string       // Markdown 内容
  inline?: boolean      // 是否内联渲染
}

// 功能特性
- 代码高亮
- 自动链接
- 复制代码
- 安全过滤
```

### 2. ApiKeySettings
管理 OpenAI API Key 的设置组件。

```typescript
// 状态
const apiKey = ref('')          // API Key 输入
const error = ref('')          // 错误信息
const success = ref(false)     // 成功状态

// 功能特性
- API Key 验证
- 本地存储
- 错误提示
- 成功反馈
```

### 3. MessageItem
显示单条消息的组件。

```typescript
// Props
interface Props {
  message: Message      // 消息对象
}

// Events
interface Events {
  retry: [message: Message]   // 重试消息
  copy: [content: string]     // 复制内容
}

// 功能特性
- 用户/AI 消息区分
- 消息状态显示
- Markdown 渲染
- 复制功能
```

### 4. MessageStatus
显示消息状态和操作按钮。

```typescript
// Props
interface Props {
  status: 'sending' | 'success' | 'error'  // 消息状态
}

// Events
interface Events {
  retry: []    // 重试事件
  copy: []     // 复制事件
}

// 功能特性
- 状态图标
- 重试按钮
- 复制按钮
```

## 样式设计

### 1. 主题变量
```scss
// 颜色
$primary-color: #1a73e8;
$error-color: #d32f2f;
$success-color: #2e7d32;
$border-color: #eaeaea;

// 圆角
$border-radius: {
  sm: 4px;
  md: 8px;
  lg: 12px;
}

// 间距
$spacing: {
  xs: 4px;
  sm: 8px;
  md: 12px;
  lg: 16px;
}
```

### 2. 响应式设计
```scss
// 断点
$breakpoints: {
  sm: 640px;
  md: 768px;
  lg: 1024px;
  xl: 1280px;
}

// 媒体查询
@mixin responsive($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

## 交互设计

### 1. 消息气泡
- 用户消息靠右显示
- AI 消息靠左显示
- 状态图标集成
- 平滑动画效果

### 2. 输入区域
- 自适应高度
- 快捷键支持
- 发送按钮状态
- 加载状态反馈

### 3. 设置面板
- 模态框展示
- 表单验证
- 即时反馈
- 优雅过渡

## 性能优化

### 1. 渲染优化
- 虚拟滚动
- 懒加载图片
- 组件缓存
- 条件渲染

### 2. 交互优化
- 防抖处理
- 节流控制
- 异步加载
- 预加载

## 最佳实践

### 1. 组件设计
- 单一职责
- Props 验证
- 事件规范
- 插槽灵活

### 2. 样式管理
- BEM 命名
- Scoped CSS
- 主题变量
- 响应式

### 3. 交互体验
- 加载状态
- 错误处理
- 动画过渡
- 无障碍

### 4. 代码质量
- TypeScript
- ESLint
- Prettier
- 单元测试 