<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { useChatStore } from '../../store/chat'
import type { Message } from '../../store/chat'
import MessageItem from './components/message/MessageItem.vue'

// 消息列表框元素
const messageListRef = ref<HTMLElement | null>(null)
const store = useChatStore()
const { currentMessages, loading } = storeToRefs(store)

// 滚动到底部
async function scrollToBottom() {
  // scrollHeight为消息列表框的总高度（包括溢出页面部分），cilentHeight为消息列表框的可见高度，scrollTop为滚动距离
  // 当scrollTop + clientHeight = scrollHeight时，说明滚动到底部
  await nextTick()
  if (messageListRef.value) {
    const { scrollHeight, clientHeight } = messageListRef.value
    messageListRef.value.scrollTop = scrollHeight - clientHeight
  }
}

// 监听消息变化，自动滚动
watch(
  currentMessages,
  (newMessages, oldMessages) => {
    // 如果是首次加载消息
    if (!oldMessages) {
      scrollToBottom()
      return
    }

    // 只关注最后一条消息的变化
    const lastNewMsg = newMessages[newMessages.length - 1]
    const lastOldMsg = oldMessages[oldMessages.length - 1]

    // 在以下情况需要滚动到底部：
    // 1. 新增了消息（最后一条消息ID不同）
    // 2. 最后一条消息的内容发生变化
    if (
      lastNewMsg?.id !== lastOldMsg?.id
      || lastNewMsg?.content !== lastOldMsg?.content
    ) {
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
    message.success('复制成功')
  }
  catch (err) {
    message.error('复制失败')
  }
}
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
          v-for="msg in currentMessages"
          :key="msg.id"
          :message="msg"
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
