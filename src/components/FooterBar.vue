<script setup>
// 数据来自构建期生成的 index.json
</script>

<template>
  <footer class="footer">
    <span>Hutch · 器舍 · 一个顺手就打开的个人工具箱</span>
    <span>数据来自 <code>index.json</code>（构建期从 <code>tools/*.md</code> 生成）</span>
  </footer>
</template>

<style scoped>
.footer {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px;
  border-top: 1px solid var(--outline);
  color: var(--on-surface-3);
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.footer code {
  font-family: var(--mono);
}
@media (max-width: 720px) {
  .footer { padding: 16px; }
}
</style>
