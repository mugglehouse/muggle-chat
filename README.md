# Muggle Chat

一个基于 Vue 3 + TypeScript + Ant Design Vue 构建的现代化聊天应用界面。

## 功能特性

- 💡 现代化的 UI 设计，参考 Vercel 设计风格
- 🔥 基于 Vue 3 Composition API
- 🎨 使用 Ant Design Vue 组件库
- 📦 TypeScript 支持
- 🎯 响应式布局设计
- 🌓 优雅的动画过渡效果

## 技术栈

- Vue 3
- TypeScript
- Ant Design Vue
- Less
- Vite

## 设计特点

- 简约现代的黑白配色
- 精心设计的间距和对齐
- 流畅的动画过渡
- 优雅的交互反馈
- 一致的设计语言

## 目录结构

```
packages/chat-ui/
├── src/
│   ├── views/
│   │   └── chat/
│   │       ├── index.vue      # 主布局组件
│   │       ├── Header.vue     # 顶部导航组件
│   │       ├── Sider.vue      # 侧边栏组件
│   │       ├── Content.vue    # 聊天内容组件
│   │       └── Footer.vue     # 底部输入组件
│   ├── assets/               # 静态资源
│   ├── router/              # 路由配置
│   └── store/               # 状态管理
```

## 组件说明

### 主布局 (index.vue)
- 整体页面布局
- 响应式侧边栏
- 组件组织与管理

### 顶部导航 (Header.vue)
- 显示应用 Logo
- 用户头像与下拉菜单
- 设置和退出登录功能

### 侧边栏 (Sider.vue)
- 新建对话按钮
- 对话历史列表
- 可折叠/展开功能
- 支持选中状态

### 聊天内容 (Content.vue)
- 消息展示区域
- 支持用户和助手两种消息类型
- 头像显示
- 消息气泡样式

### 底部输入 (Footer.vue)
- 消息输入框
- 文件上传功能
- 发送按钮
- 免责声明

## 样式特点

- 采用亮色主题设计
- 统一的颜色系统
- 精心设计的间距和对齐
- 细致的交互反馈
- 平滑的动画过渡

## 使用说明

1. 安装依赖：
```bash
pnpm install
```

2. 启动开发服务器：
```bash
pnpm dev
```

3. 构建生产版本：
```bash
pnpm build
```

## 主要功能

1. 对话管理
   - 创建新对话
   - 查看历史对话
   - 切换当前对话

2. 消息功能
   - 发送文本消息
   - 上传文件（预留）
   - 消息历史记录

3. 用户功能
   - 用户设置
   - 退出登录

## 开发计划

- [ ] 添加深色模式支持
- [ ] 实现文件上传功能
- [ ] 添加消息搜索功能
- [ ] 支持更多消息类型
- [ ] 添加对话分组功能

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT License](LICENSE)
