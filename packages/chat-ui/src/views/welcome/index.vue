<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const showContent = ref(false)
const showMagicEffect = ref(false)

function enterChat() {
  showMagicEffect.value = true
  setTimeout(() => {
    router.push('/chat')
  }, 800)
}

onMounted(() => {
  showContent.value = true
})
</script>

<template>
  <div class="welcome-container">
    <div class="stars">
      <div
        v-for="n in 50" :key="n" class="star" :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
        }"
      />
    </div>
    <div class="welcome-content" :class="{ 'show': showContent, 'magic-effect': showMagicEffect }">
      <div class="logo-container">
        <div class="logo-circle">
          <span class="wand">⚡</span>
        </div>
      </div>
      <h1 class="title">
        MUGGLE CHAT
        <span class="magic-stars">✦ ✦ ✦</span>
      </h1>
      <p class="description">
        为麻瓜带来的魔法对话
      </p>
      <div class="features">
        <div class="feature-item">
          <span class="feature-icon">⚗️</span>
          <span>智能魔法</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🪄</span>
          <span>即刻响应</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔮</span>
          <span>无限可能</span>
        </div>
      </div>
      <el-button class="enter-button" :disabled="showMagicEffect" @click="enterChat">
        ALOHOMORA
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.welcome-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: hidden;
  position: relative;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #fff;
  border-radius: 50%;
  animation: starTwinkle 2s infinite;
}

.star::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: starGlow 2s infinite;
}

.welcome-content {
  text-align: center;
  padding: 4rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 600px;
  width: 90%;
  position: relative;
  z-index: 1;
}

.welcome-content::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.welcome-content.show {
  transform: translateY(0);
  opacity: 1;
}

.welcome-content.magic-effect {
  transform: scale(1.1);
  opacity: 0;
  transition: all 0.8s ease;
}

.logo-container {
  margin-bottom: 2.5rem;
  position: relative;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: transparent;
  border: 2px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.wand {
  font-size: 2rem;
  color: #fff;
  transform: rotate(-45deg);
  animation: wandGlow 2s ease-in-out infinite;
}

.title {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
  font-weight: 800;
  letter-spacing: 4px;
  position: relative;
}

.magic-stars {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 0.8rem;
  letter-spacing: 8px;
  opacity: 0.6;
}

.description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
  letter-spacing: 8px;
  font-family: "Times New Roman", serif;
}

.features {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-bottom: 3rem;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.feature-icon {
  font-size: 1.8rem;
  opacity: 0.9;
}

.feature-item span:last-child {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 2px;
}

.enter-button {
  padding: 12px 48px;
  font-size: 1rem;
  letter-spacing: 4px;
  border-radius: 0;
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.enter-button:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 1);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.enter-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes wandGlow {
  0%, 100% {
    opacity: 0.7;
    transform: rotate(-45deg) scale(1);
  }
  50% {
    opacity: 1;
    transform: rotate(-45deg) scale(1.1);
  }
}

@keyframes starTwinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes starGlow {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0.3;
  }
}

@media (max-width: 640px) {
  .welcome-content {
    padding: 2rem;
  }

  .features {
    flex-direction: column;
    gap: 2rem;
  }

  .title {
    font-size: 1.5rem;
    letter-spacing: 2px;
  }

  .description {
    font-size: 0.9rem;
    letter-spacing: 4px;
  }

  .feature-item span:last-child {
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .magic-stars {
    top: -15px;
    font-size: 0.6rem;
  }
}
</style>
