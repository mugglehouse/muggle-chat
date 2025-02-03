<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div class="chat-header">
    <h1 class="logo">
      Muggle Chat
    </h1>
    <div class="actions">
      <a-dropdown placement="bottomRight">
        <div class="avatar-wrapper">
          <a-avatar class="avatar">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </div>
        <template #overlay>
          <a-menu class="user-menu">
            <a-menu-item key="settings">
              设置
            </a-menu-item>
            <a-menu-item key="logout">
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
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

  .actions {
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
</style>
