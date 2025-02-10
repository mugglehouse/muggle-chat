# muggle-chat-create

## 基础框架构建

```
1. 新建工程
pnpm create vite
pnpm i

2. 采用monorepo包管理方式
新建pnpm-workspace.yaml文件
packages:
  - packages/**
  - examples/**
  
packages下新建chat-ui文件夹
此目录pnpm init，生成package.json，更改name为@muggle-chat/chat-ui

添加.npmrc文件，解决工作空间依赖包问题
shamefully-hoist = true
prefer-workspace-packages=true

将项目添加进工作空间，根pakage.json更新
pnpm i @muggle-chat/chat-ui --workspace -w

3. 配置eslint
安装在全局package.json中, -D为开发环境，-w为添加进工作空间
pnpm add eslint @mistjs/eslint-config -Dw 

更改版本号为^8.57，重新pnpm i

根目录创建eslint.config.js，导入eslint配置（附录）

.vscode中添加settings.json让规则生效（附录）
 
4. 配置husky
安装在全局package.json
pnpm add husky -Dw  

package.json中的script添加"prepare": "husky install"
即安装依赖前的操作
重新pnpm i，生成.husky文件夹
然后删除"prepare": "husky install"

安装lint-staged
这个帮助我们只检查变更的文件
pnpm add lint-staged -Dw

在全局package.json中添加规则
"lint-staged": {
    "./**/*.{js,ts,vue,tsx,jsx,css,less,json}": [
      "eslint --fix"
    ]
  }
在.husky的post-commit中添加npx lint-staged

5. 关闭ts类型检查
tsconfig.app.json中 “strict”: false
```

## 基础布局构建

```tsx
1. src/
创建好基本的文件夹和main.ts/app.vue
main.ts
import {createApp} from 'vue'
import App from './app.vue'
import './assets/style.css'
const app = createApp(App)
app.mount('#app') // 是html body下div的id
html引入main.ts

2. views/chat
创建index.vue/Sider.vue/Header.vue/Content.vue/Footer.vue

3.配置路由router/index.ts
子包下pnpm install vue-router@4
import {createRouter,createWebHashHistory} from 'vue-router'
const routes=[
    {
        path:'/',
        name:'Chat',
        component:()=>import('../views/chat/index.vue')
    }
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
// main.ts引入并执行
export setupRouter(app){
    app.use(router)
}

3.配置状态管理
index.ts
import { createPinia } from 'pinia'
const store = createPinia()
// main.ts引入并执行
export setupStore(app){
    app.use(store)
}
chat.ts
import {defineStore} from 'pinia'
export const useChatStore = defineStore('chat',()=>{
    // state
  
    // getter
  
    // action
    return{
    
    }
})
```

## 完成UI界面+逻辑交互

```html
1. index.vue
aside--sider
main--header+content+footer

2. Sider.vue
功能：新建会话+搜索会话+会话列表+展开收起
状态：展开收起状态+选中状态
数据：会话列表
事件：新建会话+展开收起
业务逻辑分析:展开收起状态使用v-model双向绑定在组件自身，此状态在父组件的aside中更改展开或收起的样式，且可初始化，子组件使用defineModel接收，点击展开收起按钮触发状态变更，且用于自身按钮的样式变化。选中状态触发content内容的变化。会话列表采用v-for遍历。新建会话，往会话列表unshift，会话列表为一个数组，每个元素为一个对象，包括id和title属性。

3. Header.vue
功能：左侧logo+右侧个人中心+下拉框（设置+退出登录）
状态：打开关闭设置状态
数据：/
事件：打开关闭设置事件
业务逻辑分析：下拉框使用antdv的dropdown+menu组件。对话框使用modal组件。下拉框和对话框我在组件库项目中都有实现，具体是实现原理详见组件库项目。设置对话框存放apikeySetting组件，用于设置api key。

apiKeySetting.vue
功能：APIKEY输入和保存 + 成功错误处理
状态：error+success
数据：apikey
事件：验证apikey+保存apikey+初始化已保存的apikey
业务逻辑分析：此组件最重要就是apikey的保存，以及保存成功和失败的处理。首先，apikey是全局使用的，应放到store中管理（具体store再说）。这里需要验证函数和保存函数，两个都使用async await的方式，定义该函数为异步函数，并使用try...catch捕捉成功或失败的结果。这里成功和失败的提示采用antdv的message函数组件。同时在onMounted钩子初始化apikey，获取已保存的apikey。apikey的存储/获取/更新函数在store中定义，存储在localstorage当中。

4. Content.vue
功能：空状态+加载状态+消息列表
业务逻辑分析：此组件主要完成消息列表的展示，消息列表由一个个消息气泡组件构成，使用v-for遍历该组件，同时没有展开会话时显示空状态，正在接收信息时显示加载状态。主要逻辑如下：封装消息气泡组件，父组件使用v-for遍历。消息列表由store存储，并使用使用storeToRefs保持响应式。消息气泡组件自身绑定props完成msg传递，同时绑定监听事件重试和复制，父组件完成重试和复制逻辑，实现父子组件通信。使用watch监听消息列表变化，完成自动滚动到底部，逻辑思想为，对消息列表的div指定ref属性，获取其实例，得到scrollHeigth列表框总高度(包括溢出页面部分)，cilentHeight页面可视高度，scrollTop滚动距离，watch监听消息列表，一变化就使滚动距离=列表框总高度-可视高度，即可实现页面自动滚动到底部，watch将immediate设为true，使得首次加载页面时也自动滚动到底部。
使用浏览器提供的复制API navigator.clipboard.writeText()实现复制功能，此API为异步方法，所以需要使用async..await和try...catch处理，统一使用message组件显示复制成功或失败的结果。

MessageItem.vue
功能：消息气泡（头像+气泡框+时间+消息状态）
业务逻辑分析：气泡组件是复用组件，在父组件中使用v-for遍历，绑定props接收来自父组件的msg，绑定emit监听复制和重试事件，让父组件处理该逻辑。而气泡组件主要由头像/气泡框/时间/消息状态组成，气泡框存储md格式的内容，所以另设了一个md格式转化的组件，md组件绑定props接收父组件的msg.content。消息状态主要是成功/发送中/失败的状态，也单独用一个组件管理，状态在store管理的msg.status中，同时该组件还包括重试和复制按钮。

MessageStatus.vue
功能：管理消息状态（成功/发送中/失败）+ 重试/复制按钮

markdownRender.vue
功能：将返回的消息成功以md格式渲染到页面，并完成代码块的高亮和复制
业务逻辑分析：
  api返回的消息是markdown格式的字符串，我们需要把该md文档真正渲染到页面，浏览器不能直接解析md文档，只能解析html标签，所以我们需要把md字符串转化为合适的html，才能渲染到页面。此处用到了markdown-it插件，该插件将md字符串转化为html字符串（最外层为pre标签，第二层为code，其次为md内容的html标签），markdown-it将md字符串转化为html字符串之后，再使用vue内置指令v-html将字符串解析为原生HTML插入元素中。
  代码块的高亮使用highlight.js插件。
  复制按钮复制的是代码块的内容，我们需要为每一个代码块添加一个复制按钮，代码块的内容最终被渲染到pre包裹的code元素下，即每一个代码块都由一个pre包括，于是我们可以定义一个函数，该函数使用document.querySelectorAll获取所有pre元素，遍历pre元素，使用document.createElement创建button，使用appendChild将button按钮插入pre下。再使用addEventListener为该按钮添加点击事件，使用querySelector('code').textContent获取code标签下的内容，同样使用浏览器内置API navigator.clipboard.wirteText完成复制，该API是异步函数，于是使用async..await和try..catch处理，并返回成功或失败的结果。该函数需要根据消息列表的更新而响应式更新，于是我们可以使用watch监听消息内容的变化，若消息内容变化，就执行一次生成复制按钮的函数，并将immediately设为true，使其在页面首次加载时也渲染。

5. Footer.vue
功能：文件上传+消息发送
业务逻辑分析：消息发送函数统一在store中管理，这里主要是收集用户输入的信息，执行store的消息发送函数。在发送消息之前验证输入框是否为空+是否设置了API Key。
```

## OpenAI API完整调用流程

###### 配置环境变量

```tsx
默认情况.env要放在package.json同一目录下才能被加载，使用import.meta.env获取环境变量

.env 所有环境加载
.env.development 开发环境加载
.env.production 生产环境加载

# OpenAI API 配置
VITE_OPENAI_API_URL=https://chatapi.littlewheat.com/v1
VITE_OPENAI_API_MODEL=gpt-3.5-turbo
VITE_OPENAI_API_TEMPERATURE=0.7
# 应用配置
VITE_APP_TITLE=Muggle Chat
VITE_APP_DESCRIPTION=AI Chat Application

```

###### API配置 config.ts

```
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_OPENAI_API_URL,
  model: import.meta.env.VITE_OPENAI_API_MODEL,
  temperature: Number(import.meta.env.VITE_OPENAI_API_TEMPERATURE),
}

```

###### 封装OpenAI API调用

```tsx
HTTP层：封装Axios实例，设请求/响应拦截器，统一处理请求响应
业务层：消息发送(普通/流式)，消息格式转化，业务错误处理
安全层：API密钥管理（未来采用加密技术，存储在数据库）
配置层：环境配置、API参数配置、存储键管理

1. 核心类型
// 聊天消息（源自API接口文档）
interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
// 请求携带的参数（源自API接口文档）
interface ChatCompletionRequest {
  model: string // 模型
  messages: ChatMessage[] // 消息历史记录
  temperature?: number // 温度参数
  stream?: boolean // 是否启用流式响应
}
// 流式响应数据（源自API接口文档）
interface ChatStreamResponse {
  id: string // 响应ID
  choices: {
    delta: { // 增量内容
      content?: string // 文本内容（消息内容）
    }
    finish_reason?: string // 结束原因
  }[]
}
// 请求配置（每条请求所必须的）
interface ChatHttpOption {
  url: string // 请求地址
  data?: any // 请求携带的数据/参数
  method?: string // 请求方法
  headers?: Record<string, string> // 请求头
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void // 下载进度回调处理事件
  signal?: AbortSignal // 请求取消信号
}

2. 创建axios实例
const chatAPI = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json', // 指定请求内容格式 为JSON
  },
  timeout: 60000, // 设置超时时间为60秒
})

3. 请求拦截器
添加认证信息：在每个请求发送前自动添加 API Key 到请求头
chatAPI.interceptors.request.use((config)=>{
    const apiKey = localStorage.getItem(STORAGE_KEYS.apiKey)
     if (apiKey) {
    // Authorization: Bearer $OPENAI_API_KEY"
    // apiKey为token,适用JWT认证(源自API文档)
    config.headers.Authorization = `Bearer ${apiKey}`
    config.headers['x-requested-with'] = 'XMLHttpRequest'
  }
  return config
})

4. 响应拦截器
chatAPI.interceptors.response.use(
  response => response,
  (error) => {
    const errorMap = {
      401: 'API Key 无效或已过期',
      403: '没有访问权限',
      429: '请求次数超限',
      500: '服务器错误',
    }
    // 请求成功且服务器响应了状态码，但状态码超出2xx范围
    if (error.response) {
      const status = error.response.status
      console.error(errorMap[status] || `请求失败: ${status}`, error.response.data)
    }
    // 请求成功，但未收到响应
    else if (error.request) {
      console.error('网络错误，未收到响应')
    }
    // 请求未成功发起
    else {
      console.error('请求配置错误:', error.message)
    }
    return Promise.reject(error)
  },
)

5. 统一处理get post请求
// 其实就是区分，如果是get请求，请求配置添加params携带参数，如果是post请求，请求配置添加data携带请求数据
async function http({
    url,
    data,
    method='POST',
    headers,
    onDownloadProgress,
    signal
}){
    const config={
        url,
        method,
        headers,
        signal,
        onDownloadProgress
    }
    if(method==='GET'){
        config.params=data
    }else{
        config.data=data
    }
    const response = await chatAPI(config)
    return response.data
}

6. Chat API服务
// 发送请求，响应数据流式处理，更新消息和会话，更新UI
// 返回三个函数
function setApiKey(apiKey: string) {
  localStorage.setItem(STORAGE_KEYS.apiKey, apiKey)
}

function getApiKey() {
  return localStorage.getItem(STORAGE_KEYS.apiKey)
}

async function sendStreamMessage(
  messages: Message[],
  options = {},
  onProgress?: (text: string) => void,
) {
  // 1. 请求参数
  const requestData: ChatCompletionRequest = {
    model: API_CONFIG.model, 
    messages: messages.map(msg => ({
      role: msg.role, // 消息角色
      content: msg.content, // 消息内容
    })),
    temperature: API_CONFIG.temperature, 
    stream: true, // 启用流式响应
    ...options, // 合并自定义选项
  }

  // 2. 状态变量
  let responseText = '' // 完整的响应文本
  let currentChunk = '' // 新增内容

  try {
      // 3. 发起请求，获取响应数据
      /*
      chunk：完整数据列表
      newContent：新增数据列表
      line：单个数据条
      data: 真正的数据对象字符串
      parse: JSON数据格式
      content：真正的消息文本
      responeseText: 完整响应消息文本
  
OpenAI 的流式响应采用 SSE 格式，数据格式如  
data: {"id":"xxx","choices":[{"delta":{"content":"你"},"finish_reason":null}]}
data: {"id":"xxx","choices":[{"delta":{"content":"好"},"finish_reason":null}]}
data: {"id":"xxx","choices":[{"delta":{"content":"！"},"finish_reason":null}]}
data: [DONE]
      */
  
    await http({
      url: '/chat/completions',
      data: requestData,
      headers: {
         // 指定接收 SSE 格式的响应
        'Accept': 'text/event-stream', 
      },
        // 定义进度回调函数
      onDownloadProgress: (progressEventt) => {
        // 获取完整的响应数据
        const chunk = progressEvent.event.target.response as string || ''
        // 计算新增的内容（与上次相比）
        const newContent = chunk.substring(currentChunk.length)
        // 更新当前数据块
        currentChunk = chunk
        // 按行分割 SSE 数据
        const lines = newContent.split('\n')
        // 处理每一行 SSE 数据
        for (const line of lines) {
          // 跳过空行和结束标记
          if (!line.trim() || line.includes('[DONE]'))
            continue

          try {
            // 移除 SSE 数据格式的前缀 "data: "
            const data = line.replace(/^data: /, '').trim()
            if (!data)
              continue
            // 解析 JSON 格式的数据
            const parsed = JSON.parse(data) as ChatStreamResponse
            // 提取增量内容
            const content = parsed.choices[0]?.delta?.content || ''

            // 如果有新内容，更新响应文本并触发回调
            if (content) {
              responseText += content // 累积响应文本
              onProgress?.(responseText) // 触发进度回调，更新 UI
            }
          }
          catch {
            continue // 忽略解析错误，继续处理下一行
          }
        }
      },
    })

    // 验证响应的有效性
    if (!responseText)
      throw new Error('未收到有效的响应内容')

    // 返回完整的响应消息对象
    return {
      role: 'assistant' as const,
      content: responseText,
    }
  }
  catch (error) {
    console.error('发送流式消息失败:', error)
    throw error
  }
}
```

## 完成Store状态管理

```tsx
1. 核心类型
export interface Message {
  id: string // 消息唯一标识
  role: 'user' | 'assistant' // 消息角色：用户/AI助手
  content: string // 消息内容
  timestamp: number // 时间戳
  status: 'sending' | 'success' | 'error' // 消息状态
}
export interface ChatSession {
  id: string // 会话唯一标识
  title: string // 会话标题
  messages: Message[] // 消息列表
  createdAt: number // 创建时间
  updatedAt: number // 更新时间
}

2. store
    // State
    currentSessionId, // 当前会话ID
    sessions, // 会话列表
    loading, // 加载状态
    error, // 错误提示
    // Getters
    currentSession, // 当前会话
    currentMessages, // 当前会话消息列表
    sessionList, // 侧边栏会话列表
    // Actions
    createSession, // 创建会话
    switchSession, // 切换会话
    sendMessage, //发送消息
    clearCurrentSession, // 清空会话
    deleteSession, // 删除会话
    updateSessionTitle, // 更新会话标题

3. 会话存储 -- 手动本地持久化存储
  const saveSessions = () => {
    localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions.value))
  }

4. 会话初始化 -- 初次加载时渲染
  const initSessions = () => {
    const savedSessions = localStorage.getItem(STORAGE_KEYS.sessions)
    if (savedSessions) {
      sessions.value = JSON.parse(savedSessions)
      // 按更新时间排序
      sessions.value.sort((a, b) => b.updatedAt - a.updatedAt)
      // 如果有会话，选中第一条（最新的会话）
      if (sessions.value.length > 0)
        currentSessionId.value = sessions.value[0].id
    }
  }

5. 通过计算属性根据会话列表获取：当前会话/当前会话消息列表/侧边栏会话列表
 /**
   * 获取当前选中的会话对象
   */
  const currentSession = computed(() =>
    sessions.value.find(session => session.id === currentSessionId.value),
  )

  /**
   * 获取当前会话的消息列表
   */
  const currentMessages = computed(() =>
    currentSession.value?.messages || [],
  )

  /**
   * 获取会话列表的简化信息（用于侧边栏显示）
   */
  const sessionList = computed(() =>
    sessions.value
      .map(({ id, title, updatedAt }) => ({ id, title, updatedAt }))
      .sort((a, b) => b.updatedAt - a.updatedAt),
  )
  
6. 创建会话 -- 更新会话列表 -- 手动存储

7. 切换会话 -- 更新当前会话ID
 
8. 发送消息 -- 更新会话列表 -- 手动存储

9. 清空会话 

10. 删除会话 -- 更新会话列表 -- 手动存储

```

# 附录

eslint.config.js

```js
import mist from '@mistjs/eslint-config'
export default mist({
  rules: {
    'no-console': 'off',
  },
})
```

setting.json

```js
{
  // 开启eslint扁平化配置
  "eslint.experimental.useFlatConfig": true,
  // "window.zoomLevel": 0,
  // 关闭默认的配置，我们这里默认不开启prettier格式化
  "prettier.enable": false,
  // 关闭默认格式化
  "editor.formatOnSave": false,

  // 保存自动修复
  "editor.codeActionsOnSave": {
    // 我们这里是指定自定义的修复
    "source.fixAll": "explicit",
    // 来源导入我们不需要给关闭掉
    "source.organizeImports": "never"
  },

  // 静默样式规则自动修复
  "eslint.rules.customizations": [
    { "rule": "style/*", "severity": "off" },
    { "rule": "*-indent", "severity": "off" },
    { "rule": "*-spacing", "severity": "off" },
    { "rule": "*-spaces", "severity": "off" },
    { "rule": "*-order", "severity": "off" },
    { "rule": "*-dangle", "severity": "off" },
    { "rule": "*-newline", "severity": "off" },
    { "rule": "*quotes", "severity": "off" },
    { "rule": "*semi", "severity": "off" }
  ],

  // 在eslin中开启哪些语言的校验
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "jsonc",
    "yaml"
  ]
}
```


```
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```
