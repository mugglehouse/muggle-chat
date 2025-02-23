<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Button, Empty, Input } from 'ant-design-vue'
import { CloseOutlined, LeftOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons-vue'
import { storeToRefs } from 'pinia'
import MessageItem from '../../views/chat/components/message/MessageItem.vue'
import { useChatStore } from '../../store/chat'

interface Props {
  loading?: boolean
  mode: 'expanded' | 'chatting'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  close: []
  back: []
  submit: [content: string]
  switchMode: [mode: 'expanded' | 'chatting']
}>()

const store = useChatStore()
const inputValue = ref('')
const messageListRef = ref<HTMLElement | null>(null)

// 使用 storeToRefs 获取响应式引用
const { sessionList, currentMessages } = storeToRefs(store)

// 滚动到底部
async function scrollToBottom() {
  await nextTick()
  if (messageListRef.value)
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
}

// 监听消息变化，自动滚动
watch(() => currentMessages.value, () => {
  scrollToBottom()
}, { deep: true })

// 切换会话
function switchSession(sessionId: string) {
  store.switchSession(sessionId)
  emit('switchMode', 'chatting')
}

// 提交消息
async function handleSubmit() {
  const content = inputValue.value.trim()
  if (content) {
    // 如果在会话列表界面或没有当前会话，创建新会话
    if (props.mode === 'expanded' || !store.currentSessionId) {
      store.createSession()
      emit('switchMode', 'chatting')
      // 等待下一个 tick，确保模式切换完成
      await nextTick()
    }
    emit('submit', content)
    inputValue.value = ''
  }
}
</script>

<template>
  <div class="inline-chat-box">
    <!-- 头部 -->
    <div class="chat-header">
      <div class="header-left">
        <Button
          v-if="mode === 'chatting'"
          type="text"
          class="back-btn"
          @click="$emit('back')"
        >
          <LeftOutlined />
        </Button>
        <span class="title">{{ mode === 'expanded' ? '选择会话' : '对话中' }}</span>
      </div>
      <Button type="text" class="close-btn" @click="$emit('close')">
        <CloseOutlined />
      </Button>
    </div>

    <!-- 输入框 -->
    <div class="chat-input">
      <Input.TextArea
        v-model:value="inputValue"
        placeholder="输入消息..."
        :auto-size="{ minRows: 1, maxRows: 4 }"
        class="input"
        @press-enter.prevent="handleSubmit"
      />
      <Button
        type="primary"
        class="submit-btn"
        :disabled="!inputValue.trim()"
        @click="handleSubmit"
      >
        <SendOutlined />
      </Button>
    </div>

    <!-- 主体内容 -->
    <div class="chat-body">
      <!-- 会话列表 -->
      <template v-if="mode === 'expanded'">
        <div class="session-list">
          <!-- 会话列表 -->
          <template v-if="sessionList.length">
            <div
              v-for="session in sessionList"
              :key="session.id"
              class="session-item"
              :class="{ active: session.id === store.currentSessionId }"
              @click="switchSession(session.id)"
            >
              <MessageOutlined />
              <span class="session-title">{{ session.title }}</span>
            </div>
          </template>
          <Empty v-else description="暂无会话记录" />
        </div>
      </template>

      <!-- 消息列表 -->
      <template v-else>
        <div ref="messageListRef" class="message-list">
          <template v-if="currentMessages.length">
            <MessageItem
              v-for="message in currentMessages"
              :key="message.id"
              :message="message"
            />
          </template>
          <div v-else class="empty-state">
            开始新的对话...
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inline-chat-box {
  width: 600px;
  height: 600px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
  max-width: 90vw;

  .chat-header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .back-btn {
      padding: 4px;
      color: #999;
      transition: all 0.2s;

      &:hover {
        color: #000;
        background-color: #f5f5f5;
      }
    }

    .title {
      font-size: 16px;
      font-weight: 500;
    }

    .close-btn {
      padding: 4px;
      color: #999;
      transition: all 0.2s;

      &:hover {
        color: #000;
        background-color: #f5f5f5;
      }
    }
  }

  .chat-input {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    gap: 8px;
    flex-shrink: 0;

    .input {
      flex: 1;

      :deep(.ant-input) {
        border-radius: 8px;
        resize: none;
        border-color: #d9d9d9;

        &:hover, &:focus {
          border-color: #000;
          box-shadow: none;
        }
      }
    }

    .submit-btn {
      align-self: flex-end;
      width: 32px;
      height: 32px;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #000;
      border-color: #000;

      &:hover {
        background-color: #333;
        border-color: #333;
      }

      &:disabled {
        background-color: #f5f5f5;
        border-color: #d9d9d9;
      }
    }
  }

  .chat-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .session-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;

    .session-item {
      padding: 12px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      color: #666;

      .session-title {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    :deep(.ant-empty) {
      margin: 32px 0;
      color: #999;
    }
  }

  .message-list {
    flex: 1;
    overflow-y: auto;
    padding: 20px;

    .empty-state {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      font-size: 14px;
    }

    /* 滚动条样式 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: #d9d9d9;
      border-radius: 3px;

      &:hover {
        background: #bfbfbf;
      }
    }
  }
}
</style>
