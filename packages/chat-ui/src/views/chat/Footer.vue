<script lang="ts" setup>
import { computed, ref } from 'vue'
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons-vue'
import { Button, Input, message } from 'ant-design-vue'
import { useChatStore } from '../../store/chat'
import { chatService } from '../../api/chat'

const { TextArea } = Input
const messageInput = ref('')
const chatStore = useChatStore()

// 计算当前输入是否是图片生成命令
const isImageGeneration = computed(() => {
  const input = messageInput.value.trim()
  return input.startsWith('/image ') || input.startsWith('/img ')
})

// 从输入中提取图片生成参数
function parseImageCommand(input: string): { prompt: string; size?: string; n?: number } {
  // 移除命令前缀
  const content = input.replace(/^\/(?:image|img)\s+/, '').trim()

  // 解析参数
  const params = content.split('--')
  const prompt = params[0].trim()
  const options: { size?: string; n?: number } = {}

  // 解析其他参数
  params.slice(1).forEach((param) => {
    const [key, value] = param.trim().split(' ')
    if (key === 'size' && ['256x256', '512x512', '1024x1024'].includes(value)) {
      options.size = value
    }
    else if (key === 'n') {
      const num = Number.parseInt(value)
      if (num >= 1 && num <= 10)
        options.n = num
    }
  })

  return { prompt, ...options }
}

async function handleSend() {
  if (!messageInput.value.trim())
    return

  if (!chatService.getApiKey()) {
    message.error('请先在设置中配置 OpenAI API Key')
    return
  }

  try {
    if (isImageGeneration.value) {
      // 处理图片生成命令
      const { prompt, size, n } = parseImageCommand(messageInput.value)
      await chatStore.sendImagePrompt(prompt, { size: size as '256x256' | '512x512' | '1024x1024', n })
    }
    else {
      // 处理普通文本消息
      await chatStore.sendMessage(messageInput.value)
    }
    messageInput.value = ''
  }
  catch (err) {
    console.error('发送消息失败:', err)
    message.error('发送消息失败，请重试')
  }
}

function handleUpload() {
  message.info('文件上传功能开发中')
}

// 输入提示信息
const inputPlaceholder = computed(() => {
  if (isImageGeneration.value)
    return '输入图片描述，可选参数：--size [256x256|512x512|1024x1024] --n [1-10]'

  return '输入消息，使用 /image 或 /img 生成图片...'
})
</script>

<template>
  <div class="chat-footer">
    <div class="input-container">
      <!-- 输入框 -->
      <div class="input-wrapper">
        <TextArea
          v-model:value="messageInput"
          :placeholder="inputPlaceholder"
          :auto-size="{ minRows: 1, maxRows: 4 }"
          class="message-input"
          :class="{ 'is-image-mode': isImageGeneration }"
          @keypress.enter.prevent="handleSend"
        />
        <div class="action-buttons">
          <Button type="text" class="action-btn upload-button" @click="handleUpload">
            <PaperClipOutlined />
          </Button>
          <Button
            type="primary"
            class="action-btn send-button"
            :disabled="!messageInput.trim()"
            @click="handleSend"
          >
            <template #icon>
              <SendOutlined />
            </template>
          </Button>
        </div>
      </div>
      <!-- 命令提示 -->
      <div v-if="isImageGeneration" class="command-tips">
        示例：/image 一只可爱的猫咪 --size 1024x1024 --n 1
      </div>
      <!-- 免责声明 -->
      <div class="disclaimer">
        免责声明：AI可能会产生错误信息，请自行判断和验证重要信息
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-footer {
  padding: 1rem 2rem 1.5rem;

  .input-container {
    max-width: 48rem;
    margin: 0 auto;
  }

  .input-wrapper {
    position: relative;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 0.75rem;
    transition: all 0.2s;

    &:focus-within {
      border-color: #000;
      box-shadow: 0 0 0 1px #000;
    }
  }

  .message-input {
    border: none !important;
    background: transparent !important;
    padding: 0.875rem 9rem 0.875rem 1.25rem;
    resize: none;
    font-size: 0.9375rem;

    &.is-image-mode {
      background: rgba(0, 0, 0, 0.02) !important;
    }

    &:focus {
      box-shadow: none;
    }

    &::placeholder {
      color: #999;
    }
  }

  .action-buttons {
    position: absolute;
    right: 0.75rem;
    bottom: 0.5rem;
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }

  .action-btn {
    width: 2rem;
    height: 2rem;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
  }

  .upload-button {
    color: #666;

    &:hover {
      color: #000;
      background-color: #fafafa;
    }
  }

  .send-button {
    background-color: #000;
    border-color: #000;

    &:hover {
      background-color: #333;
      border-color: #333;
    }

    &:disabled {
      background-color: #fafafa;
      border-color: #eaeaea;
      color: #999;
    }
  }

  .command-tips {
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: #666;
    padding: 0 1rem;
  }

  .disclaimer {
    margin-top: 0.75rem;
    font-size: 0.75rem;
    text-align: center;
    color: #666;
  }
}
</style>
