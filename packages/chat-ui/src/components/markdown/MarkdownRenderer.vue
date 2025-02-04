<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

interface Props {
  content: string
}

const props = defineProps<Props>()

// 1. 创建 markdown-it 实例
const md = new MarkdownIt({
  html: false, // 禁用 HTML 标签
  breaks: true, // 转换换行符为 <br>
  linkify: true, // 自动转换 URL 为链接
  // 当md中出现代码块时(str为代码块内容，lang为代码块语言)，使用highlight函数进行高亮
  highlight: (str: string, lang: string) => {
    // 如果lang存在且hljs支持该语言，则使用hljs进行高亮
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      }
      catch (e) {
        console.error(e)
      }
    }
    return '' // 使用默认的转义
  },
})

// 2. 计算渲染后的内容
const renderedContent = computed(() => {
  if (!props.content)
    return ''
  return md.render(props.content)
})

// 3. 复制代码块
function setupCodeCopy() {
  // pre为HTML元素，用于预格式化文本，markdown-it会将代码块内容使用pre包裹，并将代码块转化为HTML结构显示
  // <pre>
  //   <code>
  //       代码块
  //   </code>
  // </pre>
  const preElements = document.querySelectorAll('pre')
  // 为每一个pre元素添加复制按钮（每一个代码块）
  preElements.forEach((pre) => {
    // 添加复制按钮
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.textContent = '复制'
    pre.appendChild(copyButton)
    // 添加点击事件
    copyButton.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.textContent || ''
      try {
        await navigator.clipboard.writeText(code)
        copyButton.textContent = '已复制!'
        setTimeout(() => {
          copyButton.textContent = '复制'
        }, 2000)
      }
      catch (err) {
        console.error('复制失败:', err)
        copyButton.textContent = '复制失败'
      }
    })
  })
}

// 4. 监听内容变化，在内容更新后重新设置复制按钮
watch(renderedContent, () => {
  // 使用 nextTick 确保 DOM 已更新
  nextTick(() => {
    setupCodeCopy()
  })
}, { immediate: true })
</script>

<template>
  <!-- v-html将HTML字符串解析为原生HTML -->
  <div
    class="markdown-content"
    v-html="renderedContent"
  />
</template>

<style lang="scss" scoped>
.markdown-content {
  line-height: 1.6;

  :deep(p) {
    margin: 0.5em 0;
  }

  :deep(pre) {
    position: relative;
    margin: 1em 0;
    padding: 1em;
    background-color: #f6f8fa;
    border-radius: 6px;
    overflow-x: auto;

    code {
      padding: 0;
      background: none;
    }

    .copy-button {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      padding: 0.25em 0.5em;
      font-size: 0.85em;
      color: #666;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;

      &:hover {
        color: #333;
        border-color: #999;
      }
    }

    &:hover .copy-button {
      opacity: 1;
    }
  }

  :deep(code) {
    padding: 0.2em 0.4em;
    font-size: 0.85em;
    background-color: #f6f8fa;
    border-radius: 3px;
  }

  :deep(a) {
    color: #0366d6;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;

    th, td {
      padding: 0.5em;
      border: 1px solid #ddd;
    }

    th {
      background-color: #f6f8fa;
    }
  }
}
</style>
