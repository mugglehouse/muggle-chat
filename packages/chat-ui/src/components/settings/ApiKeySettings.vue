<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button, Input, message } from 'ant-design-vue'
import { chatService } from '../../api/chat'

const apiKey = ref('')
const error = ref('')
const success = ref(false)

async function validateApiKey(key: string) {
  // 验证 API Key 格式
  if (!key || !key.startsWith('sk-') || key.length < 32)
    throw new Error('API Key 格式不正确，应以 sk- 开头')
}

async function saveApiKey() {
  try {
    if (!apiKey.value) {
      error.value = '请输入 API Key'
      return
    }

    // 验证 API Key 格式
    await validateApiKey(apiKey.value)

    // 直接存储原始的 API Key
    chatService.setApiKey(apiKey.value.trim())
    success.value = true
    error.value = ''
    message.success('API Key 已保存')

    // 3秒后清除成功提示
    setTimeout(() => {
      success.value = false
    }, 3000)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '保存 API Key 失败'
    message.error(error.value)
    // console.error('保存 API Key 失败:', err)
  }
}

// 初始化时获取已保存的 API Key
function initApiKey() {
  const savedApiKey = chatService.getApiKey()
  if (savedApiKey)
    apiKey.value = savedApiKey
}

onMounted(() => {
  initApiKey()
})
</script>

<template>
  <div class="api-key-settings">
    <h3>API 设置</h3>
    <!-- 输入框 -->
    <div class="input-group">
      <Input.Password
        v-model:value="apiKey"
        placeholder="请输入以 sk- 开头的 API Key"
        @press-enter="saveApiKey"
      />
      <Button type="primary" :disabled="!apiKey" @click="saveApiKey">
        保存
      </Button>
    </div>
    <!-- 错误提示 -->
    <p v-if="error" class="error-message">
      {{ error }}
    </p>
    <!-- 成功提示 -->
    <p v-if="success" class="success-message">
      API Key 已保存
    </p>
    <!-- 提示 -->
    <div class="tips">
      <p>提示：</p>
      <ul>
        <li>API Key试用：sk-jfSwObEaEjSLe3WoJly2Gv9vBoqBtnZtetoaDWRSpTwfr0Mp</li>
        <li>API Key 应以 sk- 开头</li>
        <li>请确保输入完整的 API Key</li>
        <li>API Key 将安全地存储在本地</li>
        <li>如遇到问题，请检查 API Key 是否有效</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.api-key-settings {
  padding: 1rem;
  border-radius: 8px;
  background: #f5f5f5;
}

.input-group {
  display: flex;
  gap: 8px;
  margin: 1rem 0;

  :deep(.ant-input-affix-wrapper) {
    flex: 1;
  }
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
}

.success-message {
  color: #2e7d32;
  font-size: 14px;
  margin-top: 8px;
}

.tips {
  margin-top: 16px;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
}

.tips p {
  margin: 0 0 8px 0;
  font-weight: 500;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips li {
  margin: 4px 0;
  color: #666;
}
</style>
