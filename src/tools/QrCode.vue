<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import { useToast } from '../composables/useToast'

const { show } = useToast()

const text = ref('https://brucexuheng.github.io/hutch/')
const level = ref('M')        // 容错 L/M/Q/H
const size = ref(256)         // 像素尺寸
const margin = ref(2)         // 边距
const dataUrl = ref('')
const err = ref('')

async function generate() {
  if (!text.value.trim()) { err.value = '请输入文本'; dataUrl.value = ''; return }
  err.value = ''
  try {
    dataUrl.value = await QRCode.toDataURL(text.value, {
      errorCorrectionLevel: level.value,
      width: size.value,
      margin: margin.value,
      color: { dark: '#0d0e11', light: '#e3e3e6' }  // 深底浅码（视觉反转适配深色站）
    })
    show('已生成')
  } catch (e) {
    err.value = e.message
    dataUrl.value = ''
  }
}

// 输入变化自动重新生成（防抖）
let timer
watch([text, level, size, margin], () => {
  clearTimeout(timer)
  timer = setTimeout(generate, 200)
})

function download() {
  if (!dataUrl.value) return
  const a = document.createElement('a')
  a.href = dataUrl.value
  a.download = 'qrcode.png'
  a.click()
  show('已下载')
}

async function copyDataUrl() {
  try { await navigator.clipboard.writeText(dataUrl.value); show('已复制 data URL') } catch { show('复制失败') }
}

generate()
</script>

<template>
  <section class="tool">
    <div class="opts">
      <label class="opt">文本
        <textarea v-model="text" spellcheck="false" placeholder="输入文本或 URL…"></textarea>
      </label>
      <div class="ctrl">
        <label class="opt">容错
          <select v-model="level">
            <option value="L">L · 7%</option>
            <option value="M">M · 15%</option>
            <option value="Q">Q · 25%</option>
            <option value="H">H · 30%</option>
          </select>
        </label>
        <label class="opt">尺寸 {{ size }}px
          <input v-model.number="size" type="range" min="128" max="512" step="32">
        </label>
        <label class="opt">边距 {{ margin }}
          <input v-model.number="margin" type="range" min="0" max="6" step="1">
        </label>
      </div>
    </div>

    <div class="row">
      <button class="btn primary" @click="generate">重新生成</button>
      <button class="btn" :disabled="!dataUrl" @click="download">下载 PNG</button>
      <button class="btn ghost" :disabled="!dataUrl" @click="copyDataUrl">复制 data URL</button>
    </div>

    <p v-if="err" class="err">✗ {{ err }}</p>

    <div class="preview">
      <img v-if="dataUrl" :src="dataUrl" alt="二维码预览">
      <span v-else class="ph">预览区</span>
    </div>
  </section>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; gap: 16px; }
.opts { display: grid; grid-template-columns: 1fr 240px; gap: 16px; }
.opt { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--on-surface-3); }
.opt textarea, .opt select, .opt input[type=range] { accent-color: var(--primary); }
.opt textarea {
  min-height: 96px; resize: vertical;
  border: 1px solid var(--outline); border-radius: 10px;
  background: var(--bg); color: var(--on-surface);
  padding: 10px; font-family: var(--mono); font-size: 13px; outline: none;
}
.opt textarea:focus { border-color: var(--primary); }
.opt select {
  height: 34px; border: 1px solid var(--outline); border-radius: 8px;
  background: var(--surface); color: var(--on-surface); padding: 0 8px; outline: none;
}
.ctrl { display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; gap: 8px; flex-wrap: wrap; }
.btn {
  height: 36px; padding: 0 16px; border-radius: var(--radius-chip);
  border: 1px solid var(--outline-2); background: var(--surface-2);
  color: var(--on-surface); font-size: 13px; font-family: var(--font); cursor: pointer;
  transition: all .15s;
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
.preview {
  display: grid; place-items: center; min-height: 280px;
  border: 1px solid var(--outline); border-radius: var(--radius-card);
  background: var(--surface); padding: 24px;
}
.preview img { max-width: 320px; width: 100%; border-radius: 8px; }
.preview .ph { color: var(--on-surface-3); font-size: 13px; }
@media (max-width: 720px) { .opts { grid-template-columns: 1fr; } }
</style>
