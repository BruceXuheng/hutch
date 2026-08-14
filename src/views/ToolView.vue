<script setup>
import { computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToolsStore } from '../data/tools.store'
import { useToast } from '../composables/useToast'
import { openExternal } from '../utils/externalLinks'

const route = useRoute()
const router = useRouter()
const store = useToolsStore()
const { show } = useToast()

// 确保索引已加载（直接访问 URL 时不经过 HomeView）
onMounted(() => store.load())

const tool = computed(() => store.all.find(t => t.id === route.params.id))

// 懒加载 src/tools/*.vue（Vite 静态分析，按需分 chunk）
const toolModules = import.meta.glob('../tools/*.vue')

const AsyncComp = computed(() => {
  const t = tool.value
  if (!t || t.runtime !== 'local' || !t.component) return null
  const key = Object.keys(toolModules).find(k => k.endsWith('/' + t.component + '.vue'))
  return key ? defineAsyncComponent(toolModules[key]) : null
})

// 兜底：直接访问 URL 时的 online/soon 处理（索引加载后触发）
watch(tool, (t) => {
  if (!t) return
  if (t.status === 'soon') {
    show(`「${t.name}」即将上线，敬请期待`)
    router.push('/')
    return
  }
  if (t.runtime === 'online' && t.url) {
    openExternal(t.url)
    router.push('/')
    return
  }
}, { immediate: true })

function back() {
  router.push('/')
}
</script>

<template>
  <main v-if="tool" class="tool-view">
    <a class="back" href="/" @click.prevent="back">← 返回首页</a>
    <header class="tool-head">
      <h1>{{ tool.name }}</h1>
      <p v-if="tool.desc">{{ tool.desc }}</p>
    </header>
    <component v-if="AsyncComp" :is="AsyncComp" />
    <p v-else class="tool-empty">该工具暂未实现交互页面，仅作为说明占位。</p>
  </main>
  <main v-else class="tool-view">
    <p v-if="store.loaded" class="tool-empty">工具未找到，<a href="/" @click.prevent="back">返回首页</a>。</p>
    <p v-else class="tool-empty">加载中…</p>
  </main>
</template>

<style scoped>
.tool-view {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 24px 64px;
  position: relative;
  z-index: 1;
}
.back {
  display: inline-block;
  color: var(--on-surface-3);
  font-size: 13px;
  margin-bottom: 16px;
  text-decoration: none;
}
.back:hover { color: var(--primary); }
.tool-head {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--outline);
}
.tool-head h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
}
.tool-head p {
  color: var(--on-surface-2);
  font-size: 14px;
}
.tool-empty {
  color: var(--on-surface-3);
  font-size: 14px;
  padding: 48px 0;
  text-align: center;
}
</style>
