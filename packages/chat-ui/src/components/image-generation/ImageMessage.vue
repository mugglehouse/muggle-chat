<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ImageMessage } from '../../store/chat'

// Props
const props = defineProps<{
  message: ImageMessage
  showMetadata?: boolean
}>()

// 计算属性
const isUser = computed(() => props.message.role === 'user')

// 状态
const showPreview = ref(false)
const previewUrl = ref('')

// 方法
function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString()
}

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
</script>

<template>
  <div class="image-message" :class="{ 'is-user': isUser }">
    <!-- 消息头部 -->
    <div class="message-header">
      <span class="role">{{ isUser ? '用户' : 'AI助手' }}</span>
      <span class="time">{{ formatTime(message.timestamp) }}</span>
    </div>

    <!-- 提示词 -->
    <div class="prompt">
      {{ message.content }}
    </div>

    <!-- 图片列表 -->
    <div v-if="message.imageUrls.length > 0" class="image-list">
      <div
        v-for="(url, index) in message.imageUrls"
        :key="index"
        class="image-item"
        @click="handlePreview(url)"
      >
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

    <!-- 元数据 -->
    <div v-if="message.metadata && showMetadata" class="metadata">
      <div class="metadata-item">
        <span class="label">尺寸：</span>
        <span class="value">{{ message.metadata.size }}</span>
      </div>
      <div class="metadata-item">
        <span class="label">数量：</span>
        <span class="value">{{ message.metadata.n }}张</span>
      </div>
      <div class="metadata-item">
        <span class="label">模型：</span>
        <span class="value">{{ message.metadata.model }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-message {
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
  background: var(--bg-color);
}

.image-message.is-user {
  background: var(--bg-secondary);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.prompt {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.5;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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

.metadata {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
  color: var(--text-secondary);
}

.metadata-item {
  display: inline-flex;
  align-items: center;
  margin-right: 16px;
}

.metadata-item .label {
  margin-right: 4px;
}
</style>
