# Hutch · 器舍 — 技术设计（Vite + Vue 3 SPA）

> Markdown 驱动 + GitHub Actions 构建索引 + Vue SPA 检索
> 风格：深色科技风（Material Design 3 Dark）
> 关联：`PROJECT.md` · `PRD.md` · `DESIGN.md`

---

## 0. 一句话定位

每个工具一个 Markdown 文档（front matter 即结构化元数据，正文即内容），push 到 GitHub 后 Actions 自动完成两件事：①扫描 `tools/*.md` 生成 `index.json` ②`vite build` 构建产物部署到 Pages。前端是 Vue 3 SPA，加载 `index.json` 完成"关键词 + 正文中英文"检索与卡片渲染。**你的操作永远是 `git push`，构建在后台全自动。**

---

## 1. 选型理由（为什么是 Vue + Vite）

| 你的需求 | 本方案如何满足 |
|---|---|
| 每个工具一个文档、固定格式 | `tools/<id>.md` + front matter，正文即说明文档 |
| 上百个工具 | 构建期预生成 `index.json`，前端一次加载 |
| 内容中英文检索（包含匹配，不要错别字） | front matter + 正文都进索引，`indexOf` 包含匹配 |
| push 即发布 | Actions 自动构建 + 部署，体感仍是 push 即上线 |
| 纯静态、无后端、无登录 | Vite 构建为静态文件，Pages 托管 |
| 深色科技风偏 Google | Material 3 Dark |
| 工具页复杂交互（JSON 树、正则可视化） | Vue 组件化 + 响应式状态，比纯原生清晰 |
| AI Copilot 路线图 | Vue 生态适合流式输出/状态机 |
| 一人维护 | 录入 = 一个 md 文件 push；构建脚本写好不用碰 |

> 选 Vue 的核心理由：首页虽简单，但工具页（JSON 树编辑、正则可视化、实时预览）和 AI Copilot 才是主战场，Vue 组件化 + 响应式状态在这两处收益明显；Vite build 的边际成本被已有的 Actions 流程吸收。

---

## 2. 目录结构

```
hutch/
├── .github/
│   └── workflows/
│       ├── build-index.yml          # 扫描 tools/*.md → 生成 public/index.json
│       └── deploy.yml               # vite build → 部署 dist 到 Pages
├── scripts/
│   └── build-index.mjs             # 构建脚本：gray-matter + pinyin-pro
├── tools/                           # ★ 录入区：每个工具一个 md
│   ├── json-formatter.md
│   ├── qrcode.md
│   ├── text-assistant.md
│   └── ...
├── public/                          # 静态资源（直接拷到 dist）
│   ├── index.json                  # ← 由 Actions 构建，不入 git 或入 git 均可
│   └── icon-set/                   # 工具图标 SVG
├── src/
│   ├── main.js                     # Vue app 入口
│   ├── App.vue                     # 根组件：router-view + App Bar
│   ├── router.js                   # Vue Router：/ 和 /tool/:id
│   ├── data/
│   │   └── tools.store.js          # Pinia store：加载 index.json + 检索逻辑
│   ├── composables/
│   │   └── useSearch.js            # 检索算法（相关度排序）
│   ├── components/
│   │   ├── AppBar.vue
│   │   ├── SearchBox.vue
│   │   ├── FilterChips.vue
│   │   ├── ToolCard.vue
│   │   ├── ToolGrid.vue
│   │   ├── EmptyState.vue
│   │   ├── Toast.vue
│   │   └── FooterBar.vue
│   ├── views/
│   │   ├── HomeView.vue            # 首页：hero + filter + grid
│   │   └── ToolView.vue            # 工具页壳：按 id 加载对应工具组件
│   ├── tools/                      # 工具页实现（复杂交互工具）
│   │   ├── JsonFormatter.vue
│   │   ├── QrCode.vue
│   │   └── ...
│   ├── styles/
│   │   ├── tokens.css              # 设计系统变量（色彩/字体/形状/层次/间距）
│   │   ├── base.css                # reset + 基础元素
│   │   └── animations.css          # 动效
│   └── utils/
│       └── externalLinks.js        # 在线工具跳转辅助
├── index.html                      # Vite 入口 HTML
├── vite.config.js                  # Vite 配置（base 子路径）
├── package.json
├── PROJECT.md · PRD.md · DESIGN.md · TECH_DESIGN.md
└── README.md
```

**Pages 部署**：Actions `vite build` 生成 `dist/` → 用 `actions/deploy-pages` 部署。Pages 源设为 `GitHub Actions`，不再依赖分支根目录。

---

## 3. 数据 Schema：Markdown front matter

每个工具 = `tools/<id>.md`。front matter 固定字段，正文同时被构建脚本抽进检索索引。

```markdown
---
id: json-formatter                 # 全局唯一，与文件名一致
name: JSON 格式化                   # 卡片标题（中文）
name_en: JSON Formatter             # 英文名（可选，英文检索）
category: dev                       # dev(开发) | ai(AI) | eff(效率) | nav(导航)
icon: "{ }"                          # 图标：字符或 assets 内 SVG 名
color: blue                          # 主题色：blue | purple | green | amber | red
runtime: local                      # local | ai | online
component: JsonFormatter             # Vue 组件名（runtime=local 且需工具页时填）
url:                                 # 外部链接（runtime=online 时填）；local 留空走 SPA 路由
tags: [json, 格式化, 美化, 校验]
keywords: [format, pretty, beautify, minify, validate, json lint]
pinned: false
order: 10
status: live                        # live | beta | soon
desc: 校验、压缩与可视化 JSON 数据。
---

# JSON 格式化

校验、压缩与可视化 JSON 数据。支持大文件、错误高亮、路径提取。

## 功能
- 格式化与压缩互转
- 语法校验，错误行高亮
- 路径提取与复制
```

**字段说明**：
- `id`：唯一键，前端路由 `/tool/<id>` 对齐。
- `name` / `name_en`：中英文名都进索引。
- `tags` / `keywords`：都进索引。
- `runtime`：驱动卡片角标与点击行为。
- `component`：runtime=local 且工具页是 Vue 组件时填，路由用动态 import 加载 `src/tools/<component>.vue`。
- `url`：runtime=online 直接填外部链接，点击新标签跳转。
- `status: soon`：AI Copilot 等占位工具先挂占位卡，点击提示"敬请期待"。
- 正文：构建脚本去 Markdown 符号、合并纯文本进索引，供全文检索。

---

## 4. 构建产物：index.json

`scripts/build-index.mjs` 扫描 `tools/*.md`，解析 front matter（`gray-matter`）+ 正文，用 `pinyin-pro` 生成 `name` 的拼音全拼与首字母，输出 `public/index.json`：

```json
[
  {
    "id": "json-formatter",
    "name": "JSON 格式化",
    "nameEn": "JSON Formatter",
    "category": "dev",
    "icon": "{ }",
    "color": "blue",
    "runtime": "local",
    "component": "JsonFormatter",
    "url": null,
    "tags": ["json","格式化","美化","校验"],
    "keywords": ["format","pretty","beautify","minify","validate"],
    "pinned": false,
    "order": 10,
    "status": "live",
    "desc": "校验、压缩与可视化 JSON 数据。",
    "pinyin": "jsonge shihua",
    "abbr": "JGSH",
    "content": "校验压缩与可视化json数据支持大文件错误高亮路径提取功能格式化与压缩互转..."
  }
]
```

- `pinyin` / `abbr`：自动生成，**录入时不用手填**。
- `content`：正文去 Markdown 后的纯文本。
- Vite 把 `public/index.json` 原样拷到 `dist/index.json`，前端运行时 `fetch` 它。

---

## 5. 构建流程（GitHub Actions）

两个 workflow，职责分离：

### 5.1 build-index.yml（生成索引）
1. 触发：push 到 `main` 且 `tools/**` 或 `scripts/**` 变更。
2. `npm ci`（仅 devDeps：`gray-matter`、`pinyin-pro`）。
3. `node scripts/build-index.mjs` → 生成 `public/index.json`。
4. `git commit public/index.json` → push 回 `main`（用 `GITHUB_TOKEN`）。
5. 触发下游 deploy（workflow_run 事件 或 同一 workflow 串行）。

### 5.2 deploy.yml（构建并部署）
1. 触发：`main` 上 `src/`、`public/`、`index.html`、`vite.config.js` 变更，或被 build-index 触发。
2. `npm ci`。
3. `npm run build`（`vite build`）→ 输出 `dist/`。
4. `actions/upload-pages-artifact` + `actions/deploy-pages` 部署到 Pages。

**你的操作仍是 `git push`，体感 = push 即上线。** 本地预览：`npm run dev`（Vite dev server，热更新）。

---

## 6. 检索算法

### 索引字段（每个工具的 haystack）
```
hay = [
  name, nameEn, pinyin, abbr,
  ...tags, ...keywords,
  content
].join(' ').toLowerCase()
```

### 查询归一化
- `q = input.trim().toLowerCase().replace(/\s+/g, ' ')`
- 多词：空格拆分 → AND（每个词都要命中）

### 匹配规则
- `indexOf` 包含匹配，**不做错别字容错**。
- 中英文、拼音全拼、首字母缩写都能命中。

### 相关度排序
1. `name` 包含 query → +100
2. `tags`/`keywords` 命中 → +50
3. `pinyin`/`abbr` 命中 → +40
4. `content` 命中 → +10
5. 同分按 `pinned DESC, order ASC`
6. 不命中不显示

### 性能
上百个工具 × 每个索引 < 2KB，前端 `indexOf` 在首屏即时完成（< 5ms）。无需 Fuse.js/lunr。检索逻辑放在 `src/composables/useSearch.js`，Pinia store 调用，Vue computed 自动驱动 UI 更新。

---

## 7. 前端架构（Vue 3 + Vue Router + Pinia）

### 7.1 技术栈

- **Vue 3**（`<script setup>` SFC）
- **Vue Router 4**：`createWebHistory`，子路径 `base` 在 `vite.config.js` 设 `/<repo>/`
- **Pinia**：`tools` store 管理工具列表 + 检索状态（query / filter / results）
- **Vite 5**：dev server + build
- 零 UI 库，组件全自写（保持设计系统纯净，避免引入 Material 库的样式冲突）

### 7.2 状态管理（Pinia store）

```js
// src/data/tools.store.js
export const useToolsStore = defineStore('tools', () => {
  const all = ref([])              // 全量工具
  const query = ref('')           // 搜索词
  const filter = ref('all')       // runtime 筛选
  const loaded = ref(false)

  const results = computed(() => {
    // 1. filter 过滤
    // 2. query 检索 + 相关度排序
    // 3. 返回排序后数组
  })

  const stats = computed(() => ({
    total: all.value.length,
    local: countBy('local'),
    ai: countBy('ai'),
    online: countBy('online'),
  }))

  async function load() {
    const res = await fetch('./index.json')
    all.value = await res.json()
    loaded.value = true
  }

  return { all, query, filter, loaded, results, stats, load }
})
```

### 7.3 路由

```js
// src/router.js
routes: [
  { path: '/', component: HomeView },
  { path: '/tool/:id', component: ToolView },   // 动态加载 src/tools/<component>.vue
]
```

`ToolView.vue`：
- 从 store 取 `id` 对应工具
- runtime=online → 重定向外部 `url`（新标签）
- runtime=local + 有 `component` → 动态 import 渲染
- runtime=local + 无 component → 渲染一个通用壳，加载 `tools/<id>.md` 正文做说明页
- status=soon → Toast + 返回首页

### 7.4 加载流程
1. `index.html` 引入 `/src/main.js`（Vite 入口）。
2. `main.js`：createApp + Pinia + Router + 全局样式 → mount。
3. `App.vue` `onMounted` → `toolsStore.load()` fetch `index.json`。
4. `HomeView` 通过 store 的 `results` computed 自动渲染。
5. 搜索框 `v-model` 绑 store 的 `query`，computed 自动重算。
6. 卡片点击 → `router.push('/tool/<id>')`（local）或 `window.open(url)`（online）。

### 7.5 本地预览
```bash
npm run dev    # Vite dev server，http://localhost:5173
npm run build  # 生产构建到 dist/
```
> 注意：本地 `npm run dev` 时 index.json 若不存在（未跑构建脚本），可先手动 `node scripts/build-index.mjs` 生成一次，或在 dev 脚本里加 `predev` 钩子自动生成。

---

## 8. 视觉设计规范

详见 `DESIGN.md`。技术层面：
- 设计 token 全部定义在 `src/styles/tokens.css`（CSS 变量）
- 组件样式用 `<style scoped>`，共享变量从 tokens.css 注入
- 设计系统已落地 `design-demo.html`，开发时直接对照 token 取值

---

## 9. GitHub Pages 部署

1. 新建仓库 `hutch`（不用 `用户名.github.io` 特殊名）。
2. Settings → Pages → Source: **GitHub Actions**（不是分支 root）。
3. 推送代码，两个 workflow 自动跑：build-index 生成 index.json → deploy 构建 dist 部署。
4. 访问 `https://<用户名>.github.io/hutch/`。
5. `vite.config.js` 配 `base: '/hutch/'`，路由用 `createWebHistory('/hutch/')`，所有资源走子路径。

---

## 10. 录入流程（新增一个工具）

1. `tools/` 新建 `<id>.md`，填 front matter + 正文。
2. 按工具类型决定工具页：
   - **online 工具**：`url` 填外部链接，无需建组件。
   - **local 简单工具**：`component` 填 Vue 组件名，在 `src/tools/` 建 `<Component>.vue` 实现功能。
   - **AI 工具**：先 `status: soon` 占位，后续实现时建组件改 `live`。
3. `git push`。Actions 自动重建索引 + 构建部署，Pages 自动更新。

**录入成本**：一个 md 文件 +（local 工具时）一个 Vue 组件。拼音自动生成。

---

## 11. 扩展路线（按需启用）

- **PWA 离线**：`vite-plugin-pwa`，预缓存首页 + index.json。
- **AI Copilot**：`status: soon` 占位已留；接 API（Cloudflare Worker 代理 key）。Vue 适合流式 SSE 渲染。
- **拼音容错**：上百工具且需容错时引入 Fuse.js，替换 `useSearch.js` 内部实现。
- **工具页模板化**：常见工具（格式化类）抽成共享 composable + 配置驱动。
- **主题切换**：tokens.css 拆 light/dark 变量集，Pinia 存偏好。

---

## 12. 已知取舍

- **不再支持 file://**：Vite 本来就要 dev server / build，无 file:// 诉求，比方案 A 反而更顺。
- **构建有两步**：build-index + vite build。但全自动、无感知；本地 dev 只需首次跑一次 index 生成。
- **Vue runtime 体积**：gzip 后 ~20KB，首页加载无感知；换来工具页清晰可维护。
- **全文检索覆盖正文，不含错别字容错**（按你要求简化）。
- **零 UI 库**：所有组件自写，保持设计系统纯净，避免 Material 库样式冲突。代价是手写量略大，但 demo 已定型可直接搬。
