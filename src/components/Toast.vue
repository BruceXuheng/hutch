<script setup>
import { useToast } from '../composables/useToast'
const { message, visible } = useToast()
</script>

<template>
  <div class="toast" :class="{ show: visible }">
    <span class="toast-dot"></span>
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--surface-3);
  border: 1px solid var(--outline-2);
  color: var(--on-surface);
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 13px;
  box-shadow: var(--shadow-2);
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s, transform .2s;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.toast-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--warning);
  flex-shrink: 0;
}
</style>
