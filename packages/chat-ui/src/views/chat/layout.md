# Muggle Chat 布局文档

## 主布局 (index.vue)

### 组件结构
```vue
<div class="app-container">
  <aside class="app-sider">
    <Sider />
  </aside>
  <main class="app-main">
    <header class="app-header">
      <Header />
    </header>
    <section class="app-content">
      <Content />
    </section>
    <footer class="app-footer">
      <Footer />
    </footer>
  </main>
</div>
```

### 功能说明
- 使用 flex 布局实现整体结构
- 响应式侧边栏，支持完全收起和展开
- 主内容区域自适应高度
- 背景采用亮色主题
- 固定的展开/收起按钮

### 关键属性
- 高度：100vh（全屏）
- 侧边栏宽度：展开时 256px，收起时 0px
- 过渡动画：duration-300（300ms）
- 主内容区最小宽度：0（防止溢出）

## 顶部导航 (Header.vue)

### 组件结构
```vue
<div class="chat-header">
  <h1 class="logo">Muggle Chat</h1>
  <div class="actions">
    <a-dropdown>
      <div class="avatar-wrapper">
        <a-avatar />
      </div>
    </a-dropdown>
  </div>
</div>
```

### 样式特点
- Logo：字体大小 1.25rem，加粗，字间距 -0.025em
- 头像：固定尺寸，悬停效果
- 下拉菜单：圆角设计，阴影效果

### 交互功能
- 头像点击显示下拉菜单
- 菜单项包含设置和退出选项
- 菜单项悬停效果

## 侧边栏 (Sider.vue)

### 组件结构
```vue
<div class="chat-sider">
  <div class="sider-header">
    <a-button>新建对话</a-button>
  </div>

  <div class="chat-list">
    <a-menu>
      <a-menu-item>对话项</a-menu-item>
    </a-menu>
  </div>

  <div class="sider-footer">
    <a-button>折叠按钮</a-button>
  </div>

  <div class="expand-btn">
展开按钮
</div>
</div>
```

### 功能模块
1. 顶部区域
   - 新建对话按钮（黑色主题）
   - 按钮宽度 100%
   - 悬停效果（深灰色）

2. 对话列表
   - 使用 a-menu 组件
   - 支持选中状态
   - 每项包含图标和标题
   - 圆角和悬停效果

3. 底部区域
   - 内置折叠/展开按钮
   - 固定的展开按钮（收起状态）
   - 优雅的过渡动画

### 样式特点
- 边框：统一使用 #eaeaea
- 圆角：按钮和列表项使用 0.375rem
- 过渡动画：展开/收起平滑过渡
- 固定按钮：悬停效果和阴影

## 聊天内容 (Content.vue)

### 组件结构
```vue
<div class="chat-content">
  <div class="message-wrapper">
    <div class="message-container">
      <div class="avatar-wrapper">
        <img class="avatar" />
      </div>

      <div class="message-box">
        <div class="message-content">
          消息内容
        </div>
      </div>
    </div>
  </div>
</div>
```

### 消息布局
1. 用户消息
   - 整体靠右对齐
   - 使用 flex-direction: row-reverse 反转布局
   - 黑色背景，白色文字
   - 头像在消息框右侧

2. 助手消息
   - 整体靠左对齐
   - 默认 flex 布局
   - 白色背景，黑色文字
   - 头像在消息框左侧

### 样式特点
- 消息容器：最大宽度 48rem，居中对齐
- 消息间距：2rem
- 头像：
  - 尺寸：2.5rem
  - 圆形设计
  - 白色边框（2px）
  - 轻微阴影效果
- 消息框：
  - 圆角设计（0.75rem）
  - 适当的内边距
  - 阴影效果
- 滚动条：
  - 隐藏原生滚动条
  - 保持滚动功能
  - 与浏览器滚动行为一致

### 响应式布局
- 最大宽度限制确保在大屏幕上的可读性
- 合理的留白和间距
- 消息气泡最大宽度为容器的 85%

## 底部输入 (Footer.vue)

### 组件结构
```vue
<div class="chat-footer">
  <div class="input-container">
    <div class="input-wrapper">
      <a-textarea />
      <div class="action-buttons">
        <a-button>上传</a-button>
        <a-button>发送</a-button>
      </div>

    </div>
    <div class="disclaimer">
      免责声明
    </div>
  </div>
</div>
```

### 功能模块
1. 输入框
   - 自适应高度（1-4行）
   - 无边框设计
   - 聚焦时黑色边框

2. 操作按钮
   - 固定尺寸（2rem）
   - 文件上传按钮（灰色）
   - 发送按钮（黑色主题）

3. 免责声明
   - 小字提示（0.75rem）
   - 居中对齐
   - 浅灰色文本

### 样式特点
- 容器：最大宽度 48rem，居中
- 输入框：圆角设计，过渡动画
- 按钮：统一尺寸，合理间距
- 交互反馈：清晰的状态变化

## 主题设计

### 颜色系统
- 主色：#000（黑色）
- 次要：#333（深灰）
- 背景：#fff（白色）
- 浅背景：#fafafa
- 边框：#eaeaea
- 文本：#000/#666/#999

### 间距系统
- 页面内边距：2rem
- 组件间距：1rem/0.75rem
- 元素内边距：1.25rem/0.875rem
- 按钮间距：0.25rem

### 阴影效果
- 卡片阴影：0 2px 4px rgba(0, 0, 0, 0.1)
- 下拉菜单：0 2px 8px rgba(0, 0, 0, 0.12)
- 输入框聚焦：0 0 0 1px #000

### 过渡动画
- 持续时间：0.2s/0.3s
- 时间函数：ease/linear
- 应用场景：展开收起、悬停效果

## 响应式设计

### 断点设计
- 移动端：< 640px
- 平板：640px - 1024px
- 桌面：> 1024px

### 适配策略
1. 侧边栏
   - 小屏幕默认收起
   - 可通过按钮展开/收起
   - 展开时遮罩层效果

2. 内容区
   - 自适应宽度
   - 合理控制消息气泡宽度
   - 保持良好的可读性

3. 输入区
   - 输入框宽度自适应
   - 按钮位置自适应调整
   - 保持良好的操作体验

## 交互设计

### 滚动行为
- 隐藏自定义滚动条
- 保持原生滚动功能
- 平滑滚动效果
- 与系统滚动行为保持一致

### 消息布局
- 清晰的视觉层次
- 合理的留白和间距
- 一致的对齐方式
- 明确的用户/助手区分

### 动画效果
- 消息加载动画
- 滚动过渡效果
- 状态切换动画
- 悬停反馈效果

## 性能优化

### 渲染优化
- 虚拟滚动（大量消息时）
- 懒加载图片
- 消息分页加载
- DOM 元素复用

### 动画性能
- 使用 transform 代替位置属性
- 合理的动画持续时间
- 避免重绘和回流
- 硬件加速（transform3d）

### 资源加载
- 图片优化和压缩
- 按需加载组件
- 资源缓存策略
- 预加载关键资源