<script lang="ts" setup>
import { ref } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined, MessageOutlined, PlusOutlined } from '@ant-design/icons-vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const selectedKeys = ref<string[]>(['1'])
const chatList = ref([
  { id: '1', title: '关于Vue3的讨论' },
  { id: '2', title: 'TypeScript学习笔记' },
  { id: '3', title: '项目架构设计' },
])

function handleNewChat() {
  // 处理新建对话逻辑
}

function toggleCollapse() {
  emit('update:collapsed', !props.collapsed)
}
</script>

<template>
  <div class="chat-sider">
    <div class="sider-header">
      <a-button
        type="primary"
        class="new-chat-btn"
        @click="handleNewChat"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        <span v-if="!collapsed">新建对话</span>
      </a-button>
    </div>

    <!-- 对话列表 -->
    <div class="chat-list">
      <a-menu
        v-model:selected-keys="selectedKeys"
        :inline-collapsed="collapsed"
        class="chat-menu"
      >
        <a-menu-item v-for="chat in chatList" :key="chat.id">
          <template #icon>
            <MessageOutlined />
          </template>
          <span>{{ chat.title }}</span>
        </a-menu-item>
      </a-menu>
    </div>

    <!-- 底部折叠按钮 -->
    <div class="sider-footer">
      <a-button type="text" class="collapse-btn" @click="toggleCollapse">
        <MenuFoldOutlined v-if="!collapsed" />
        <MenuUnfoldOutlined v-else />
      </a-button>
    </div>

    <!-- 固定的展开按钮 -->
    <div v-if="collapsed" class="expand-btn" @click="toggleCollapse">
      <MenuUnfoldOutlined />
    </div>
  </div>
</template>

<style scoped lang="less">
.chat-sider {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  position: relative;

  .sider-header {
    padding: 1rem;
    border-bottom: 1px solid #eaeaea;
  }

  .new-chat-btn {
    width: 100%;
    background-color: #000;
    border-color: #000;

    &:hover {
      background-color: #333;
      border-color: #333;
    }
  }

  .chat-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
  }

  :deep(.chat-menu) {
    border-inline-end: none !important;

    .ant-menu-item {
      border-radius: 0.375rem;
      margin: 0.25rem 0;

      &:hover {
        background-color: #fafafa;
      }

      &.ant-menu-item-selected {
        background-color: #fafafa;
        color: #000;
      }
    }
  }

  .sider-footer {
    padding: 0.75rem;
    border-top: 1px solid #eaeaea;
    display: flex;
    justify-content: center;

    .collapse-btn {
      color: #666;

      &:hover {
        color: #000;
        background-color: #fafafa;
      }
    }
  }

  .expand-btn {
    position: fixed;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 24px;
    height: 48px;
    background-color: #fff;
    border: 1px solid #eaeaea;
    border-left: none;
    border-radius: 0 6px 6px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
    z-index: 100;

    &:hover {
      color: #000;
      background-color: #fafafa;
    }
  }
}
</style>
