<script setup lang="ts">
interface Props {
  status: 'sending' | 'success' | 'error'
}

defineProps<Props>()
const emit = defineEmits<{
  retry: []
  copy: []
}>()

const statusConfig = {
  sending: {
    icon: '⏳',
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
      <button
        v-if="status === 'error'"
        class="action-btn"
        title="重试"
        @click="emit('retry')"
      >
        🔄
      </button>
      <button
        class="action-btn"
        title="复制"
        @click="emit('copy')"
      >
        📋
      </button>
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

  &.success {
    color: #52c41a;
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
  opacity: 0;
  transition: opacity 0.2s;

  .message-status:hover & {
    opacity: 1;
  }
}

.action-btn {
  padding: 2px;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>
