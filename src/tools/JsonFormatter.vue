<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

const { show } = useToast()

const input = ref('{\n  "name": "hutch",\n  "tags": ["tool", "box"],\n  "meta": { "ver": 1 }\n}')
const output = ref('')
const path = ref('')
const errorMsg = ref('')

// 校验 + 错误行号提取
function parse() {
  errorMsg.value = ''
  try {
    return JSON.parse(input.value)
  } catch (e) {
    // 提取错误位置（V8: position N）
    const m = e.message.match(/position (\d+)/i)
    if (m) {
      const pos = +m[1]
      const before = input.value.slice(0, pos)
      const line = before.split('\n').length
      const col = pos - before.lastIndexOf('\n')
      errorMsg.value = `${e.message}（第 ${line} 行，第 ${col} 列）`
    } else {
      errorMsg.value = e.message
    }
    return null
  }
}

function format() {
  const data = parse()
  if (data === null) return
  output.value = JSON.stringify(data, null, 2)
  show('已格式化')
}

function minify() {
  const data = parse()
  if (data === null) return
  output.value = JSON.stringify(data)
  show('已压缩')
}

function validate() {
  const data = parse()
  if (data === null) {
    show('校验失败，见错误提示')
  } else {
    output.value = '✓ 有效 JSON'
    show('校验通过')
  }
}

function clearAll() {
  input.value = ''
  output.value = ''
  errorMsg.value = ''
  path.value = ''
}

// JSONPath 简化：点号路径 a.b.0.c → 取值
const pathValue = computed(() => {
  if (!path.value.trim()) return ''
  const data = parse()
  if (data === null) return '⚠ 输入非有效 JSON'
  const keys = path.value.split('.').filter(Boolean)
  let cur = data
  for (const k of keys) {
    if (cur == null) return '⚠ 路径不存在'
    cur = cur[k]
  }
  return cur === undefined ? '⚠ 路径不存在' : (typeof cur === 'object' ? JSON.stringify(cur, null, 2) : String(cur))
})

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    show('已复制')
  } catch {
    show('复制失败')
  }
}
</script>

<template>
  <section class="tool">
    <div class="row">
      <button class="btn primary" @click="format">格式化</button>
      <button class="btn" @click="minify">压缩</button>
      <button class="btn" @click="validate">校验</button>
      <button class="btn ghost" @click="clearAll">清空</button>
    </div>

    <div class="cols">
      <div class="col">
        <label>输入</label>
        <textarea v-model="input" spellcheck="false" placeholder="粘贴 JSON…"></textarea>
        <p v-if="errorMsg" class="err">✗ {{ errorMsg }}</p>
      </div>
      <div class="col">
        <label>输出 <button v-if="output" class="link" @click="copy(output)">复制</button></label>
        <textarea v-model="output" readonly spellcheck="false" placeholder="结果…"></textarea>
      </div>
    </div>

    <div class="path-row">
      <label>路径提取 <span>点号路径，如 meta.ver 或 tags.0</span></label>
      <div class="path-input">
        <input v-model="path" type="text" placeholder="meta.ver" spellcheck="false">
        <button v-if="pathValue" class="btn ghost" @click="copy(pathValue)">复制值</button>
      </div>
      <pre v-if="pathValue" class="path-out">{{ pathValue }}</pre>
    </div>
  </section>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; gap: 16px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
  height: 36px; padding: 0 16px;
  border-radius: var(--radius-chip);
  border: 1px solid var(--outline-2);
  background: var(--surface-2);
  color: var(--on-surface);
  font-size: 13px; font-family: var(--font);
  cursor: pointer; transition: all .15s;
}
.btn:hover { border-color: var(--primary); }
.btn.primary { background: rgba(138,180,248,.14); border-color: var(--primary); color: var(--primary); }
.btn.ghost { background: transparent; color: var(--on-surface-3); }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.col { display: flex; flex-direction: column; gap: 8px; }
.col label, .path-row > label {
  font-size: 12px; color: var(--on-surface-3);
  display: flex; align-items: center; justify-content: space-between;
}
.col label .link, .path-row span { font-size: 11px; color: var(--primary); background: none; border: none; cursor: pointer; }
.path-row span { color: var(--on-surface-3); }
textarea {
  min-height: 200px; resize: vertical;
  border: 1px solid var(--outline); border-radius: 12px;
  background: var(--bg); color: var(--on-surface);
  padding: 12px; font-family: var(--mono); font-size: 13px; line-height: 1.6;
  outline: none; transition: border-color .15s;
}
textarea:focus { border-color: var(--primary); }
.err {
  color: var(--danger); font-size: 12px; font-family: var(--mono);
  background: rgba(242,139,130,.08); border: 1px solid rgba(242,139,130,.25);
  border-radius: 8px; padding: 8px 12px;
}
.path-row { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.path-input { display: flex; gap: 8px; }
.path-input input {
  flex: 1; height: 36px; padding: 0 12px;
  border: 1px solid var(--outline); border-radius: 10px;
  background: var(--bg); color: var(--on-surface);
  font-family: var(--mono); font-size: 13px; outline: none;
}
.path-input input:focus { border-color: var(--primary); }
.path-out {
  margin: 0; padding: 12px; border: 1px solid var(--outline); border-radius: 12px;
  background: var(--bg); color: var(--on-surface-2);
  font-family: var(--mono); font-size: 13px; white-space: pre-wrap; word-break: break-all;
}
@media (max-width: 720px) { .cols { grid-template-columns: 1fr; } }
</style>
