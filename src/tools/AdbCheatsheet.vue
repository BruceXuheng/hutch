<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'

const { show } = useToast()
const query = ref('')

// ADB 命令速查（按场景分类，可自行增补）
const groups = [
  {
    title: '设备管理',
    icon: '◉',
    items: [
      { cmd: 'adb devices', desc: '列出已连接设备' },
    ],
  },
  {
    title: '应用管理',
    icon: '▣',
    items: [
      { cmd: 'adb pm list packages', desc: '列出所有包名' },
      { cmd: 'adb pm list packages -s', desc: '列出系统应用' },
      { cmd: 'adb pm list packages -3', desc: '列出第三方应用' },
      { cmd: 'adb shell pm clear com.example.app', desc: '清除应用数据' },
      { cmd: 'adb shell pm grant com.example.app android.permission.READ_CONTACTS', desc: '授予权限' },
      { cmd: 'adb shell pm revoke com.example.app android.permission.CAMERA', desc: '撤销权限' },
    ],
  },
  {
    title: '文件操作',
    icon: '▤',
    items: [
      { cmd: 'adb shell ls /sdcard', desc: '列出设备目录' },
      { cmd: 'adb shell cat /sdcard/file.txt', desc: '查看设备文件内容' },
      { cmd: 'adb shell rm /sdcard/file.txt', desc: '删除设备文件' },
      { cmd: 'adb shell mkdir /sdcard/newdir', desc: '在设备创建目录' },
    ],
  },
  {
    title: '日志与调试',
    icon: '✦',
    items: [
      { cmd: 'adb logcat', desc: '查看实时日志' },
      { cmd: 'adb logcat -v threadtime', desc: '带时间戳线程ID的日志' },
      { cmd: 'adb logcat *:E', desc: '只看 Error 级别' },
      { cmd: 'adb logcat -s MyTag', desc: '按 tag 过滤' },
      { cmd: 'adb logcat -d > log.txt', desc: '导出日志到文件' },
      { cmd: 'adb logcat -c', desc: '清空日志缓冲区' },
      { cmd: 'adb shell dumpsys activity', desc: '查看 Activity 栈信息' },
      { cmd: 'adb shell dumpsys package com.example.app', desc: '查看应用包信息' },
      { cmd: 'adb shell dumpsys battery', desc: '查看电池信息' },
      { cmd: 'adb shell dumpsys meminfo com.example.app', desc: '查看应用内存占用' },
      { cmd: 'adb bugreport bugreport.zip', desc: '生成完整 bug 报告' },
    ],
  },
  {
    title: '截屏录屏',
    icon: '▦',
    items: [
      { cmd: 'adb shell screencap -p /sdcard/screen.png', desc: '截屏保存到设备' },
      { cmd: 'adb exec-out screencap -p > screen.png', desc: '截屏直接保存到本地' },
      { cmd: 'adb shell screenrecord /sdcard/demo.mp4', desc: '录屏（Ctrl+C 停止）' },
      { cmd: 'adb shell screenrecord --time-limit 30 /sdcard/demo.mp4', desc: '录屏限制 30 秒' },
      { cmd: 'adb pull /sdcard/demo.mp4', desc: '拉取录屏文件' },
    ],
  },
  {
    title: '系统属性与设置',
    icon: '⚙',
    items: [
      { cmd: 'adb shell getprop', desc: '查看所有系统属性' },
      { cmd: 'adb shell getprop ro.product.model', desc: '查看设备型号' },
      { cmd: 'adb shell getprop ro.build.version.release', desc: '查看 Android 版本' },
      { cmd: 'adb shell getprop ro.product.manufacturer', desc: '查看厂商' },
      { cmd: 'adb shell settings get system screen_off_timeout', desc: '查看系统设置' },
      { cmd: 'adb shell settings put system screen_off_timeout 60000', desc: '修改息屏时间 60 秒' },
      { cmd: 'adb shell settings put global development_settings_enabled 1', desc: '开启开发者选项' },
      { cmd: 'adb shell svc power stayon true', desc: '保持屏幕常亮' },
      { cmd: 'adb reboot', desc: '重启设备' },
      { cmd: 'adb reboot bootloader', desc: '重启到 bootloader' },
      { cmd: 'adb reboot recovery', desc: '重启到 recovery' },
    ],
  },
  {
    title: 'Shell 与进程',
    icon: '$',
    items: [
      { cmd: 'adb shell', desc: '进入交互式 shell' },
      { cmd: 'adb shell top', desc: '查看资源占用' },
      { cmd: 'adb shell top -m 10', desc: '查看前 10 进程' },
      { cmd: 'adb shell ps', desc: '列出所有进程' },
      { cmd: 'adb shell ps | grep com.example', desc: '查找应用进程' },
      { cmd: 'adb shell kill <pid>', desc: '杀掉指定进程' },
      { cmd: 'adb shell pidof com.example.app', desc: '查看应用 PID' },
      { cmd: 'adb shell ifconfig wlan0', desc: '查看 WiFi IP 地址' },
      { cmd: 'adb shell date', desc: '查看设备时间' },
      { cmd: 'adb shell df', desc: '查看磁盘空间' },
      { cmd: 'adb shell free', desc: '查看内存使用' },
    ],
  },
]

// 搜索过滤：匹配命令或说明
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return groups
  return groups
    .map(g => ({
      ...g,
      items: g.items.filter(it => it.cmd.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)),
    }))
    .filter(g => g.items.length > 0)
})

const totalCmds = computed(() => groups.reduce((n, g) => n + g.items.length, 0))
const matchedCount = computed(() => filtered.value.reduce((n, g) => n + g.items.length, 0))

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text)
    show('已复制命令')
  } catch {
    show('复制失败')
  }
}
</script>

<template>
  <section class="tool">
    <div class="toolbar">
      <div class="search-wrap">
        <svg class="s-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          v-model="query"
          class="s-input"
          type="text"
          placeholder="搜索命令或说明…"
          autocomplete="off"
        >
        <span class="s-kbd">⌘K</span>
      </div>
      <div class="count">
        命中 <b>{{ matchedCount }}</b> / <b>{{ totalCmds }}</b>
      </div>
    </div>

    <div v-for="g in filtered" :key="g.title" class="group">
      <h3 class="group-title">
        <span class="group-icon">{{ g.icon }}</span>
        {{ g.title }}
        <span class="group-count">{{ g.items.length }}</span>
      </h3>
      <div class="items">
        <div v-for="it in g.items" :key="it.cmd" class="item">
          <code class="cmd">{{ it.cmd }}</code>
          <span class="desc">{{ it.desc }}</span>
          <button class="copy" @click="copy(it.cmd)">复制</button>
        </div>
      </div>
    </div>

    <p v-if="!filtered.length" class="empty">未匹配到命令，换个关键词试试。</p>
  </section>
</template>

<style scoped>
.tool { display: flex; flex-direction: column; gap: 24px; }
.toolbar {
  position: sticky;
  top: 64px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 0;
}
.search-wrap {
  flex: 1;
  min-width: 240px;
  max-width: 520px;
  position: relative;
}
.s-input {
  width: 100%;
  height: 40px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--outline);
  background: var(--surface);
  color: var(--on-surface);
  padding: 0 76px 0 40px;
  font-size: 14px;
  font-family: var(--font);
  outline: none;
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}
.s-input::placeholder { color: var(--on-surface-3); }
.s-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-12);
}
.s-icon {
  position: absolute;
  left: 14px; top: 50%;
  transform: translateY(-50%);
  color: var(--on-surface-3);
  pointer-events: none;
}
.s-kbd {
  position: absolute;
  right: 10px; top: 50%;
  transform: translateY(-50%);
  font-family: var(--mono);
  font-size: 11px;
  color: var(--on-surface-3);
  border: 1px solid var(--outline);
  border-radius: 6px;
  padding: 2px 6px;
  background: var(--bg);
}
.count {
  color: var(--on-surface-3);
  font-size: 13px;
  margin-left: auto;
}
.count b {
  color: var(--on-surface);
  font-weight: 600;
}
.group { display: flex; flex-direction: column; gap: 8px; }
.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--on-surface);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--outline);
}
.group-icon {
  color: var(--primary);
  font-family: var(--mono);
}
.group-count {
  margin-left: 4px;
  color: var(--on-surface-3);
  font-size: 12px;
  font-weight: 400;
}
.items { display: flex; flex-direction: column; gap: 6px; }
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--outline);
  border-radius: 12px;
  background: var(--surface);
  transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
}
.item:hover {
  background: var(--surface-2);
  border-color: var(--outline-2);
}
.cmd {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--primary);
  flex-shrink: 0;
  min-width: 0;
}
.desc {
  flex: 1;
  color: var(--on-surface-2);
  font-size: 13px;
  min-width: 0;
}
.copy {
  flex-shrink: 0;
  background: var(--bg);
  border: 1px solid var(--outline-2);
  border-radius: var(--radius-chip);
  padding: 4px 12px;
  color: var(--on-surface-2);
  font-size: 12px;
  font-family: var(--font);
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease);
}
.copy:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-12);
}
.empty {
  text-align: center;
  padding: 64px 24px;
  color: var(--on-surface-3);
  font-size: 14px;
}
@media (max-width: 720px) {
  .item { flex-wrap: wrap; }
  .cmd { width: 100%; }
}
</style>
