<script setup>
import { useToolsStore } from '../data/tools.store'
import SearchBox from './SearchBox.vue'

const store = useToolsStore()
// TODO: 仓库建立后替换为真实 GitHub 地址
const repoUrl = '#'
</script>

<template>
  <header class="app-bar">
    <div class="logo">
      <div class="logo-mark">H</div>
      <div class="logo-text">Hutch<span>· 器舍</span></div>
    </div>
    <SearchBox v-model="store.query" />
    <div class="actions">
      <a class="icon-btn" :href="repoUrl" target="_blank" rel="noopener noreferrer" title="GitHub">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2A10 10 0 0 0 8.8 21.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.5 5 .3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
        </svg>
      </a>
      <button class="icon-btn primary" title="主题（即将支持）">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
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
  background: rgba(13,14,17,.8);
  backdrop-filter: blur(12px);
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
}
.logo-mark {
  width: 32px; height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%);
  display: grid; place-items: center;
  color: #0d0e11;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 0 0 1px rgba(138,180,248,.25);
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
  transition: background .15s, color .15s, border-color .15s;
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
  .icon-btn:not(.primary) { display: none; }
}
</style>
