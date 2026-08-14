<script setup>
// M1 占位：验证路由 + 动态组件加载
// 实际功能（格式化/校验/压缩）在 M3 内容填充阶段实现
</script>

<template>
  <section class="placeholder">
    <div class="ph-icon">{ }</div>
    <h3>JSON 格式化</h3>
    <p>该工具组件已通过路由动态加载（M1 骨架验证通过）。</p>
    <p class="hint">格式化、压缩、校验、路径提取等实际功能将在 M3 实现。</p>
  </section>
</template>

<style scoped>
.placeholder {
  padding: 48px 24px;
  text-align: center;
  color: var(--on-surface-2);
  border: 1px dashed var(--outline);
  border-radius: var(--radius-card);
  background: var(--surface);
}
.ph-icon {
  width: 56px; height: 56px;
  margin: 0 auto 16px;
  border-radius: 14px;
  background: var(--surface-3);
  border: 1px solid var(--outline);
  display: grid; place-items: center;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 22px;
  color: var(--primary);
}
.placeholder h3 {
  font-size: 16px;
  color: var(--on-surface);
  margin-bottom: 8px;
}
.placeholder p {
  font-size: 13px;
  margin-bottom: 4px;
}
.placeholder .hint {
  color: var(--on-surface-3);
}
</style>
