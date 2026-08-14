<script setup>
import { useToolsStore } from '../data/tools.store'
const store = useToolsStore()

const chips = [
  { key: 'all', label: '全部', color: 'currentColor' },
  { key: 'local', label: '本地前端', color: 'var(--success)' },
  { key: 'ai', label: 'AI 助手', color: 'var(--tertiary)' },
  { key: 'online', label: '在线服务', color: 'var(--warning)' },
]
</script>

<template>
  <nav class="filter-bar">
    <button
      v-for="c in chips"
      :key="c.key"
      class="chip"
      :class="{ active: store.filter === c.key }"
      @click="store.filter = c.key"
    >
      <span class="dot" :style="{ background: c.color }"></span>
      {{ c.label }}
      <span class="count">{{ c.key === 'all' ? store.stats.total : store.stats[c.key] }}</span>
    </button>
    <div class="filter-spacer"></div>
    <div class="result-hint">
      显示 <b>{{ store.results.length }}</b> / <b>{{ store.stats.total }}</b>
    </div>
  </nav>
</template>

<style scoped>
.filter-bar {
  max-width: 1180px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}
.chip {
  height: 36px;
  padding: 0 16px;
  border-radius: var(--radius-chip);
  border: 1px solid var(--outline);
  background: transparent;
  color: var(--on-surface-2);
  font-size: 13px;
  font-family: var(--font);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all .15s;
}
.chip:hover {
  border-color: var(--outline-2);
  color: var(--on-surface);
}
.chip.active {
  background: rgba(138,180,248,.12);
  border-color: var(--primary);
  color: var(--primary);
}
.chip .dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: .7;
}
.chip .count {
  color: var(--on-surface-3);
  font-size: 12px;
  margin-left: 2px;
}
.chip.active .count {
  color: var(--primary);
  opacity: .8;
}
.filter-spacer { flex: 1; }
.result-hint {
  color: var(--on-surface-3);
  font-size: 13px;
}
.result-hint b {
  color: var(--on-surface-2);
  font-weight: 600;
}
</style>
