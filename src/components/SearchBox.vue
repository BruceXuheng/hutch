<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const query = defineModel({ default: '' })
const inputRef = ref(null)

function onKeydown(e) {
  // ⌘K / Ctrl+K 聚焦搜索
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    inputRef.value?.focus()
    inputRef.value?.select()
  }
}
function onInputKeydown(e) {
  // Esc 清空
  if (e.key === 'Escape') {
    query.value = ''
    inputRef.value?.blur()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="search">
    <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
    <input
      ref="inputRef"
      v-model="query"
      class="search-input"
      type="text"
      placeholder="搜索工具名、关键词、拼音首字母…"
      autocomplete="off"
      @keydown="onInputKeydown"
    />
    <span class="search-kbd">⌘K</span>
  </div>
</template>

<style scoped>
.search {
  flex: 1;
  max-width: 560px;
  position: relative;
}
.search-input {
  width: 100%;
  height: 44px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--outline);
  background: var(--surface);
  color: var(--on-surface);
  padding: 0 48px 0 48px;
  font-size: 15px;
  font-family: var(--font);
  outline: none;
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.search-input::placeholder { color: var(--on-surface-3); }
.search-input:focus {
  border-color: var(--primary);
  background: var(--surface-2);
  box-shadow: 0 0 0 4px rgba(138,180,248,.12);
}
.search-icon {
  position: absolute;
  left: 16px; top: 50%;
  transform: translateY(-50%);
  color: var(--on-surface-3);
  pointer-events: none;
}
.search-kbd {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  font-family: var(--mono);
  font-size: 11px;
  color: var(--on-surface-3);
  border: 1px solid var(--outline);
  border-radius: 6px;
  padding: 2px 6px;
  background: var(--bg);
}
</style>
