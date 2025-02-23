<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { message as antMessage } from 'ant-design-vue'
import { useChatStore } from '../../store/chat'
import { chatService } from '../../api/chat'
import type { Message } from '../../store/chat'
import MessageItem from './components/message/MessageItem.vue'

// 消息列表框元素
const messageListRef = ref<HTMLElement | null>(null)
const store = useChatStore()
const { currentMessages } = storeToRefs(store)
let observer: MutationObserver | null = null
const shouldAutoScroll = ref(true)

// 检查是否在底部
function isNearBottom() {
  if (!messageListRef.value)
    return true
  const { scrollTop, scrollHeight, clientHeight } = messageListRef.value
  // 考虑一定的误差范围（比如 100px）
  return scrollHeight - scrollTop - clientHeight < 100
}

// 滚动到底部
async function scrollToBottom() {
  // 只有当用户在底部或设置了自动滚动时才滚动
  if (!shouldAutoScroll.value && !isNearBottom())
    return

  await nextTick()
  if (messageListRef.value)
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
}

// 处理滚动事件
function handleScroll() {
  shouldAutoScroll.value = isNearBottom()
}

// 初始化 MutationObserver
function initMessageObserver() {
  if (!messageListRef.value)
    return

  observer = new MutationObserver(() => {
    scrollToBottom()
  })

  observer.observe(messageListRef.value, {
    childList: true,
    subtree: true,
    characterData: true,
  })
}

// 组件挂载时初始化
onMounted(() => {
  scrollToBottom()
  initMessageObserver()
})

// 组件卸载时清理
onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

// 监听消息变化，自动滚动
watch(
  currentMessages,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  },
  { deep: true, immediate: true },
)

// 处理消息重试
async function handleRetry(msg: Message) {
  try {
    // 获取到当前消息之前的所有消息（包括当前消息）
    const messageIndex = currentMessages.value.findIndex(m => m.id === msg.id)
    const contextMessages = currentMessages.value.slice(0, messageIndex + 1)

    // 如果是 AI 消息，我们需要重试它的生成
    if (msg.role === 'assistant' && messageIndex > 0) {
      // 将当前消息状态设置为发送中
      msg.status = 'sending'
      msg.content = '' // 清空内容，准备重新生成

      // 使用之前的消息作为上下文重新生成回复
      const response = await chatService.sendStreamMessage(
        contextMessages.slice(0, -1), // 不包含当前消息
        {},
        (text) => {
          // 实时更新 AI 响应内容
          msg.content = text
        },
      )

      // 更新消息状态和内容
      msg.content = response.content
      msg.status = 'success'
    }
    // 如果是用户消息，我们需要重试它和它的 AI 回复
    else if (msg.role === 'user') {
      // 将当前消息状态设置为发送中
      msg.status = 'sending'

      // 重新发送消息
      await store.sendMessage(msg.content)
    }
  }
  catch (err) {
    console.error('重试消息失败:', err)
    // 设置消息状态为错误
    msg.status = 'error'
    // 使用 ant-design-vue 的 message 组件显示错误提示
    antMessage.error('重试失败，请稍后再试')
  }
}

// 处理消息复制
async function handleCopy(content: string) {
  try {
    await navigator.clipboard.writeText(content)
    antMessage.success('复制成功')
  }
  catch (err) {
    antMessage.error('复制失败')
  }
}

// 处理消息编辑
async function handleEdit(msg: Message, newContent: string) {
  try {
    // 获取到当前消息之前的所有消息
    const messageIndex = currentMessages.value.findIndex(m => m.id === msg.id)

    // 更新消息内容
    msg.content = newContent
    msg.status = 'sending'

    // 删除这条消息之后的所有消息
    const session = store.currentSession
    if (session) {
      session.messages = session.messages.slice(0, messageIndex + 1)
      // 重新发送消息以获取新的回复
      await store.sendMessage(newContent)
    }
  }
  catch (err) {
    console.error('编辑消息失败:', err)
    msg.status = 'error'
    antMessage.error('编辑失败，请稍后再试')
  }
}
</script>

<template>
  <div class="chat-content">
    <!-- 消息列表 -->
    <div
      ref="messageListRef"
      class="message-list"
      @scroll="handleScroll"
    >
      <div class="message-container">
        <template v-if="currentMessages.length">
          <MessageItem
            v-for="msg in currentMessages"
            :key="msg.id"
            :message="msg"
            @retry="handleRetry"
            @copy="handleCopy"
            @edit="handleEdit"
          />
        </template>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">
            💭
          </div>
          <div class="empty-text">
            开始新的对话...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .message-list {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
    padding: 20px;

    .message-container {
      max-width: 768px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
    }

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 4px;

      &:hover {
        background: #bfbfbf;
      }
    }

    /* Firefox */
    scrollbar-width: thin;
    scrollbar-color: #d9d9d9 transparent;
  }
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  padding: 20px;
  width: 100%;
  max-width: 768px; // 与消息列表相同的宽度
  margin: 0 auto;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
  }
}
</style>
