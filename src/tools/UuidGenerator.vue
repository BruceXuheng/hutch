<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

const { show } = useToast()

const count = ref(5)
const uppercase = ref(false)
const hyphens = ref(true)
const list = ref([])

// crypto.randomUUID() 生成 v4，原生无依赖
function genOne() {
  const id = crypto.randomUUID()              // xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  let out = hyphens.value ? id : id.replace(/-/g, '')
  return uppercase.value ? out.toUpperCase() : out
}

function generate() {
  const n = Math.min(Math.max(count.value || 1, 1), 500)
  list.value = Array.from({ length: n }, genOne)
  show(`已生成 ${n} 个`)
}

const joined = computed(() => list.value.join('\n'))

async function copyAll() {
  if (!list.value.length) return
  try { await navigator.clipboard.writeText(joined.value); show('已全部复制') } catch { show('复制失败') }
}

async function copyOne(v) {
  try { await navigator.clipboard.writeText(v); show('已复制') } catch { show('复制失败') }
}

generate()
</script>

<template>
  <section class="tool">
    <div class="opts">
      <label class="opt">数量
        <input v-model.number="count" type="number" min="1" max="500" @change="generate">
      </label>
      <label class="check">
        <input v-model="hyphens" type="checkbox" @change="generate"> 含连字符
      </label>
      <label class="check">
        <input v-model="uppercase" type="checkbox" @change="generate"> 大写
      </label>
      <div class="spacer"></div>
      <button class="btn primary" @click="generate">生成</button>
      <button class="btn" :disabled="!list.length" @click="copyAll">复制全部</button>
    </div>

    <ul class="list">
      <li v-for="(v, i) in list" :key="i">
        <span class="idx">{{ i + 1 }}</span>
        <code>{{ v }}</code>
        <button class="link" @click="copyOne(v)">复制</button>
      </li>
      <li v-if="!list.length" class="empty">点击"生成"开始</li>
    </ul>
  </section>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; gap: 16px; }
.opts { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.opt { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--on-surface-3); }
.opt input[type=number] {
  width: 88px; height: 36px; padding: 0 8px;
  border: 1px solid var(--outline); border-radius: 8px;
  background: var(--bg); color: var(--on-surface); font-family: var(--mono); font-size: 13px; outline: none;
}
.opt input:focus { border-color: var(--primary); }
.check { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--on-surface-2); cursor: pointer; }
.check input { accent-color: var(--primary); width: 16px; height: 16px; }
.spacer { flex: 1; }
.btn {
  height: 36px; padding: 0 16px; border-radius: var(--radius-chip);
  border: 1px solid var(--outline-2); background: var(--surface-2);
  color: var(--on-surface); font-size: 13px; font-family: var(--font); cursor: pointer; transition: all .15s;
}
.btn:hover:not(:disabled) { border-color: var(--primary); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn.primary { background: var(--primary-14); border-color: var(--primary); color: var(--primary); }
.list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.list li {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; border: 1px solid var(--outline); border-radius: 10px;
  background: var(--surface);
}
.idx { color: var(--on-surface-3); font-size: 11px; font-family: var(--mono); min-width: 28px; }
.list code {
  flex: 1; font-family: var(--mono); font-size: 13px; color: var(--on-surface);
  word-break: break-all;
}
.link { background: none; border: none; color: var(--primary); font-size: 12px; cursor: pointer; font-family: var(--font); }
.empty { color: var(--on-surface-3); font-size: 13px; justify-content: center; }
</style>
