# MarkdownRenderer 组件设计文档

## 组件职责

Markdown 渲染组件，负责：
1. 解析 Markdown 文本
2. 渲染格式化内容
3. 代码块语法高亮
4. 提供代码复制功能

## 组件接口

### Props
```typescript
interface Props {
  content: string    // Markdown 内容
  inline?: boolean   // 是否内联渲染
}
```

## 功能实现

### 1. Markdown 解析配置
```typescript
const md = new MarkdownIt({
  html: false,    // 禁用 HTML 标签
  breaks: true,   // 转换换行符为 <br>
  linkify: true,  // 自动转换 URL 为链接
  highlight: (str, lang) => {
    // 代码高亮处理
  }
})
```

### 2. 代码高亮处理
```typescript
highlight: (str: string, lang: string) => {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, { language: lang }).value
    } catch (e) {
      console.error(e)
    }
  }
  return '' // 使用默认的转义
}
```

### 3. 内容渲染
```typescript
const renderedContent = computed(() => {
  if (!props.content) return ''
  return props.inline
    ? md.renderInline(props.content)
    : md.render(props.content)
})
```

### 4. 代码复制功能
```typescript
const setupCodeCopy = () => {
  // 为每个代码块添加复制按钮
  // 处理复制操作
  // 显示复制状态
}
```

## 样式设计

1. **基础样式**
   - 合适的行高和间距
   - 响应式图片
   - 表格样式

2. **代码块样式**
   - 语法高亮
   - 圆角边框
   - 复制按钮
   - 滚动处理

3. **内联模式**
   - 行内显示
   - 移除多余间距
   - 保持文本流

## 依赖项

1. **markdown-it**
   - Markdown 解析和渲染
   - 配置选项管理
   - 插件扩展

2. **highlight.js**
   - 代码语法高亮
   - 支持多种编程语言
   - 主题定制

## 使用示例

```vue
<template>
  <!-- 普通模式 -->
  <markdown-renderer :content="markdownText" />

  <!-- 内联模式 -->
  <markdown-renderer
    :content="inlineText"
    :inline="true"
  />
</template>
```

## 待办事项

1. 功能增强
   - [ ] 支持更多 Markdown 扩展语法
   - [ ] 添加数学公式支持
   - [ ] 优化图片加载
   - [ ] 添加目录生成

2. 交互优化
   - [ ] 优化代码复制交互
   - [ ] 添加图片预览
   - [ ] 优化链接处理
   - [ ] 添加加载状态

3. 性能优化
   - [ ] 实现内容缓存
   - [ ] 优化重复渲染
   - [ ] 延迟加载组件
   - [ ] 优化大文本渲染

4. 安全性
   - [ ] XSS 防护
   - [ ] 链接安全检查
   - [ ] 内容过滤
   - [ ] 错误处理
