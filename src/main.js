import './styles/tokens.css'
import './styles/base.css'
import './styles/animations.css'
import './composables/useTheme'  // 模块加载即初始化主题（先于 mount 设 data-theme，避免闪烁）
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
