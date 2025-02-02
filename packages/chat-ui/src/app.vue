<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
</script>

<template>
  <NConfigProvider
    class="h-full"
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="language"
  >
    <NaiveProvider>
      <!-- <RouterView /> -->
      <div>111</div>
    </NaiveProvider>
  </NConfigProvider>
</template>

<style scoped>

</style>
