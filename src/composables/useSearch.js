// 检索纯函数：输入工具数组 + query → 相关度排序后数组
// 规则：indexOf 包含匹配（无错别字容错）；多词 AND；name +100 / tags+keywords +50 / pinyin+abbr +40 / content +10

export function search(tools, query) {
  const q = (query || '').trim().toLowerCase().replace(/\s+/g, ' ')
  if (!q) {
    // 空查询：按 pinned 降序 + order 升序
    return [...tools].sort((a, b) => (b.pinned - a.pinned) || (a.order - b.order))
  }
  const terms = q.split(' ')
  return tools
    .filter(t => terms.every(term => t.hay.indexOf(term) !== -1))
    .map(t => {
      let s = 0
      if (t.name.toLowerCase().includes(q)) s += 100
      if ([...t.tags, ...t.keywords].join(' ').toLowerCase().includes(q)) s += 50
      if (t.pinyin.includes(q) || t.abbr.toLowerCase().includes(q)) s += 40
      if (t.content.toLowerCase().includes(q)) s += 10
      return { t, s }
    })
    .sort((a, b) => b.s - a.s || (b.t.pinned - a.t.pinned) || (a.t.order - b.t.order))
    .map(x => x.t)
}
