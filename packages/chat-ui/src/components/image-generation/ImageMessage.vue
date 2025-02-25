<script setup lang="ts">
import { ref } from 'vue'
import type { ImageMessage } from '../../store/chat'

// Props
defineProps<{
  message: ImageMessage
  showMetadata?: boolean
}>()

// 状态
const showPreview = ref(false)
const previewUrl = ref('')

// 预览图片
function handlePreview(url: string) {
  previewUrl.value = url
  showPreview.value = true
}

// 关闭预览
function closePreview() {
  showPreview.value = false
  previewUrl.value = ''
}

// 下载图片
async function handleDownload(url: string) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = blobUrl
    a.download = url.split('/').pop() || `image-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    window.URL.revokeObjectURL(blobUrl)
  }
  catch (error) {
    console.error('下载图片失败:', error)
  }
}
</script>

<template>
  <div class="image-message">
    <div class="image-list">
      <div v-for="(url, index) in message.imageUrls" :key="index" class="image-item">
        <div class="image-wrapper">
          <img :src="url" :alt="message.content" @click="handlePreview(url)">
          <div class="download-button" title="下载图片" @click.stop="handleDownload(url)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
        </div>
        <!-- 图片描述 -->
        <div v-if="message.role === 'assistant' && message.metadata?.description" class="image-description">
          {{ message.metadata.description }}
        </div>
      </div>
    </div>

    <!-- 图片预览 -->
    <div v-if="showPreview" class="preview-overlay" @click="closePreview">
      <div class="preview-content">
        <img :src="previewUrl" :alt="message.content">
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="message.status === 'error'" class="error">
      图片生成失败，请重试
    </div>
  </div>
</template>

<style scoped>
.image-message {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-item {
  position: relative;
  width: fit-content;
  max-width: 300px;
}

.image-wrapper {
  position: relative;
  display: inline-block;
}

.image-wrapper img {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
}

.download-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-wrapper:hover .download-button {
  opacity: 1;
}

.preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
}

.preview-content {
  max-width: 90vw;
  max-height: 90vh;
}

.preview-content img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.error {
  padding: 8px 12px;
  background: var(--error-bg);
  color: var(--error-color);
  border-radius: 4px;
  font-size: 14px;
}

.image-description {
  margin-top: 8px;
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
