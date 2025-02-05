<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DeleteOutlined, EditOutlined, MenuFoldOutlined, MenuUnfoldOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { useChatStore } from '../../store/chat'

// 侧边栏展开/收起状态，由父组件控制
const collapsed = defineModel<boolean>()

// 初始化聊天状态管理
const chatStore = useChatStore()

// 当前选中的会话ID，用于菜单高亮显示
const selectedKeys = computed(() => [chatStore.currentSessionId])

// 会话列表数据，按最新更新时间排序
const sessionList = computed(() => chatStore.sessionList)

/**
 * 新建会话
 * 调用 store 的 createSession 方法创建新会话，并自动切换到新会话
 */
function handleNewChat() {
  chatStore.createSession()
}

/**
 * 切换会话
 * @param sessionId 目标会话的ID
 */
function handleSelectSession(sessionId: string) {
  chatStore.switchSession(sessionId)
}

/**
 * 删除会话
 * 弹出确认对话框，确认后删除会话
 * @param e 事件对象
 * @param sessionId 要删除的会话ID
 */
function handleDeleteSession(e: Event, sessionId: string) {
  e.stopPropagation() // 阻止事件冒泡，防止触发会话选中
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个会话吗？此操作不可恢复。',
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      chatStore.deleteSession(sessionId)
      message.success('删除成功')
    },
  })
}

// 会话标题编辑状态管理
const editingSessionId = ref<string | null>(null) // 当前正在编辑的会话ID
const editingTitle = ref('') // 编辑中的标题内容

/**
 * 开始编辑会话标题
 * @param e 事件对象
 * @param sessionId 要编辑的会话ID
 * @param currentTitle 当前标题
 */
function startEdit(e: Event, sessionId: string, currentTitle: string) {
  e.stopPropagation() // 阻止事件冒泡，防止触发会话选中
  editingSessionId.value = sessionId
  editingTitle.value = currentTitle
}

/**
 * 处理标题编辑完成
 * @param sessionId 会话ID
 * @param isEnterKey 是否通过回车键触发
 */
function handleEditTitle(sessionId: string, isEnterKey = false) {
  // 如果是通过回车键触发，则不需要处理blur事件
  if (!editingSessionId.value || (isEnterKey && sessionId !== editingSessionId.value))
    return

  if (editingTitle.value.trim()) {
    chatStore.updateSessionTitle(sessionId, editingTitle.value)
    editingSessionId.value = null
    message.success('修改成功')
  }
}

/**
 * 切换侧边栏展开/收起状态
 */
function toggleCollapse() {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <div class="chat-sider">
    <!-- 新建对话按钮 -->
    <div class="sider-header">
      <AButton
        type="primary"
        class="new-chat-btn"
        @click="handleNewChat"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        <span v-if="!collapsed">新建对话</span>
      </AButton>
    </div>

    <!-- 会话列表 -->
    <div class="chat-list">
      <a-menu
        v-model:selected-keys="selectedKeys"
        :inline-collapsed="collapsed"
        class="chat-menu"
        @select="({ key }) => handleSelectSession(key as string)"
      >
        <!-- 会话项 -->
        <a-menu-item
          v-for="session in sessionList"
          :key="session.id"
          class="chat-menu-item"
        >
          <div class="chat-item-content">
            <!-- 编辑状态 -->
            <template v-if="editingSessionId === session.id">
              <a-input
                v-model:value="editingTitle"
                size="small"
                class="edit-title"
                autofocus
                @press-enter="handleEditTitle(session.id, true)"
                @blur="handleEditTitle(session.id)"
                @click.stop
              />
            </template>
            <!-- 显示状态 -->
            <template v-else>
              <span class="chat-title">{{ session.title }}</span>
              <div class="chat-actions">
                <EditOutlined class="action-icon" @click.stop="(e) => startEdit(e, session.id, session.title)" />
                <DeleteOutlined class="action-icon" @click.stop="(e) => handleDeleteSession(e, session.id)" />
              </div>
            </template>
          </div>
        </a-menu-item>
      </a-menu>
    </div>

    <!-- 底部折叠按钮 -->
    <div class="sider-footer">
      <AButton type="text" class="collapse-btn" @click="toggleCollapse">
        <MenuFoldOutlined v-if="!collapsed" />
        <MenuUnfoldOutlined v-else />
      </AButton>
    </div>

    <!-- 固定的展开按钮（收起状态显示） -->
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

    .chat-menu-item {
      border-radius: 0.375rem;
      margin: 0.25rem 0;
      padding: 8px 12px !important;
      height: auto !important;
      line-height: 1.5;

      .chat-actions {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
      }

      &:hover {
        background-color: #f5f5f5;

        .chat-actions {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
      }

      &.ant-menu-item-selected {
        background-color: #f0f0f0;
        color: #000;

        &:hover .chat-actions {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
      }
    }
  }

  .chat-item-content {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    position: relative;

    .chat-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      padding-right: 50px;
    }

    .chat-actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 4px;
      transition: all 0.2s ease;
      background-color: inherit;
      padding: 0 4px;
      border-radius: 4px;

      .action-icon {
        font-size: 14px;
        padding: 4px;
        color: #666;
        cursor: pointer;
        border-radius: 4px;
        transition: all 0.2s ease;

        &:hover {
          color: #000;
          background-color: rgba(0, 0, 0, 0.06);
        }
      }
    }

    .edit-title {
      flex: 1;
      font-size: 14px;

      :deep(.ant-input) {
        padding: 4px 8px;
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
