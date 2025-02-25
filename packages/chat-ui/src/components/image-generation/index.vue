<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChatStore } from '../../store/chat'
import { API_CONFIG } from '../../config'

// Props 定义
defineProps<{
  placeholder?: string
}>()

// Store
const chatStore = useChatStore()

// 状态
const prompt = ref('')
const size = ref<string>(API_CONFIG.imageGeneration.defaultSize)
const count = ref<number>(1)
const loading = ref(false)
const progress = ref(0)
const error = ref('')

// 常量
const maxLength = API_CONFIG.imageGeneration.maxTokens
const maxCount = API_CONFIG.imageGeneration.limits.maxImages
const sizes = ['256x256', '512x512', '1024x1024']

// 计算属性
const canGenerate = computed(() => prompt.value.trim().length > 0)

// 方法
function handleEnter(e: KeyboardEvent) {
  if (e.shiftKey)
    return // Shift + Enter 换行
  handleGenerate()
}

async function handleGenerate() {
  if (!canGenerate.value || loading.value)
    return

  try {
    loading.value = true
    error.value = ''
    progress.value = 0

    await chatStore.sendImagePrompt(
      prompt.value,
      {
        size: size.value as '256x256' | '512x512' | '1024x1024',
        n: count.value,
      },
      (p) => {
        progress.value = p
      },
    )

    // 清空输入
    prompt.value = ''
  }
  catch (err: any) {
    error.value = err.message || '图片生成失败'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="image-generation">
    <!-- 提示词输入 -->
    <div class="prompt-input">
      <textarea
        v-model="prompt"
        :placeholder="placeholder"
        :maxlength="maxLength"
        rows="3"
        class="prompt-textarea"
        @keydown.enter.prevent="handleEnter"
      />
      <div class="input-footer">
        <span class="word-count">{{ prompt.length }}/{{ maxLength }}</span>
        <div class="options">
          <select v-model="size" class="size-select">
            <option v-for="s in sizes" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
          <select v-model="count" class="count-select">
            <option v-for="n in maxCount" :key="n" :value="n">
              {{ n }}张
            </option>
          </select>
        </div>
        <button
          class="generate-btn"
          :disabled="!canGenerate || loading"
          @click="handleGenerate"
        >
          {{ loading ? '生成中...' : '生成图片' }}
        </button>
      </div>
    </div>

    <!-- 生成进度 -->
    <div v-if="loading" class="progress">
      <div class="progress-bar" :style="{ width: `${progress}%` }" />
      <span class="progress-text">{{ progress }}%</span>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.image-generation {
  width: 100%;
  padding: 16px;
}

.prompt-input {
  width: 100%;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 12px;
  background: var(--bg-color);
}

.prompt-textarea {
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-color);
  font-size: 14px;
  line-height: 1.5;
  padding: 8px;
}

.input-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  padding: 0 8px;
}

.word-count {
  color: var(--text-secondary);
  font-size: 12px;
}

.options {
  display: flex;
  gap: 8px;
}

.size-select,
.count-select {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--bg-color);
  color: var(--text-color);
  font-size: 12px;
}

.generate-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.generate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.progress {
  margin-top: 16px;
  background: var(--bg-secondary);
  border-radius: 4px;
  height: 4px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  color: var(--text-secondary);
}

.error {
  margin-top: 16px;
  padding: 8px 12px;
  background: var(--error-bg);
  color: var(--error-color);
  border-radius: 4px;
  font-size: 14px;
}
</style>
