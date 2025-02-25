## 🌟 项目描述

基于Vue3的轻量级AI对话平台，支持内联模式和展开模式，集成OpenAI API服务、支持多轮会话管理、实时流式响应、状态持久化与markdown渲染支持。

## 🔧 技术栈

Vue3 + Vue-Router + Pinia + TypeScript + Antdv + Axios +Vite

## 🎨预览地址

https://muggle-chat.vercel.app

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

## 🚀 预览图

![image-20250223205642780](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20250223205642780.png)

![image-20250223205648516](C:\Users\lenovo\AppData\Roaming\Typora\typora-user-images\image-20250223205648516.png)

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

## 