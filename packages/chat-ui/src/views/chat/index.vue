<script lang="ts" setup>
import { ref } from 'vue'
import Sider from './Sider.vue'
import Header from './Header.vue'
import Footer from './Footer.vue'
import Content from './Content.vue'

const siderCollapsed = ref(false)
</script>

<template>
  <div class="app-container">
    <!-- 侧边栏 -->
    <aside class="app-sider" :class="{ collapsed: siderCollapsed }">
      <Sider v-model="siderCollapsed" />
    </aside>

    <!-- 主内容区 -->
    <main class="app-main">
      <header class="app-header">
        <Header />
      </header>

      <section class="app-content">
        <Content />
      </section>

      <footer class="app-footer">
        <Footer />
      </footer>
    </main>
  </div>
</template>

<style scoped lang="less">
.app-container {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

.app-sider {
  flex-shrink: 0;
  width: 256px;
  border-right: 1px solid #eaeaea;
  transition: all 0.3s;
  background-color: #f7f7f8;
  overflow: hidden;

  &.collapsed {
    width: 0;
    border-right: none;
  }
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  min-width: 0;
  position: relative;
}

.app-header {
  height: 3.5rem;
  border-bottom: 1px solid #eaeaea;
  background-color: #fff;
  flex-shrink: 0;
}

.app-content {
  flex: 1;
  background-color: #fff;
  overflow-y: auto;
  position: relative;

  /* 仅对当前容器的滚动条生效 */
  scrollbar-width: thin; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-color: rgba(0, 0, 0, 0.1) transparent; /* Firefox */

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;

    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
}

.app-footer {
  border-top: 1px solid #eaeaea;
  background-color: #fff;
  flex-shrink: 0;
}

:deep(.ant-layout) {
  background: transparent;
}
</style>
