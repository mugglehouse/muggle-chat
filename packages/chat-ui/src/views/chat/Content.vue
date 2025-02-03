<script lang="ts" setup>
import { ref } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  avatar: string
}

const messages = ref<Message[]>([
  {
    id: '1',
    role: 'user',
    content: '你好，我想了解一下Vue3的组合式API',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
  },
  {
    id: '2',
    role: 'assistant',
    content: '组合式 API (Composition API) 是 Vue 3 中一个重要的新特性。它提供了一种更灵活的方式来组织组件的逻辑。主要优势包括更好的代码组织、逻辑复用、更好的类型推导等。',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=assistant',
  },
])
</script>

<template>
  <div class="chat-content">
    <div
      v-for="message in messages"
      :key="message.id"
      class="message-wrapper"
      :class="{ 'message-user': message.role === 'user' }"
    >
      <div class="message-container">
        <!-- 头像 -->
        <div class="avatar-wrapper">
          <img
            :src="message.avatar"
            :alt="message.role"
            class="avatar"
          >
        </div>

        <!-- 消息内容 -->
        <div class="message-box" :class="[message.role]">
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-content {
  min-height: 100%;
  padding: 2rem;
  max-width: 48rem;
  margin: 0 auto;

  .message-wrapper {
    display: flex;
    margin-bottom: 2rem;
    justify-content: flex-start;

    &.message-user {
      justify-content: flex-end;

      .message-container {
        flex-direction: row-reverse;
      }
    }
  }

  .message-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    max-width: 85%;
  }

  .avatar-wrapper {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .message-box {
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &.user {
      background-color: #000;
      border-color: #000;
      .message-content {
        color: #fff;
      }
    }

    &.assistant {
      background-color: #fff;
      .message-content {
        color: #000;
      }
    }
  }

  .message-content {
    font-size: 0.9375rem;
    line-height: 1.5;
  }
}
</style>
