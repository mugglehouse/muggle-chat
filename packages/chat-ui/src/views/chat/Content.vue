<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../store/chat'
import type { Message } from '../../store/chat'
import MessageItem from './components/message/MessageItem.vue'

const messageListRef = ref<HTMLElement | null>(null)
const store = useChatStore()
const { currentMessages, loading } = storeToRefs(store)

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (messageListRef.value) {
    const { scrollHeight } = messageListRef.value
    messageListRef.value.scrollTop = scrollHeight
  }
}

// 监听消息变化，自动滚动
watch(
  currentMessages,
  (newMessages, oldMessages) => {
    // 检查是否有新消息或消息内容更新
    const hasNewMessage = newMessages.length !== oldMessages?.length
    const hasContentUpdate = newMessages.some((msg, index) => {
      const oldMsg = oldMessages?.[index]
      return oldMsg && (msg.content !== oldMsg.content || msg.status !== oldMsg.status)
    })

    if (hasNewMessage || hasContentUpdate) {
      console.log('消息更新，滚动到底部')
      scrollToBottom()
    }
  },
  { deep: true, immediate: true },
)

// 处理消息重试
async function handleRetry(message: Message) {
  // TODO: 实现消息重试逻辑
  console.log('重试消息:', message)
}

// 处理消息复制
async function handleCopy(content: string) {
  try {
    await navigator.clipboard.writeText(content)
    // TODO: 添加复制成功提示
  }
  catch (err) {
    console.error('复制失败:', err)
    // TODO: 添加复制失败提示
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-content">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner" />
      <span>正在思考...</span>
    </div>

    <!-- 消息列表 -->
    <div ref="messageListRef" class="message-list">
      <template v-if="currentMessages.length">
        <MessageItem
          v-for="message in currentMessages"
          :key="message.id"
          :message="message"
          @retry="handleRetry"
          @copy="handleCopy"
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
</template>

<style lang="scss" scoped>
.chat-content {
  position: relative;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;

  .message-list {
    height: 100%;
    overflow-y: auto;
    padding: 20px 0;
    display: flex;
    flex-direction: column;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ddd;
      border-radius: 2px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }
}

.loading-wrapper {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  font-size: 14px;
  z-index: 10;

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
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

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .empty-text {
    font-size: 16px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
