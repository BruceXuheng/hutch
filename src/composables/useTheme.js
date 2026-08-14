// 主题管理 composable
// 持久化到 localStorage；初始读 localStorage 或 prefers-color-scheme；设 document data-theme
import { ref } from 'vue'

const KEY = 'hutch-theme'
const theme = ref('light')

// 初始主题：localStorage > 默认亮色（android.com 风）
// 不跟随系统偏好——首次访问固定亮色，用户手动切暗后记住
function initTheme() {
  const saved = localStorage.getItem(KEY)
  theme.value = (saved === 'dark' || saved === 'light') ? saved : 'light'
  applyTheme()
}

// 应用 data-theme 到 <html>，避免样式闪烁
function applyTheme() {
  document.documentElement.dataset.theme = theme.value
}

function toggle() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem(KEY, theme.value)
  applyTheme()
}

// 模块加载即初始化（main.js 引入前算一次）
initTheme()

export function useTheme() {
  return { theme, toggle }
}
