<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolsStore } from '../data/tools.store'
import { useToast } from '../composables/useToast'
import FilterChips from '../components/FilterChips.vue'
import ToolGrid from '../components/ToolGrid.vue'

const store = useToolsStore()
const router = useRouter()
const { show } = useToast()

onMounted(() => store.load())

// 卡片点击：soon 提示 / online 新标签 / local·ai 进 SPA 工具页
function onSelect(tool) {
  if (tool.status === 'soon') {
    show(`「${tool.name}」即将上线，敬请期待`)
    return
  }
  if (tool.runtime === 'online' && tool.url) {
    window.open(tool.url, '_blank', 'noopener,noreferrer')
    return
  }
  router.push(`/tool/${tool.id}`)
}
</script>

<template>
  <section class="hero">
    <h1>一个<span class="accent">顺手</span>的个人工具箱</h1>
    <p>本地前端工具、联网 AI 助手、精选在线服务，统一入口。关键词 + 正文中英文检索，即搜即用。</p>
    <div class="stats">
      <span><b>{{ store.stats.total }}</b> 个工具</span>
      <span><b>{{ store.stats.local }}</b> 本地</span>
      <span><b>{{ store.stats.ai }}</b> AI</span>
      <span><b>{{ store.stats.online }}</b> 在线</span>
    </div>
  </section>

  <FilterChips />
  <ToolGrid @select="onSelect" />
</template>

<style scoped>
.hero {
  max-width: 1180px;
  margin: 0 auto;
  padding: 72px 24px 16px;
  position: relative;
  z-index: 1;
}
.hero h1 {
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -.8px;
  margin-bottom: 12px;
}
.hero h1 .accent { color: var(--primary); }
.hero p {
  color: var(--on-surface-2);
  font-size: 16px;
  max-width: 580px;
  line-height: 1.6;
}
.hero .stats {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  color: var(--on-surface-3);
  font-size: 13px;
}
.hero .stats b {
  color: var(--on-surface);
  font-weight: 600;
}
@media (max-width: 720px) {
  .hero { padding: 40px 16px 8px; }
  .hero h1 { font-size: 28px; letter-spacing: -.4px; }
}
</style>
