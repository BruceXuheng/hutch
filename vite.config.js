import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 生产部署到 GitHub Pages 子路径 /hutch/；本地 dev 用根路径 /
// 仓库名 = hutch，若不同改这里的 base
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/hutch/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
