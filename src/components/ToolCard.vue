<script setup>
defineProps({ tool: { type: Object, required: true } })
defineEmits(['click'])

const COLOR_MAP = {
  blue: 'var(--primary)',
  purple: 'var(--tertiary)',
  green: 'var(--success)',
  amber: 'var(--warning)',
  red: 'var(--danger)',
}
const RUNTIME_MAP = {
  local: { label: '本地', color: 'var(--success)' },
  ai: { label: 'AI', color: 'var(--tertiary)' },
  online: { label: '在线', color: 'var(--warning)' },
}
</script>

<template>
  <article
    class="card"
    :class="{ soon: tool.status === 'soon' }"
    :style="{ '--card-color': COLOR_MAP[tool.color] || 'var(--primary)' }"
    @click="$emit('click', tool)"
  >
    <span v-if="tool.status === 'soon'" class="soon-tag">即将上线</span>
    <span v-else class="runtime-badge">
      <span class="dot" :style="{ '--rt-color': RUNTIME_MAP[tool.runtime]?.color }"></span>
      {{ RUNTIME_MAP[tool.runtime]?.label }}
    </span>

    <div class="card-head">
      <div class="icon-box">{{ tool.icon }}</div>
      <div class="card-title-wrap">
        <div class="card-title">{{ tool.name }}</div>
        <div v-if="tool.nameEn" class="card-name-en">{{ tool.nameEn }}</div>
      </div>
    </div>

    <p class="card-desc">{{ tool.desc }}</p>

    <div v-if="tool.tags?.length" class="card-tags">
      <span v-for="t in tool.tags.slice(0, 3)" :key="t" class="tag">{{ t }}</span>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative;
  border: 1px solid var(--outline);
  border-radius: var(--radius-card);
  background: var(--surface);
  padding: 20px;
  cursor: pointer;
  transition: transform .15s, border-color .15s, background .15s, box-shadow .15s;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}
.card:hover {
  transform: translateY(-2px);
  border-color: var(--outline-2);
  background: var(--surface-2);
  box-shadow: var(--shadow-2);
}
.card::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--card-color, var(--primary));
  opacity: 0;
  transition: opacity .15s;
}
.card:hover::before { opacity: 1; }

.card-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.icon-box {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: var(--surface-3);
  border: 1px solid var(--outline);
  display: grid; place-items: center;
  font-family: var(--mono);
  font-weight: 700;
  font-size: 18px;
  color: var(--card-color, var(--primary));
  flex-shrink: 0;
}
.card-title-wrap { flex: 1; min-width: 0; }
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card-name-en {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--on-surface-3);
  letter-spacing: .3px;
}

.runtime-badge {
  position: absolute;
  top: 16px; right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--on-surface-3);
  background: var(--bg);
  border: 1px solid var(--outline);
  border-radius: 8px;
  padding: 3px 8px;
  font-weight: 500;
}
.runtime-badge .dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--rt-color, var(--on-surface-3));
}

.card-desc {
  color: var(--on-surface-2);
  font-size: 13px;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  font-size: 11px;
  color: var(--on-surface-3);
  background: var(--bg);
  border: 1px solid var(--outline);
  border-radius: 6px;
  padding: 2px 8px;
  font-family: var(--mono);
}

.card.soon { opacity: .65; }
.card.soon .icon-box { color: var(--on-surface-3); }
.card.soon .soon-tag {
  position: absolute;
  top: 16px; right: 16px;
  font-size: 11px;
  color: var(--warning);
  background: rgba(253,214,99,.1);
  border: 1px solid rgba(253,214,99,.3);
  border-radius: 8px;
  padding: 3px 8px;
  font-weight: 500;
}
</style>
