# 内联对话框组件

内联对话框组件是一个可以嵌入到页面任意位置的轻量级对话界面，支持三种状态的平滑切换：收缩状态、展开状态和对话状态。同时支持固定定位和内联定位两种模式。

## 组件结构

```
inline-chat/
├── InlineChatDialog.vue    # 主组件
├── InlineChatInput.vue     # 收缩状态输入框
├── InlineChatBox.vue       # 展开状态对话框
└── README.md              # 组件文档
```

## 使用方式

### 固定定位模式
```vue
<script setup lang="ts">
import { InlineChatDialog } from '@/components/inline-chat'

const welcome = '欢迎使用智能助手，请问有什么可以帮您？'
</script>

<template>
  <InlineChatDialog
    position="top-right"
    placeholder="有什么可以帮你的？"
    :initial-prompt="welcome"
  />
</template>
```

### 内联模式
```vue
<template>
  <div class="header-actions">
    <InlineChatDialog
      inline
      placeholder="快速提问..."
    />
  </div>
</template>
```

## 组件 API

### InlineChatDialog

主组件，负责状态管理和子组件协调。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| position | 'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' | 'top-right' | 对话框显示位置（仅在非内联模式下生效） |
| placeholder | string | '有什么可以帮你的？' | 输入框占位文本 |
| initialPrompt | string | - | 初始提示语 |
| inline | boolean | false | 是否使用内联模式 |

### InlineChatInput

收缩状态的输入框组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| placeholder | string | '输入问题...' | 输入框占位文本 |
| inline | boolean | false | 是否使用内联模式 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| expand | - | 输入框获得焦点时触发 |
| submit | content: string | 提交输入内容时触发 |

### InlineChatBox

展开状态的对话框组件。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| messages | Message[] | [] | 消息列表 |
| loading | boolean | false | 加载状态 |
| mode | 'expanded' \| 'chatting' | - | 当前模式 |

#### Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | - | 关闭对话框时触发 |
| submit | content: string | 提交消息时触发 |

## 状态流转

组件有三种状态：

1. **收缩状态（collapsed）**
   - 显示单一输入框
   - 点击或获得焦点时切换到展开状态
   - 输入内容并提交时直接切换到对话状态

2. **展开状态（expanded）**
   - 显示完整对话框界面
   - 显示空状态提示
   - 可以关闭返回收缩状态
   - 输入内容并提交时切换到对话状态

3. **对话状态（chatting）**
   - 显示消息列表
   - 可以继续对话
   - 可以关闭返回收缩状态

## 样式定制

组件使用 SCSS 进行样式管理，主要样式变量：

```scss
// 颜色
$primary-color: #1890ff;
$border-color: #f0f0f0;
$text-color: #333;
$placeholder-color: #999;

// 尺寸
$input-height: 40px;
$border-radius: 20px;
$box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

// 动画
$transition-duration: 0.3s;
```

## 使用场景

1. **固定定位模式**
   - 全局快速访问的对话入口
   - 悬浮在页面任意角落
   - 不影响页面原有布局

2. **内联模式**
   - 集成在导航栏或工具栏中
   - 作为现有UI的一部分
   - 保持与周围元素的视觉一致性

## 注意事项

1. 组件依赖 `ant-design-vue` 的基础组件
2. 需要配合 `chat` store 使用
3. 建议在较大屏幕（>= 768px）下使用
4. 注意避免遮挡页面重要内容
5. 内联模式下注意与周围元素的间距和对齐 