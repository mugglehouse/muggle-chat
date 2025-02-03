<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

interface Props {
  content: string
  inline?: boolean
}

const props = defineProps<Props>()

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: false, // 禁用 HTML 标签
  breaks: true, // 转换换行符为 <br>
  linkify: true, // 自动转换 URL 为链接
  highlight: (str: string, lang: string) => {
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

// 计算渲染后的内容
const renderedContent = computed(() => {
  if (!props.content)
    return ''
  return props.inline
    ? md.renderInline(props.content)
    : md.render(props.content)
})

// 复制代码块
function setupCodeCopy() {
  const preElements = document.querySelectorAll('pre')
  preElements.forEach((pre) => {
    // 添加复制按钮
    const copyButton = document.createElement('button')
    copyButton.className = 'copy-button'
    copyButton.textContent = '复制'
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
    pre.appendChild(copyButton)
  })
}

onMounted(() => {
  if (!props.inline)
    setupCodeCopy()
})
</script>

<template>
  <div
    class="markdown-content"
    :class="{ inline }"
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

  &.inline {
    display: inline;

    :deep(p) {
      display: inline;
      margin: 0;
    }
  }
}
</style>
