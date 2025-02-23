<script setup lang="ts">
import { ref } from 'vue'
import { Button, Input } from 'ant-design-vue'
import { SendOutlined } from '@ant-design/icons-vue'

interface Props {
  placeholder?: string
  inline?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  expand: []
  submit: [content: string]
}>()

const inputValue = ref('')

function handleSubmit() {
  const content = inputValue.value.trim()
  if (content) {
    emit('submit', content)
    inputValue.value = ''
  }
}

function handleFocus() {
  emit('expand')
}
</script>

<template>
  <div class="inline-chat-input" :class="{ inline }">
    <Input
      v-model:value="inputValue"
      :placeholder="placeholder"
      class="input"
      @focus="handleFocus"
      @press-enter="handleSubmit"
    >
      <template #suffix>
        <Button
          type="text"
          class="submit-btn"
          :disabled="!inputValue.trim()"
          @click="handleSubmit"
        >
          <SendOutlined />
        </Button>
      </template>
    </Input>
  </div>
</template>

<style lang="scss" scoped>
.inline-chat-input {
  width: 300px;

  &.inline {
    width: 240px;

    .input {
      border-radius: 6px;
      box-shadow: none;
      border-color: #eaeaea;

      &:hover, :deep(.ant-input:focus) {
        border-color: #000;
      }
    }
  }

  .input {
    border-radius: 20px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    :deep(.ant-input) {
      background: transparent;
      padding-right: 40px;

      &:focus {
        box-shadow: none;
      }
    }
  }

  .submit-btn {
    color: #1890ff;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;

    &:disabled {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
