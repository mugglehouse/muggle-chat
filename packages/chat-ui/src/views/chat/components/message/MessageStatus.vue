<script setup lang="ts">
interface Props {
  status: 'sending' | 'success' | 'error'
  role: 'user' | 'assistant'
}

defineProps<Props>()
const emit = defineEmits<{
  retry: []
  copy: []
  edit: []
}>()

const statusConfig = {
  sending: {
    icon: '...',
    text: '发送中...',
  },
  success: {
    icon: '✓',
    text: '已发送',
  },
  error: {
    icon: '⚠',
    text: '发送失败',
  },
}
</script>

<template>
  <div class="message-status" :class="status">
    <span class="status-icon" :title="statusConfig[status].text">
      {{ statusConfig[status].icon }}
    </span>

    <div class="actions">
      <!-- 只显示AI消息的重试和复制按钮 -->
      <template v-if="role === 'assistant'">
        <button
          class="action-btn"
          title="重试"
          @click="emit('retry')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m0 0H4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          class="action-btn"
          title="复制"
          @click="emit('copy')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;

  &.sending {
    color: #666;
  }

  &.error {
    color: #ff4d4f;
  }
}

.status-icon {
  display: inline-flex;
  align-items: center;
}

.actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  background: none;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
    color: #000;
  }

  svg {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  &:hover svg {
    opacity: 1;
  }
}
</style>
