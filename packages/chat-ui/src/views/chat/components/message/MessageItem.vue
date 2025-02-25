<script setup lang="ts">
import { computed } from 'vue'
import MarkdownRenderer from '@muggle-chat/chat-ui/src/components/markdown/MarkdownRenderer.vue'
import type { Message } from '@muggle-chat/chat-ui/src/store/chat.ts'
import ImageMessage from '../../../../components/image-generation/ImageMessage.vue'
import MessageStatus from './MessageStatus.vue'

const props = defineProps<Props>()

// 触发事件
const emit = defineEmits<{
  retry: [message: Message]
  copy: [content: string]
}>()

interface Props {
  message: Message
}

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
    icon: '👩‍🎓',
    alt: '用户',
  },
  assistant: {
    icon: '🤖',
    alt: 'AI助手',
  },
})[props.message.role])

// 重试
function handleRetry() {
  emit('retry', props.message)
}

// 复制
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
      <div class="message-wrapper">
        <!-- 加载状态 -->
        <template v-if="message.status === 'sending' && message.role === 'assistant' && !message.content">
          <div class="message-bubble loading">
            <div class="loading-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
        </template>
        <!-- 正常内容 -->
        <template v-else>
          <!-- 文本内容 -->
          <div v-if="message.content" class="message-bubble">
            <MarkdownRenderer :content="message.content" />
          </div>
          <!-- 图片内容 -->
          <div v-if="message.type === 'image'" class="message-image">
            <ImageMessage :message="message" :show-metadata="message.role === 'assistant'" />
          </div>
        </template>
      </div>

      <!-- 消息状态和时间 -->
      <div class="message-footer">
        <span class="time">{{ formattedTime }}</span>
        <MessageStatus
          :status="message.status"
          :role="message.role"
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
  gap: 16px;
  padding: 20px;
  position: relative;

  &.user {
    flex-direction: row-reverse;

    .content {
      align-items: flex-end;
    }

    .message-bubble {
      background-color: #1a1a1a;
      color: white;
      border: none;
    }

    .message-footer {
      flex-direction: row-reverse;
    }
  }

  &.assistant {
    .message-bubble {
      background: transparent;
      border: none;
    }
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 85%;
}

.message-bubble {
  font-size: 15px;
  line-height: 1.6;
  word-break: break-word;
  padding: 12px 16px;
  border-radius: 12px;
  display: inline-block;

  &.loading {
    min-width: 60px;
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(p) {
    margin: 0 0 1em;
    line-height: 1.6;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(pre) {
    margin: 1em 0;
    padding: 12px;
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.04);
    overflow-x: auto;
  }
}

.message-image {
  :deep(.image-message) {
    background: transparent;
    padding: 0;
    border: none;
    border-radius: 8px;
    overflow: hidden;
  }

  img {
    display: block;
    max-width: 100%;
    border-radius: 8px;
  }
}

.loading-dots {
  display: flex;
  gap: 4px;
  align-items: center;

  span {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #666;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;

  .message-item:hover & {
    opacity: 1;
  }

  .time {
    transition: opacity 0.2s ease;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}
</style>
