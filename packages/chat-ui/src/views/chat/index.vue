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
  background-color: #fff;
  overflow: hidden; // 防止出现双滚动条
}

.app-sider {
  flex-shrink: 0;
  width: 256px;
  border-right: 1px solid #eaeaea;
  transition: all 0.3s;
  overflow: hidden;
  position: relative;

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
  min-width: 0; // 防止flex子项溢出
  position: relative; // 为sticky定位提供参考
}

.app-header {
  height: 3.5rem;
  border-bottom: 1px solid #eaeaea;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.app-content {
  flex: 1;
  overflow-y: auto;
  background-color: #fafafa;
  -ms-overflow-style: none; // IE和Edge
  scrollbar-width: none; // Firefox

  &::-webkit-scrollbar {
    display: none; // Chrome和Safari
  }
}

.app-footer {
  border-top: 1px solid #eaeaea;
  background-color: #fff;
  position: sticky;
  bottom: 0;
  z-index: 10;
}

:deep(.ant-layout) {
  background: transparent;
}
</style>
