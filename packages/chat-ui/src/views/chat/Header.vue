<script lang="ts" setup>
import { ref } from 'vue'
import { UserOutlined } from '@ant-design/icons-vue'
import ApiKeySettings from '../../components/settings/ApiKeySettings.vue'
import { InlineChatDialog } from '../../components/inline-chat'

const showSettings = ref(false)
const showInlineChat = ref(false)

function openSettings() {
  showSettings.value = true
}

function closeSettings() {
  showSettings.value = false
}
</script>

<template>
  <div class="chat-header">
    <!-- logo -->
    <h1 class="logo">
      Muggle Chat
    </h1>

    <!-- 右侧操作区 -->
    <div class="right-actions">
      <!-- 内联对话框 -->
      <div class="inline-chat">
        <Button
          class="inline-chat-btn"
          @click="() => showInlineChat = true"
        >
          <!-- <MessageOutlined /> -->
          <span>切换内联模式</span>
        </Button>

        <!-- 内联模式背景板 -->
        <div v-if="showInlineChat" class="inline-chat-wrapper">
          <div class="inline-chat-background">
            <InlineChatDialog
              inline
              @close="showInlineChat = false"
            />
          </div>
        </div>
      </div>

      <!-- 个人中心 -->
      <a-dropdown placement="bottomRight">
        <!-- 头像 -->
        <div class="avatar-wrapper">
          <a-avatar class="avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </div>
        <!-- 下拉框 -->
        <template #overlay>
          <a-menu class="user-menu">
            <a-menu-item key="settings" @click="openSettings">
              设置
            </a-menu-item>
            <a-menu-item key="logout">
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>

    <!-- 设置对话框 -->
    <a-modal
      v-model:visible="showSettings"
      title="设置"
      :footer="null"
      width="500px"
      @cancel="closeSettings"
    >
      <ApiKeySettings />
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.chat-header {
  height: 100%;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .logo {
    color: #000;
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .inline-chat {
    position: relative;
    display: flex;
    align-items: center;
  }

  .avatar-wrapper {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 9999px;
    transition: all 0.2s;

    &:hover {
      background-color: #fafafa;
    }
  }

  .avatar {
    background-color: #000;
    color: #fff;
  }
}

:deep(.user-menu) {
  min-width: 120px;
  border: 1px solid #eaeaea;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);

  .ant-dropdown-menu-item {
    padding: 0.5rem 1rem;

    &:hover {
      background-color: #fafafa;
      color: #000;
    }
  }
}

.inline-chat-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
}

.inline-chat-background {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.95));
}

.inline-chat-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  border: none;
  border-radius: 8px;
  color: #fff;
  background: #000;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background-color: #333;
  }

  .anticon {
    font-size: 16px;
  }
}
</style>
