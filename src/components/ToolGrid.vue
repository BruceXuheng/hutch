<script setup>
import { useToolsStore } from '../data/tools.store'
import ToolCard from './ToolCard.vue'
import EmptyState from './EmptyState.vue'

const store = useToolsStore()
defineEmits(['select'])  // 透传卡片点击
</script>

<template>
  <main class="grid">
    <ToolCard
      v-for="t in store.results"
      :key="t.id"
      :tool="t"
      @click="$emit('select', $event)"
    />
    <EmptyState
      v-if="store.results.length === 0"
      @clear="store.clearAll()"
    />
  </main>
</template>

<style scoped>
.grid {
  max-width: 1180px;
  margin: 0 auto;
  padding: 8px 24px 64px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  position: relative;
  z-index: 1;
}
@media (max-width: 720px) {
  .grid {
    padding: 8px 16px 48px;
    grid-template-columns: 1fr;
  }
}
</style>
