<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

const { show } = useToast()

const algo = ref('SHA-256')
const text = ref('')
const file = ref(null)
const result = ref('')
const busy = ref(false)
const err = ref('')

// buffer → hex
function toHex(buf) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

async function run() {
  err.value = ''
  result.value = ''
  let data
  if (file.value) {
    data = await file.value.arrayBuffer()
  } else if (text.value) {
    data = new TextEncoder().encode(text.value)
  } else {
    err.value = '请输入文本或选择文件'
    return
  }
  busy.value = true
  try {
    const hash = await crypto.subtle.digest(algo.value, data)
    result.value = toHex(hash)
  } catch (e) {
    err.value = e.message
  } finally {
    busy.value = false
  }
}

async function onFile(e) {
  const f = e.target.files?.[0]
  file.value = f || null
  if (f) { text.value = ''; await run() }
}

function clearAll() {
  text.value = ''; file.value = null; result.value = ''; err.value = ''
}

async function copy() {
  if (!result.value) return
  try { await navigator.clipboard.writeText(result.value); show('已复制') } catch { show('复制失败') }
}

const bytes = computed(() => result.value ? result.value.length / 2 : 0)
</script>

<template>
  <section class="tool">
    <div class="opts">
      <label class="opt">算法
        <select v-model="algo" @change="run">
          <option>SHA-1</option>
          <option>SHA-256</option>
          <option>SHA-384</option>
          <option>SHA-512</option>
        </select>
      </label>
      <div class="spacer"></div>
      <span class="note">MD5 不被 Web Crypto 支持，仅提供 SHA 系列</span>
    </div>

    <div class="cols">
      <div class="col">
        <label>文本输入</label>
        <textarea v-model="text" spellcheck="false" placeholder="输入文本…" :disabled="!!file"></textarea>
        <label class="file-pick">
          或选择文件 <input type="file" @change="onFile">
          <span v-if="file">{{ file.name }}</span>
        </label>
      </div>
    </div>

    <div class="row">
      <button class="btn primary" :disabled="busy" @click="run">{{ busy ? '计算中…' : '计算 Hash' }}</button>
      <button class="btn ghost" @click="clearAll">清空</button>
    </div>

    <p v-if="err" class="err">✗ {{ err }}</p>

    <div v-if="result" class="result">
      <label>{{ algo }} <span>({{ bytes }} bytes)</span> <button class="link" @click="copy">复制</button></label>
      <pre>{{ result }}</pre>
    </div>
  </section>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; gap: 16px; }
.opts { display: flex; align-items: center; gap: 12px; }
.opt { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--on-surface-3); }
.opt select {
  height: 36px; border: 1px solid var(--outline); border-radius: 8px;
  background: var(--surface); color: var(--on-surface); padding: 0 8px; outline: none; font-family: var(--font); font-size: 13px;
}
.spacer { flex: 1; }
.note { font-size: 11px; color: var(--on-surface-3); }
.cols { display: flex; flex-direction: column; gap: 12px; }
.col { display: flex; flex-direction: column; gap: 8px; }
.col label { font-size: 12px; color: var(--on-surface-3); }
textarea {
  min-height: 120px; resize: vertical;
  border: 1px solid var(--outline); border-radius: 10px;
  background: var(--bg); color: var(--on-surface);
  padding: 12px; font-family: var(--mono); font-size: 13px; outline: none;
}
textarea:focus { border-color: var(--primary); }
textarea:disabled { opacity: .5; }
.file-pick { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--primary); cursor: pointer; }
.file-pick input { font-size: 12px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
  height: 36px; padding: 0 16px; border-radius: var(--radius-chip);
  border: 1px solid var(--outline-2); background: var(--surface-2);
  color: var(--on-surface); font-size: 13px; font-family: var(--font); cursor: pointer; transition: all .15s;
}
.btn:hover:not(:disabled) { border-color: var(--primary); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.btn.primary { background: rgba(138,180,248,.14); border-color: var(--primary); color: var(--primary); }
.btn.ghost { background: transparent; color: var(--on-surface-3); }
.err {
  color: var(--danger); font-size: 12px; font-family: var(--mono);
  background: rgba(242,139,130,.08); border: 1px solid rgba(242,139,130,.25);
  border-radius: 8px; padding: 8px 12px;
}
.result label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--on-surface-3); }
.result span { color: var(--on-surface-3); }
.link { background: none; border: none; color: var(--primary); font-size: 12px; cursor: pointer; }
.result pre {
  margin: 8px 0 0; padding: 12px; border: 1px solid var(--outline); border-radius: 10px;
  background: var(--bg); color: var(--on-surface);
  font-family: var(--mono); font-size: 12px; white-space: pre-wrap; word-break: break-all;
}
</style>
