<script setup>
import { useRouter } from 'vue-router'
import { useToolsStore } from '../data/tools.store'
import { useTheme } from '../composables/useTheme'
import SearchBox from './SearchBox.vue'

const store = useToolsStore()
const router = useRouter()
const { theme, toggle } = useTheme()

// GitHub 个人首页
const repoUrl = 'https://github.com/BruceXuheng'

// logo 点击回首页
function goHome() {
  router.push('/')
}
</script>

<template>
  <header class="app-bar">
    <button class="logo" type="button" @click="goHome" aria-label="返回首页">
      <div class="logo-mark">H</div>
      <div class="logo-text">Hutch<span>· 器舍</span></div>
    </button>
    <SearchBox v-model="store.query" />
    <div class="actions">
      <a class="icon-btn" :href="repoUrl" target="_blank" rel="noopener noreferrer" title="GitHub 主页">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.5 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      </a>
      <button class="icon-btn" type="button" @click="toggle" :title="theme === 'dark' ? '切换到亮色' : '切换到暗色'">
        <!-- 亮色主题显示月亮（点切到暗）；暗色显示太阳（点切到亮） -->
        <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 24px;
  background: var(--bar-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--outline);
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: .2px;
  white-space: nowrap;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font);
  color: var(--on-surface);
  border-radius: 12px;
  padding: 4px 6px 4px 4px;
  transition: background var(--dur-fast, .12s) var(--ease, cubic-bezier(.2,0,0,1));
}
.logo:hover { background: var(--primary-12); }
.logo-mark {
  width: 32px; height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%);
  display: grid; place-items: center;
  color: var(--logo-fg);
  font-family: var(--mono);
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 0 0 1px var(--primary-12);
}
.logo-text { color: var(--on-surface); }
.logo-text span {
  color: var(--on-surface-3);
  font-weight: 400;
  margin-left: 2px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}
.icon-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid var(--outline);
  background: var(--surface);
  color: var(--on-surface-2);
  cursor: pointer;
  display: grid; place-items: center;
  transition: background var(--dur-fast, .12s) var(--ease, cubic-bezier(.2,0,0,1)),
              color var(--dur-fast, .12s) var(--ease, cubic-bezier(.2,0,0,1)),
              border-color var(--dur-fast, .12s) var(--ease, cubic-bezier(.2,0,0,1));
  text-decoration: none;
}
.icon-btn:hover {
  background: var(--surface-2);
  color: var(--on-surface);
  border-color: var(--outline-2);
}
@media (max-width: 720px) {
  .app-bar { padding: 0 16px; gap: 12px; }
  .logo-text { display: none; }
}
</style>
