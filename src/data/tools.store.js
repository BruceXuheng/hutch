import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { search } from '../composables/useSearch'

// 构建单工具的检索 haystack（运行时算一次，上百工具只算一遍）
function buildHay(t) {
  return [t.name, t.nameEn, t.pinyin, t.abbr, ...t.tags, ...t.keywords, t.content]
    .join(' ').toLowerCase()
}

export const useToolsStore = defineStore('tools', () => {
  const all = ref([])
  const query = ref('')
  const filter = ref('all')   // all | local | ai | online
  const loaded = ref(false)
  const error = ref(null)

  // 分类计数
  const stats = computed(() => {
    const s = { total: all.value.length, local: 0, ai: 0, online: 0 }
    all.value.forEach(t => { if (s[t.runtime] !== undefined) s[t.runtime]++ })
    return s
  })

  // 过滤 + 检索 + 排序
  const results = computed(() => {
    let list = all.value
    if (filter.value !== 'all') list = list.filter(t => t.runtime === filter.value)
    return search(list, query.value)
  })

  async function load() {
    if (loaded.value) return
    try {
      const base = import.meta.env.BASE_URL
      const res = await fetch(`${base}index.json`)
      const data = await res.json()
      data.forEach(t => { t.hay = buildHay(t) })
      all.value = data
      loaded.value = true
    } catch (e) {
      error.value = e.message
      console.error('[tools.store] 加载 index.json 失败', e)
    }
  }

  function clearAll() {
    query.value = ''
    filter.value = 'all'
  }

  return { all, query, filter, loaded, error, stats, results, load, clearAll }
})
