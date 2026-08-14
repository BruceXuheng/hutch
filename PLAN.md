# Hutch · 器舍 — M1 骨架开发规划

> 阶段：M1 骨架（PRD 里程碑表）
> 目标：搭起 Vite + Vue 3 项目骨架，跑通"Markdown → index.json → 首页检索渲染 → 工具页路由"全链路，视觉对照 design-demo 落地。
> 关联：`TECH_DESIGN.md`（技术设计） · `PRD.md` · `DESIGN.md`

---

## 1. M1 范围与验收

### 1.1 范围（M1 只做骨架，不含内容填充）
- Vite + Vue 3 + Vue Router + Pinia 项目脚手架
- 设计系统 token 文件 + 基础样式
- 核心组件骨架（App Bar / SearchBox / FilterChips / ToolCard / ToolGrid / EmptyState / Toast / FooterBar）
- 首页视图（Hero + Filter + Grid 三段）
- 工具页视图壳 + 路由
- 构建脚本（build-index.mjs）
- Actions 两个 workflow
- 2-3 个示例工具 md（验证全链路，非正式内容）

### 1.2 验收标准（M1 达成判定）
- [ ] `npm run dev` 本地启动，首页可见 App Bar + Hero + Filter + Grid
- [ ] `node scripts/build-index.mjs` 生成 `public/index.json`，含示例工具 + 拼音 + 正文
- [ ] 搜索框输入关键词，实时过滤 + 相关度排序生效
- [ ] Filter chips 切换 runtime 筛选生效，与搜索取交集
- [ ] 点击 local 工具卡片进入 `/tool/<id>` 路由，工具页壳加载
- [ ] 点击 online 工具卡片新标签跳转外部链接
- [ ] 点击 soon 工具卡片弹出 Toast
- [ ] 空状态：无结果时显示空状态 + 清空按钮
- [ ] 响应式：桌面 3 列 / 平板 2 列 / 手机 1 列
- [ ] `npm run build` 成功输出 `dist/`
- [ ] 视觉对照 `design-demo.html` 一致（配色/字号/圆角/间距/卡片样式）
- [ ] push 后 Actions 两步构建部署成功（本地验证 index 生成 + build，远程部署等仓库建立后验证）

---

## 2. 任务拆解与实现顺序

按依赖关系排序，串行推进（每个任务完成后校验再推进下一个）。

### T1. 项目脚手架与依赖
**产出**：可运行的空 Vue 项目
- `npm create vite@latest hutch -- --template vue`（在 workspace 下）
- 安装依赖：`vue`、`vue-router`、`pinia`
- 安装 devDeps：`vite`、`@vitejs/plugin-vue`
- 安装构建期依赖（devDeps）：`gray-matter`、`pinyin-pro`
- 配置 `vite.config.js`：`base: '/hutch/'`、`@vitejs/plugin-vue`
- 清理 Vite 模板默认文件（HelloWorld.vue 等）
- **校验**：`npm run dev` 能启动空白页

### T2. 设计系统落地
**产出**：tokens.css + base.css，视觉基底就位
- 建 `src/styles/tokens.css`：从 `design-demo.html` 抽出所有 CSS 变量（色彩/字体/形状/层次/间距/动效）
- 建 `src/styles/base.css`：reset + body 背景 + 字体 + 滚动条
- 建 `src/styles/animations.css`：动效 token（transition 时长/缓动）
- `main.js` 引入三个样式文件
- **校验**：页面背景变深色，字体生效

### T3. 构建脚本与示例数据
**产出**：`scripts/build-index.mjs` + 3 个示例工具 md + `public/index.json`
- 写 `scripts/build-index.mjs`：
  - 扫描 `tools/*.md`
  - `gray-matter` 解析 front matter
  - 正文去 Markdown 符号 → 纯文本
  - `pinyin-pro` 生成 `pinyin`（全拼）+ `abbr`（首字母）
  - 输出 `public/index.json`
- 写 3 个示例 md（覆盖三类 runtime + soon）：
  - `tools/json-formatter.md`（local, live, component: JsonFormatter）
  - `tools/regex101.md`（online, live, url: https://regex101.com）
  - `tools/text-assistant.md`（ai, soon）
- 跑一次 `node scripts/build-index.mjs` 生成 index.json
- 在 `package.json` 加 `"prebuild": "node scripts/build-index.mjs"` 和 `"predev"` 钩子（dev 前自动生成一次）
- **校验**：`public/index.json` 内容正确，含拼音 + 正文

### T4. 数据层（Pinia store + 检索 composable）
**产出**：`tools.store.js` + `useSearch.js`
- `src/data/tools.store.js`：
  - state：`all`、`query`、`filter`、`loaded`
  - actions：`load()`（fetch index.json）
  - getters：`results`（filter + 搜索 + 排序）、`stats`（总数/分类计数）
- `src/composables/useSearch.js`：
  - 纯函数：输入工具数组 + query → 排序后数组
  - 实现相关度打分（name +100 / tags+keywords +50 / pinyin+abbr +40 / content +10）
  - 多词 AND 匹配
  - 供 store 的 results getter 调用
- **校验**：单元手测——store.load 后 results 随 query/filter 变化

### T5. 核心组件骨架（8 个）
**产出**：`src/components/` 下 8 个 Vue SFC
按依赖顺序：
1. `Toast.vue`（最独立，先做）
2. `EmptyState.vue`（独立）
3. `ToolCard.vue`（props: tool；emit: click）
4. `SearchBox.vue`（v-model 绑 store.query；⌘K 聚焦；Esc 清空）
5. `FilterChips.vue`（读 store.filter / 写 store.filter；显示 stats）
6. `ToolGrid.vue`（读 store.results；遍历渲染 ToolCard；响应式 grid）
7. `AppBar.vue`（logo + SearchBox + actions）
8. `FooterBar.vue`
- 每个组件 `<script setup>` + `<style scoped>`
- 样式对照 `design-demo.html` 取值
- **校验**：组件单独可渲染（可在 App.vue 临时拼装测试）

### T6. 首页视图组装
**产出**：`src/views/HomeView.vue` + `src/App.vue`
- `HomeView.vue`：Hero（标题 + 描述 + stats）+ FilterChips + ToolGrid + EmptyState（无结果时）+ Toast（全局）
- `App.vue`：AppBar + router-view + FooterBar
- `HomeView` 的 `onMounted` 调 `toolsStore.load()`
- **校验**：首页完整渲染，搜索/筛选/空状态/Toast 全链路通

### T7. 工具页视图与路由
**产出**：`src/views/ToolView.vue` + `src/router.js`
- `router.js`：`/` → HomeView，`/tool/:id` → ToolView，`createWebHistory('/hutch/')`
- `ToolView.vue`：
  - 从 route.params.id 取工具
  - runtime=online → `onMounted` `window.open(url, '_blank')` + `router.push('/')`
  - runtime=local + 有 component → `defineAsyncComponent(() => import('../tools/' + component + '.vue'))`
  - status=soon → Toast + `router.push('/')`
  - 顶部返回首页链接
- 写一个最简 `src/tools/JsonFormatter.vue`（占位实现，M1 只验证路由加载，功能 M3 做）
- **校验**：点击 local 卡进入路由，组件加载；online 卡新标签跳转；soon 卡 Toast

### T8. Actions workflows
**产出**：`.github/workflows/build-index.yml` + `deploy.yml`
- `build-index.yml`：
  - 触发：push 到 main 且 `tools/**` 或 `scripts/**` 变更
  - npm ci → node scripts/build-index.mjs → git commit public/index.json → push
- `deploy.yml`：
  - 触发：main 上 `src/`、`public/`、`index.html`、`vite.config.js` 变更，或被 build-index 触发
  - npm ci → npm run build → upload-pages-artifact → deploy-pages
  - permissions：pages: write、id-token: write
- **校验**：本地 `npm run build` 成功；远程部署等仓库建立后 push 验证

### T9. README 与收尾
**产出**：`README.md`
- 项目简介 + 本地开发命令 + 录入流程 + 部署说明
- 链接到 PROJECT/PRD/DESIGN/TECH_DESIGN 四份文档
- **校验**：文档齐全，命令可跑

---

## 3. 文件清单（M1 产出）

```
hutch/
├── .github/workflows/
│   ├── build-index.yml              [T8]
│   └── deploy.yml                   [T8]
├── scripts/
│   └── build-index.mjs              [T3]
├── tools/                           [T3 示例]
│   ├── json-formatter.md
│   ├── regex101.md
│   └── text-assistant.md
├── public/
│   ├── index.json                   [T3 生成]
│   └── icon-set/                    [M3 填充]
├── src/
│   ├── main.js                      [T1+T2]
│   ├── App.vue                      [T6]
│   ├── router.js                    [T7]
│   ├── data/
│   │   └── tools.store.js           [T4]
│   ├── composables/
│   │   └── useSearch.js             [T4]
│   ├── components/
│   │   ├── AppBar.vue               [T5]
│   │   ├── SearchBox.vue            [T5]
│   │   ├── FilterChips.vue          [T5]
│   │   ├── ToolCard.vue             [T5]
│   │   ├── ToolGrid.vue             [T5]
│   │   ├── EmptyState.vue           [T5]
│   │   ├── Toast.vue                [T5]
│   │   └── FooterBar.vue            [T5]
│   ├── views/
│   │   ├── HomeView.vue             [T6]
│   │   └── ToolView.vue             [T7]
│   ├── tools/
│   │   └── JsonFormatter.vue        [T7 占位]
│   ├── styles/
│   │   ├── tokens.css               [T2]
│   │   ├── base.css                 [T2]
│   │   └── animations.css           [T2]
│   └── utils/
│       └── externalLinks.js         [T7]
├── index.html                       [T1]
├── vite.config.js                   [T1]
├── package.json                     [T1]
├── PROJECT.md · PRD.md · DESIGN.md · TECH_DESIGN.md  [M0 已有，搬入仓库]
├── PLAN.md                          [本文档]
└── README.md                        [T9]
```

---

## 4. 依赖关系图

```
T1 脚手架
 ├─→ T2 设计系统
 │    └─→ T5 组件骨架 ──┐
 └─→ T3 构建脚本 ─→ T4 数据层（store + 检索）
                                   └─→ T6 首页组装 ─→ T7 工具页路由 ─→ T8 Actions ─→ T9 README
```

- T2、T3 可并行（都只依赖 T1）
- T4 依赖 T3（需要 index.json 结构）
- T5 依赖 T2（需要 tokens.css）+ T4（组件读 store）
- T6 依赖 T4 + T5
- T7 依赖 T6（复用 App.vue 路由出口）
- T8 可在 T6 后任意时点做（不阻塞本地开发）
- T9 最后

---

## 5. 风险与对策

| 风险 | 对策 |
|---|---|
| Vue Router 子路径 base 配错导致 404 | `vite.config.js` base 与 router history base 一致 = `/hutch/`；本地 dev 用 `/` |
| 动态 import 组件路径错 | ToolView 用 `defineAsyncComponent` + 明确路径映射，加 try/catch Toast |
| Actions 两个 workflow 触发死循环 | build-index 的 commit message 加 `[skip ci]`，deploy 只监听特定路径变更 |
| index.json 未生成时 dev 报错 | `predev` 钩子自动跑 build-index.mjs |
| 设计系统从 demo 搬运遗漏 | T2 用 Grep 对照 design-demo.html 的 `:root` 变量块，逐条核对 |

---

## 6. M1 之后的衔接

M1 完成后进入：
- **M2 首页 MVP 打磨**：视觉细节对齐 demo、动效、快捷键、result-hint、统计、外部链接安全跳转（PRD F-09~F-14 的 P1 项）
- **M3 内容填充**：10+ 工具 md + 对应 Vue 工具页实现（JsonFormatter/QrCode 等真实功能）
- **M4 发布 v1.0**：全量验收 + push 到 GitHub Pages

> M1 聚焦"骨架通"，不追求视觉 100% 还原和功能完整，留给 M2/M3。
