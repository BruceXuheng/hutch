<script setup>
defineEmits(['clear'])
</script>

<template>
  <div class="empty">
    <div class="empty-icon">∅</div>
    <h3>没有找到匹配的工具</h3>
    <p>试试换个关键词，或清除筛选条件。</p>
    <button @click="$emit('clear')">清除筛选</button>
  </div>
</template>

<style scoped>
.empty {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 24px;
  color: var(--on-surface-3);
}
.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--outline);
  display: grid;
  place-items: center;
  color: var(--on-surface-3);
  font-size: 28px;
  font-family: var(--mono);
}
.empty h3 {
  color: var(--on-surface-2);
  font-size: 16px;
  margin-bottom: 6px;
}
.empty p {
  font-size: 13px;
  margin-bottom: 16px;
}
.empty button {
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  border: 1px solid var(--outline-2);
  background: var(--surface);
  color: var(--on-surface);
  font-size: 13px;
  cursor: pointer;
  font-family: var(--font);
  transition: background .15s;
}
.empty button:hover {
  background: var(--surface-2);
}
</style>
