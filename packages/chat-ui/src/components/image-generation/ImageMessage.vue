<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import type { ImageMessage } from '../../store/chat'

// Props
defineProps<{
  message: ImageMessage
  showMetadata?: boolean
}>()

// 状态
const showPreview = ref(false)
const previewUrl = ref('')

// 生成进度相关的文案
const progressTexts = [
  '正在构思图像...',
  '绘制草图中...',
  '添加细节...',
  '最终润色...',
]
const currentProgressIndex = ref(0)

// 每3秒更新一次进度文案
let progressInterval: number | null = null

// 启动进度更新
progressInterval = setInterval(() => {
  if (currentProgressIndex.value < progressTexts.length - 1)
    currentProgressIndex.value++
}, 3000)

// 组件卸载时清除定时器
onUnmounted(() => {
  if (progressInterval)
    clearInterval(progressInterval)
})

// 方法
function handlePreview(url: string) {
  previewUrl.value = url
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
  previewUrl.value = ''
}

function handleImageLoad(e: Event) {
  const img = e.target as HTMLImageElement
  img.classList.remove('is-loading')
}

function handleImageError(e: Event) {
  const img = e.target as HTMLImageElement
  img.classList.add('error')
}

// 添加下载方法
async function handleDownload(url: string) {
  try {
    // 获取图片数据
    const response = await fetch(url)
    const blob = await response.blob()

    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    // 从 URL 中提取文件名，如果没有则使用时间戳
    const filename = url.split('/').pop() || `image-${Date.now()}.png`
    link.download = filename

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
  catch (error) {
    console.error('下载图片失败:', error)
  }
}
</script>

<template>
  <div class="image-message">
    <!-- 生成进度提示 -->
    <div v-if="message.status === 'sending' && !message.imageUrls.length && message.role === 'assistant'" class="progress-indicator">
      <div class="progress-spinner">
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5" />
        </svg>
      </div>
      <div class="progress-text">
        {{ progressTexts[currentProgressIndex] }}
      </div>
    </div>

    <!-- 图片列表 -->
    <div v-if="message.imageUrls.length > 0" class="image-list">
      <div
        v-for="(url, index) in message.imageUrls"
        :key="index"
        class="image-item"
        @click="handlePreview(url)"
      >
        <!-- 下载按钮 -->
        <div class="download-button" title="下载图片" @click.stop="handleDownload(url)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <img
          :src="url"
          :alt="message.content"
          class="image"
          :class="{ 'is-loading': message.status === 'sending' }"
          @load="handleImageLoad"
          @error="handleImageError"
        >
        <div v-if="message.status === 'sending'" class="loading-overlay">
          生成中...
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
  margin: 8px 0;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
  border-radius: 8px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 8px;
}

.image:hover {
  transform: scale(1.05);
}

.image.is-loading {
  filter: blur(4px);
}

.image.error {
  opacity: 0.5;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 14px;
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

.progress-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
}

.progress-spinner {
  width: 28px;
  height: 28px;
}

.spinner {
  animation: rotate 2s linear infinite;
  width: 100%;
  height: 100%;
}

.path {
  stroke: var(--primary-color, #3b82f6);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.progress-text {
  color: var(--text-secondary, #6b7280);
  font-size: 14px;
  text-align: center;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.download-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1;
}

.download-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-item:hover .download-button {
  opacity: 1;
}
</style>
