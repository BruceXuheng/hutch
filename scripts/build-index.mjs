import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { pinyin } from 'pinyin-pro'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const TOOLS_DIR = join(ROOT, 'tools')
const OUT_DIR = join(ROOT, 'public')
const OUT_FILE = join(OUT_DIR, 'index.json')

// 正文去 Markdown 符号 → 纯文本（供全文检索）
function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, ' ')        // 代码块
    .replace(/`([^`]+)`/g, '$1')            // 行内代码
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')  // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接保留文本
    .replace(/^#{1,6}\s+/gm, '')             // 标题井号
    .replace(/^\s*[-*+]\s+/gm, '')           // 无序列表符
    .replace(/^\s*\d+\.\s+/gm, '')           // 有序列表符
    .replace(/^\s*>\s+/gm, '')               // 引用
    .replace(/^\s*[-*_]{3,}\s*$/gm, '')      // 分隔线
    .replace(/\*\*([^*]+)\*\*/g, '$1')       // 粗体
    .replace(/\*([^*]+)\*/g, '$1')           // 斜体
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

// 中文名 → 拼音全拼（带空格、无声调，非中文保留）+ 首字母缩写（大写）
function pinyinFields(name) {
  const full = pinyin(name, { toneType: 'none', nonZh: 'consecutive' })
  const abbr = full
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join('')
  return { pinyin: full, abbr }
}

// 单工具 md → 索引对象
function parseTool(file) {
  const raw = readFileSync(join(TOOLS_DIR, file), 'utf8')
  const { data, content } = matter(raw)
  if (!data.id) {
    console.warn(`[build-index] 跳过 ${file}：缺少 id`)
    return null
  }
  const { pinyin: py, abbr } = pinyinFields(data.name || data.id)
  return {
    id: data.id,
    name: data.name || data.id,
    nameEn: data.name_en || '',
    category: data.category || 'dev',
    icon: data.icon || '◆',
    color: data.color || 'blue',
    runtime: data.runtime || 'local',
    component: data.component || null,
    url: data.url || null,
    tags: data.tags || [],
    keywords: data.keywords || [],
    pinned: data.pinned ?? false,
    order: data.order ?? 100,
    status: data.status || 'live',
    desc: data.desc || '',
    pinyin: py,
    abbr,
    content: stripMarkdown(content),
  }
}

function main() {
  if (!existsSync(TOOLS_DIR)) {
    console.warn(`[build-index] tools 目录不存在：${TOOLS_DIR}`)
    mkdirSync(OUT_DIR, { recursive: true })
    writeFileSync(OUT_FILE, '[]')
    return
  }
  const files = readdirSync(TOOLS_DIR).filter(f => f.endsWith('.md'))
  const list = files
    .map(parseTool)
    .filter(Boolean)
    .sort((a, b) => (a.order - b.order))
  mkdirSync(OUT_DIR, { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(list, null, 2) + '\n')
  console.log(`[build-index] 生成 ${list.length} 个工具 → ${OUT_FILE}`)
}

main()
