<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useChatStore } from '../../store/chat'

// import type { Message } from '../../store/chat'
// import InlineChatInput from './InlineChatInput.vue'
import InlineChatBox from './InlineChatBox.vue'

interface Props {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  placeholder?: string
  initialPrompt?: string
  inline?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top-right',
  placeholder: '有什么可以帮你的？',
  initialPrompt: undefined,
  inline: false,
})

const emit = defineEmits<{
  close: []
}>()

// 状态管理
const mode = ref<'expanded' | 'chatting'>('expanded')
const store = useChatStore()
const { loading } = storeToRefs(store)

// 计算属性
const containerClass = computed(() => [
  'inline-chat-dialog',
  props.position,
  mode.value,
  { inline: props.inline },
])

// 事件处理
function handleClose() {
  mode.value = 'expanded'
  emit('close')
}

function handleBack() {
  mode.value = 'expanded'
}

function handleSwitchMode(newMode: 'expanded' | 'chatting') {
  mode.value = newMode
}

async function handleSubmit(content: string) {
  if (!content)
    return

  // 确保在对话模式下
  if (mode.value !== 'chatting')
    mode.value = 'chatting'

  // 如果没有当前会话，创建新会话
  if (!store.currentSessionId)
    store.createSession()

  // 发送消息
  await store.sendMessage(content)
}
</script>

<template>
  <div :class="containerClass">
    <!-- 遮罩层 -->
    <div v-if="!props.inline" class="dialog-overlay" @click="handleClose" />

    <Transition name="fade" mode="out-in">
      <!-- 展开状态 & 对话状态 -->
      <InlineChatBox
        :loading="loading"
        :mode="mode"
        @close="handleClose"
        @back="handleBack"
        @submit="handleSubmit"
        @switch-mode="handleSwitchMode"
      />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.inline-chat-dialog {
  position: fixed;
  z-index: 1000;

  &.inline {
    position: relative;
    z-index: 1;

    &.expanded, &.chatting {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  // 位置变体（仅在非内联模式下生效）
  &:not(.inline) {
    &.top-right {
      top: 20px;
      right: 20px;
    }

    &.top-left {
      top: 20px;
      left: 20px;
    }

    &.bottom-right {
      bottom: 20px;
      right: 20px;
    }

    &.bottom-left {
      bottom: 20px;
      left: 20px;
    }
  }
}

// 遮罩层
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: -1;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
