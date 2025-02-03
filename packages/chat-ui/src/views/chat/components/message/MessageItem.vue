<script setup lang="ts">
import { computed } from 'vue'
import MarkdownRenderer from '@muggle-chat/chat-ui/src/components/markdown/MarkdownRenderer.vue'
import type { Message } from '@muggle-chat/chat-ui/src/store/chat.ts'
import MessageStatus from './MessageStatus.vue'

interface Props {
  message: Message
}

const props = defineProps<Props>()

// 消息操作
const emit = defineEmits<{
  retry: [message: Message]
  copy: [content: string]
}>()

// 计算消息时间
const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
})

// 头像配置
const avatarConfig = computed(() => ({
  user: {
    icon: '👤',
    alt: '用户',
  },
  assistant: {
    icon: '🤖',
    alt: 'AI助手',
  },
})[props.message.role])

function handleRetry() {
  emit('retry', props.message)
}

function handleCopy() {
  emit('copy', props.message.content)
}
</script>

<template>
  <div class="message-item" :class="[message.role]">
    <!-- 头像 -->
    <div class="avatar" :title="avatarConfig.alt">
      {{ avatarConfig.icon }}
    </div>

    <div class="content">
      <!-- 消息内容 -->
      <div class="message-content">
        <MarkdownRenderer :content="message.content" />
      </div>

      <!-- 消息状态和时间 -->
      <div class="message-footer">
        <span class="time">{{ formattedTime }}</span>
        <MessageStatus
          :status="message.status"
          @retry="handleRetry"
          @copy="handleCopy"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-item {
  display: flex;
  gap: 12px;
  padding: 8px 16px;
  margin-bottom: 8px;

  &.user {
    flex-direction: row-reverse;

    .content {
      align-items: flex-end;
    }

    .message-content {
      background-color: #95ec69;
      border-radius: 12px 2px 12px 12px;
    }
  }

  &.assistant {
    .message-content {
      background-color: #ffffff;
      border-radius: 2px 12px 12px 12px;
    }
  }
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 80%;
}

.message-content {
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-break: break-word;

  :deep(p) {
    margin: 0;
    line-height: 1.5;
  }

  :deep(pre) {
    margin: 8px 0;
    padding: 12px;
    border-radius: 6px;
    background-color: #f6f6f6;
    overflow-x: auto;
  }
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #999;
  padding: 0 4px;

  .time {
    opacity: 0.8;
  }
}
</style>
