import { ref } from 'vue'

// 全局 Toast 单例（模块级 ref）
const message = ref('')
const visible = ref(false)
let timer = null

export function useToast() {
  function show(msg, duration = 2200) {
    message.value = msg
    visible.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, duration)
  }
  return { message, visible, show }
}
