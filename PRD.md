# Hutch · 器舍 — 产品需求文档（PRD）

> 版本：v1.0 · 2026-08-14
> 关联：`PROJECT.md`（项目定义） · `TECH_DESIGN.md`（技术设计） · `DESIGN.md`（设计方案）

---

## 1. 产品概述

### 1.1 背景与动机

日常工具分散在三类来源：
- **本地前端小工具**（JSON 格式化、Base64、二维码、取色、正则测试）——可离线、无依赖。
- **联网 AI 助手**（文本润色/翻译/总结、代码解读、对话 PDF）——需 API、需联网。
- **外部在线服务**（regex101、Excalidraw、remove.bg、Carbon）——第三方站点，只收藏入口。

这些工具散落在浏览器书签、历史记录、各自网址中，每次使用都要"想一下在哪"，调用成本高。Hutch·器舍 把它们收进一个入口，用检索把"找"的耗时从分钟级压到秒级。

### 1.2 目标用户

| 角色 | 描述 | 占比 |
|---|---|---|
| 主用户 | 自己（开发者），高频调用各类工具 | 100% |
| 次用户 | 从 GitHub 访问/fork 的开发者 | 少量 |
| 录入者 | 仅自己一人，维护工具收录 | — |

### 1.3 核心价值主张

> 一个顺手就打开的个人工具箱。即搜即用，push 即发布，录入即写一个 Markdown。

---

## 2. 用户场景与用户故事

### 2.1 场景 A：快速找到本地小工具
> 我有一段 JSON 要格式化。打开 Hutch，输入"json"或"格式化"或"JGSH"（拼音首字母），卡片秒出，点击进入工具页。

### 2.2 场景 B：跳到常用在线服务
> 我想画个流程图。打开 Hutch，输"画图"或"excalidraw"或"EXC"，点击卡片直接跳转 excalidraw.com。

### 2.3 场景 C：发现/试 AI 工具
> 我不知道有哪些 AI 助手。打开 Hutch，点"AI 助手" chip 筛选，浏览占位卡片，看到"AI 文本助手"标注"即将上线"，点击得到 Toast 提示。

### 2.4 场景 D：录入新工具
> 我发现一个好用的在线工具。在 `tools/` 新建一个 md，填 front matter（id/name/category/keywords/url…），写正文说明，`git push`。几秒后 Actions 重建索引，站点更新。

### 2.5 用户故事列表

| 编号 | As a... | I want to... | So that... |
|---|---|---|---|
| US-01 | 主用户 | 用关键词搜索工具 | 秒级找到需要的工具 |
| US-02 | 主用户 | 用拼音/首字母搜索 | 中文输入法下也能快速命中 |
| US-03 | 主用户 | 用英文名搜索 | 记英文工具名时直接命中 |
| US-04 | 主用户 | 在正文中搜索 | 记不清名字但记得功能描述时也能找到 |
| US-05 | 主用户 | 按类型筛选（本地/AI/在线） | 缩小范围快速定位 |
| US-06 | 主用户 | 点击卡片跳转工具页 | 直接使用工具 |
| US-07 | 主用户 | 看到未上线工具的占位 | 知道路线图，不点空 |
| US-08 | 主用户 | 用键盘快捷键聚焦搜索 | 双手不离键盘，更快 |
| US-09 | 主用户 | 看到搜索结果数量 | 了解命中范围 |
| US-10 | 录入者 | 用 Markdown + front matter 录入工具 | 录入即写文档，自然顺手 |
| US-11 | 录入者 | push 后自动发布 | 不用关心构建/部署 |
| US-12 | 次用户 | fork 仓库自用 | 拿走一份定制自己的工具箱 |

---

## 3. 功能需求

优先级：**P0**（MVP 必做） / **P1**（重要，紧随 MVP） / **P2**（未来迭代）。

### 3.1 P0 — MVP 必做

#### F-01 工具检索（首页核心）
- **描述**：搜索框实时检索工具，支持中文/英文/拼音全拼/拼音首字母/关键词/正文内容。
- **匹配规则**：`indexOf` 包含匹配，多词空格分隔 = AND（每个词都要命中）。不做错别字容错。
- **检索字段**：name、nameEn、pinyin、abbr、tags、keywords、content（正文去 md 后纯文本）。
- **验收标准**：
  - [ ] 输入"json"命中"JSON 格式化"。
  - [ ] 输入"JGSH"命中"JSON 格式化"（拼音首字母）。
  - [ ] 输入"格式化"命中"JSON 格式化"。
  - [ ] 输入"json 格式化"命中（多词 AND）。
  - [ ] 输入正文中的词（如"错误高亮"）命中对应工具。
  - [ ] 输入无匹配词时显示空状态。
  - [ ] 搜索响应 < 30ms（首屏，上百工具规模）。

#### F-02 相关度排序
- **描述**：搜索结果按命中维度相关度排序。
- **规则**：name 命中 +100 / tags+keywords 命中 +50 / pinyin+abbr 命中 +40 / content 命中 +10；同分按 pinned DESC, order ASC。
- **验收标准**：
  - [ ] 搜"json"时，name 含"json"的工具排在正文含"json"的工具前。

#### F-03 类型筛选
- **描述**：chip 单选筛选：全部 / 本地前端 / AI 助手 / 在线服务。
- **交互**：与搜索框取交集（筛选后搜索、搜索后筛选都生效）。
- **验收标准**：
  - [ ] 点"本地前端"只显示 runtime=local 的工具。
  - [ ] 筛选 + 搜索同时生效，结果为两者交集。

#### F-04 工具卡片渲染
- **描述**：工具以卡片网格展示，含图标、中文名、英文名、描述、tags、runtime 角标。
- **数据源**：`index.json`（构建期从 `tools/*.md` 生成）。
- **验收标准**：
  - [ ] 卡片信息齐全，无数据缺失。
  - [ ] runtime 角标颜色区分（local 绿 / AI 紫 / online 琥珀）。
  - [ ] soon 工具显示"即将上线"标，点击 Toast 提示不跳转。

#### F-05 工具页跳转
- **描述**：点击 live 卡片：local 工具走 SPA 路由 `/tool/<id>` 加载 `src/tools/<component>.vue`；online 工具新标签跳转外部链接；soon 卡片不跳转，Toast 提示。
- **验收标准**：
  - [ ] live + local 工具点击进入 SPA 路由，组件正确加载。
  - [ ] live + online 工具新标签跳转 `tool.url`（`rel=noopener noreferrer`）。
  - [ ] soon 工具点击弹出 Toast"即将上线"。

#### F-06 Markdown 驱动录入
- **描述**：每个工具一个 `tools/<id>.md`，front matter 固定字段，正文即说明文档。local 工具另在 `src/tools/<Component>.vue` 实现工具页。
- **front matter 字段**：id / name / name_en / category / icon / color / runtime / component / url / tags / keywords / pinned / order / status / desc。
- **验收标准**：
  - [ ] front matter 字段齐全且符合 Schema。
  - [ ] 正文被构建脚本抽进 `index.json` 的 content 字段。
  - [ ] 拼音/首字母由构建期自动生成，录入者不填。
  - [ ] local 工具的 component 字段指向实际存在的 Vue 组件。

#### F-07 构建自动化
- **描述**：push 到 `main` 时，GitHub Actions 两步：①扫描 `tools/*.md` 生成 `public/index.json` ②`vite build` → 部署 `dist/` 到 Pages。
- **验收标准**：
  - [ ] push 后两个 workflow 成功运行。
  - [ ] `index.json` 内容正确（含全部工具 + 拼音 + 正文）。
  - [ ] Pages 站点自动更新（Source = GitHub Actions）。

#### F-08 深色科技风视觉
- **描述**：Material 3 Dark 风格，深色底 + 克制强调色 + 留白 + 卡片化 + 无霓虹光晕。
- **验收标准**：
  - [ ] 配色符合 `DESIGN.md` 设计系统。
  - [ ] 响应式：桌面 ≥3 列、平板 2 列、手机 1 列。
  - [ ] 无发光/光晕效果，仅柔和阴影。

### 3.2 P1 — 重要（紧随 MVP）

| 编号 | 功能 | 描述 | 验收 |
|---|---|---|---|
| F-09 | 快捷键 ⌘K/Ctrl+K | 聚焦搜索框，Esc 清空 | 按键生效，焦点正确 |
| F-10 | 结果计数 | 显示"显示 N / 总 M" | 数字实时更新 |
| F-11 | 外部链接新标签 | online 工具 `target=_blank` + `rel=noopener` | 安全跳转新标签 |
| F-12 | 置顶排序 | pinned 工具默认排前 | 无搜索时 pinned 在前 |
| F-13 | 空状态引导 | 无结果时显示清空筛选按钮 | 点击清空恢复全部 |
| F-14 | 统计概览 | 首页显示工具总数/分类数 | 数字与实际一致 |

### 3.3 P2 — 未来迭代

| 编号 | 功能 | 描述 |
|---|---|---|
| F-15 | PWA 离线 | manifest + Service Worker，缓存首页 + index.json |
| F-16 | 最近使用 | localStorage 记最近点击，首页置顶区 |
| F-17 | 收藏 | localStorage 收藏工具，独立筛选 chip |
| F-18 | AI Copilot | 自然语言"我要做 X"→自动选/编排工具（需后端或 Worker） |
| F-19 | 拼音容错 | 上百工具且需容错时引入 Fuse.js |
| F-20 | 工具页模板化 | 格式化类工具抽成模板批量生成 |

---

## 4. 非功能需求

| 维度 | 要求 |
|---|---|
| **性能** | 首屏检索 < 30ms（上百工具）；index.json 一次加载 < 50KB（gzip） |
| **兼容性** | 现代浏览器最近 2 版（Chrome/Edge/Firefox/Safari）；移动端 Safari/Chrome |
| **可访问性** | 搜索框可达；卡片可键盘聚焦；颜色对比度 ≥ AA |
| **SEO** | 首页有 title/description；每个工具页独立 HTML 可索引（P2 完善） |
| **离线** | MVP 不要求；P2 PWA 实现 |
| **安全** | 外部链接 `rel=noopener noreferrer`；无 XSS（数据来自自有 md，构建期转义） |
| **可维护性** | 录入 = 一个 md 文件；构建脚本 < 200 行；零运行时依赖 |
| **部署** | push 即发布，无需手动操作；Actions 全自动 |

---

## 5. 内容与数据规范

### 5.1 工具分类体系

| category | 含义 | runtime 映射 |
|---|---|---|
| `dev` | 开发类 | 多为 local |
| `ai` | AI 助手 | ai |
| `eff` | 效率类 | local 或 online |
| `nav` | 导航/外部服务 | online |

> category 是工具的内容分类（dev/ai/eff/nav），runtime 是工具的运行形态（local/ai/online）。两者正交：一个 dev 工具可以是 local（本地 JSON 格式化）也可以是 online（regex101）。前端 chip 筛选用 runtime，卡片标签可用 category。

### 5.2 工具状态

| status | 含义 | 卡片表现 |
|---|---|---|
| `live` | 已上线 | 正常渲染，点击跳转 |
| `beta` | 可用但 unstable | 角标标注"beta"（P1） |
| `soon` | 未上线占位 | 透明度降低 + "即将上线"标，点击 Toast |

### 5.3 front matter Schema

见 `TECH_DESIGN.md` 第 3 节。必填：id / name / category / runtime / url / status / desc。其余选填有默认值。

### 5.4 图标规范

- 优先：字符图标（如 `{ }`、`64`、`◉`），等宽字体渲染，免资源依赖。
- 备选：`assets/icon-set/<name>.svg`，front matter `icon` 填 svg 名。
- 颜色：由 `color` 字段驱动（blue/purple/green/amber/red），映射到设计系统色板。

---

## 6. 约束与边界（不做什么）

- ❌ 后端 / 数据库 / 用户登录
- ❌ 运行时增删工具（静态发布即固定）
- ❌ 错别字 / 编辑距离容错检索
- ❌ 跨设备云端同步
- ❌ 非技术用户录入表单
- ❌ file:// 双击可用（Vite 本就要 dev server/build，无此诉求）
- ❌ 多语言切换（中文为主，英文工具名进检索即可）

---

## 7. 验收标准（整体 MVP）

发布 v1.0 前需全部满足：

- [ ] 至少 10 个工具 md 录入，覆盖三类 runtime。
- [ ] 搜索 15 个用例全部命中（中文/英文/拼音/首字母/关键词/正文/多词 AND/无结果）。
- [ ] chip 筛选 + 搜索交集正确。
- [ ] 相关度排序生效。
- [ ] 卡片渲染无缺数据，runtime/soon 角标正确。
- [ ] 跳转：live 跳转、online 新标签、soon Toast。
- [ ] 响应式：桌面/平板/手机三档正常。
- [ ] GitHub Actions 构建成功，index.json 正确。
- [ ] GitHub Pages 访问正常，子路径相对路径无 404。
- [ ] 视觉符合 `DESIGN.md` 设计系统。

---

## 8. 里程碑

| 里程碑 | 内容 | 依赖 |
|---|---|---|
| **M0 设计冻结** | PROJECT/PRD/DESIGN/TECH_DESIGN 定稿 | — |
| **M1 骨架** | 仓库结构、index.html/app.js/styles.css 空架、构建脚本、Actions workflow | M0 |
| **M2 首页 MVP** | 检索 + 筛选 + 卡片 + 跳转 + 视觉落地（F-01~F-08） | M1 |
| **M3 内容填充** | 10+ 工具 md 录入 + 对应工具页 | M2 |
| **M4 发布 v1.0** | 全部验收标准通过，push 到 GitHub Pages | M3 |
| **M5 P1 增强** | 快捷键/计数/置顶/空状态/统计（F-09~F-14） | M4 |
| **M6 P2 迭代** | PWA/最近使用/收藏/AI Copilot | M5+ |

---

## 9. 度量（可选，轻量）

自用项目不强求埋点，但可记录：
- 工具总数增长曲线（看收录进度）。
- index.json 体积（看性能边界）。
- Actions 构建耗时（看构建是否需要优化）。

---

## 10. 风险与对策

| 风险 | 影响 | 对策 |
|---|---|---|
| Actions 构建失败 | 索引不更新，站点内容滞后 | workflow 失败时 PR comment 报错；构建脚本加单测 |
| 上百工具后 index.json 变大 | 首屏加载变慢 | gzip + 按需分片（按 category 拆 index，P2） |
| Markdown 正文格式多样 | 解析后 content 不干净 | 构建脚本严格去 md 符号 + 测试 |
| 拼音库体积 | 构建期依赖变大 | pinyin-pro 仅在构建期用，前端不引入 |
| 外部链接失效 | 卡片点击 404 | 定期巡检脚本（P2） |
