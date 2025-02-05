<script lang="ts" setup>
import { ref } from 'vue'
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons-vue'
import { Button, Input, message } from 'ant-design-vue'
import { useChatStore } from '../../store/chat'
import { chatService } from '../../api/chat'

const { TextArea } = Input
const messageInput = ref('')
const chatStore = useChatStore()

async function handleSend() {
  // 如果输入框为空，则不发送消息
  if (!messageInput.value.trim())
    return

  // 检查是否设置了 API Key
  if (!chatService.getApiKey()) {
    message.error('请先在设置中配置 OpenAI API Key')
    return
  }

  // 发送消息
  try {
    console.log('发送消息:', messageInput.value)
    await chatStore.sendMessage(messageInput.value)
    console.log('消息发送成功')
    messageInput.value = ''
  }
  catch (err) {
    console.error('发送消息失败:', err)
    message.error('发送消息失败，请重试')
  }
}

function handleUpload() {
  // TODO: 实现文件上传功能
  message.info('文件上传功能开发中')
}
</script>

<template>
  <div class="chat-footer">
    <div class="input-container">
      <!-- 输入框 -->
      <div class="input-wrapper">
        <!-- 输入框 -->
        <TextArea
          v-model:value="messageInput"
          placeholder="输入消息..."
          :auto-size="{ minRows: 1, maxRows: 4 }"
          class="message-input"
          @keypress.enter.prevent="handleSend"
        />
        <!-- 按钮 -->
        <div class="action-buttons">
          <!-- 上传按钮 -->
          <Button type="text" class="action-btn upload-button" @click="handleUpload">
            <PaperClipOutlined />
          </Button>
          <!-- 发送按钮 -->
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

    .message-input {
      border: none !important;
      background: transparent !important;
      padding: 0.875rem 7rem 0.875rem 1.25rem;
      resize: none;
      font-size: 0.9375rem;

      &:focus {
        box-shadow: none;
      }

      &::placeholder {
        color: #999;
      }
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

  .disclaimer {
    margin-top: 0.75rem;
    font-size: 0.75rem;
    text-align: center;
    color: #666;
  }
}
</style>
