# Muggle Chat

基于 Vue 3 生态系统打造的现代化 AI 聊天应用，采用 Monorepo 架构设计。

## 🌟 项目概览

Muggle Chat 是一个优雅的 AI 聊天应用界面，采用类似 ChatGPT 的交互设计，提供流畅的对话体验和精致的界面设计。

### 核心特性

- 🤖 智能对话：支持流式响应的 AI 对话功能
- 🎯 Monorepo 架构：基于 pnpm workspace 的项目组织
- 💡 Vue 3 + TypeScript：完整的类型支持
- 🎨 Ant Design Vue：美观的 UI 组件库
- 📱 响应式设计：完美适配多端设备
- ⚡️ 实时反馈：流式响应和打字机效果
- 🔄 上下文续航：支持对话上下文管理
- 📝 消息编辑：支持消息重试和编辑功能

## 🔧 技术栈

- **核心框架：** Vue 3 + Composition API
- **开发语言：** TypeScript
- **UI 框架：** Ant Design Vue
- **状态管理：** Pinia
- **构建工具：** Vite
- **包管理器：** pnpm
- **代码规范：** ESLint + Prettier
- **样式预处理：** Less/SCSS

## 📁 项目结构

```
muggle-chat/
├── packages/
│   ├── chat-ui/                # 前端UI模块
│   │   ├── src/
│   │   │   ├── api/           # API 接口定义
│   │   │   ├── assets/        # 静态资源
│   │   │   ├── components/    # 公共组件
│   │   │   ├── config/        # 配置文件
│   │   │   ├── store/         # Pinia 状态管理
│   │   │   ├── types/         # TypeScript 类型定义
│   │   │   ├── utils/         # 工具函数
│   │   │   └── views/         # 页面组件
│   │   │       └── chat/      # 聊天相关组件
│   │   │           ├── components/  # 聊天子组件
│   │   │           ├── Content.vue  # 消息内容组件
│   │   │           ├── Footer.vue   # 输入框组件
│   │   │           ├── Header.vue   # 顶部导航组件
│   │   │           ├── Sider.vue    # 侧边栏组件
│   │   │           └── index.vue    # 聊天主页面
│   │   └── vite.config.ts     # Vite 配置
│   └── service/               # 后端服务（规划中）
├── doc/                       # 项目文档
└── assets/                    # 公共资源

```

## 💡 主要功能

### 对话功能

- ✅ 流式消息响应
- ✅ 消息重试机制
- ✅ 消息编辑功能
- ✅ 消息复制功能
- ✅ 代码块语法高亮
- ✅ Markdown 渲染
- ✅ 打字机效果

### 会话管理

- ✅ 会话创建与切换
- ✅ 会话记录保存
- ✅ 会话列表管理
- ✅ 响应式侧边栏

### 用户界面

- ✅ 响应式布局设计
- ✅ 自定义滚动条样式
- ✅ 平滑动画过渡
- ✅ 消息状态提示
- ✅ 错误重试机制

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8

### 开发设置

1. 克隆项目

```bash
git clone <repository-url>
cd muggle-chat
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

```bash
cp packages/chat-ui/.env.example packages/chat-ui/.env
```

4. 启动开发服务器

```bash
# 启动前端开发服务
pnpm chat:dev
```

## 📋 开发计划

### 近期计划

- [ ] 深色模式支持
- [ ] 文件上传与预览
- [ ] 代码块一键复制
- [ ] 消息搜索功能
- [ ] 快捷键支持

### 长期规划

- [ ] 多模型支持
- [ ] 插件系统
- [ ] 会话导出功能
- [ ] 国际化支持
- [ ] 语音输入支持

## 📄 开发规范

### 代码规范

- 使用 Composition API 组织逻辑
- 使用 TypeScript 强类型开发
- 组件属性和事件使用 defineProps 和 defineEmits
- 保持组件的单一职责
- 使用 Pinia 进行状态管理

### Git 提交规范

- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例修改
- chore: 其他修改

## 🔑 环境变量

在 `.env` 文件中配置以下环境变量：

```bash
# API 配置
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# 应用配置
VITE_APP_TITLE=Muggle Chat
VITE_APP_DESCRIPTION=AI Chat Application
```

## 📚 相关文档

- [Vue 3 文档](https://v3.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Ant Design Vue 文档](https://antdv.com/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)

## 📝 许可证

[MIT License](LICENSE)
