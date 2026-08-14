# Hutch · 器舍 — 设计方案

> 版本：v1.0 · 2026-08-14
> 风格：深色科技风 · Material Design 3 Dark
> 关联：`PROJECT.md` · `PRD.md` · `TECH_DESIGN.md` · `design-demo.html`

---

## 1. 设计理念

### 1.1 一句话

> 一个顺手就打开的工具柜——深色、安静、克制，像打开一个装满趁手工具的储物柜，不张扬，但什么都在它该在的位置。

### 1.2 设计原则

| 原则 | 说明 |
|---|---|
| **深色优先** | 全站深色底，护眼、聚焦内容、科技感基底 |
| **克制强调** | 不堆霓虹光晕，强调色只在 hover/聚焦/关键标识处点缀 |
| **留白即层次** | 靠间距和留白区分层级，而非粗边框和重阴影 |
| **卡片化** | 工具以卡片为单元，圆角、柔和阴影、悬浮微反馈 |
| **科技感细节** | 等宽字符图标容器、极淡背景网格线、几何线条——克制地体现"技术工具"气质 |
| **Google 感** | Material 3 语言：圆角、pill 搜索、色彩克制、Roboto/Inter 字族、卡片留白 |

### 1.3 反例（明确不做）

- ❌ 霓虹光晕 / 发光边框 / 粒子动画
- ❌ 渐变背景 / 噪点纹理 / 毛玻璃大面积铺
- ❌ 重阴影 / 深浮雕
- ❌ 花哨图标 / 拟物图标
- ❌ 多色彩虹配色

---

## 2. 视觉设计系统

### 2.1 色彩

#### 表面与文字

| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#0d0e11` | 页面底色 |
| `--surface` | `#16181d` | 卡片底 |
| `--surface-2` | `#1d2026` | hover/二级面 |
| `--surface-3` | `#23262e` | 图标容器/三级面 |
| `--outline` | `#2a2d35` | 默认边框 |
| `--outline-2` | `#3c4043` | hover/强边框 |
| `--on-surface` | `#e3e3e6` | 主文字 |
| `--on-surface-2` | `#9aa0a6` | 次文字 |
| `--on-surface-3` | `#5f6368` | 弱文字/占位 |

#### 强调色（克制使用）

| Token | 值 | 用途 |
|---|---|---|
| `--primary` | `#8ab4f8` | Google 蓝，主强调 |
| `--primary-2` | `#4285f4` | 深蓝，logo/active |
| `--tertiary` | `#c58fff` | AI 类工具（克制紫） |
| `--success` | `#81c995` | local 类（绿） |
| `--warning` | `#fdd663` | online/beta（琥珀） |
| `--danger` | `#f28b82` | red 类工具/错误 |

#### 工具卡片配色映射

| color 字段 | CSS 变量 | 用于 |
|---|---|---|
| `blue` | `--primary` | 开发类默认 |
| `purple` | `--tertiary` | AI 类 |
| `green` | `--success` | 效率/本地类 |
| `amber` | `--warning` | 在线/导肈类 |
| `red` | `--danger` | 特殊/取色类 |

### 2.2 字体

| 用途 | 字族 | 说明 |
|---|---|---|
| 正文/UI | `Inter, "Google Sans", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif` | 主字族，中文回退苹方 |
| 等宽 | `"JetBrains Mono", "SF Mono", "Cascadia Code", Consolas, monospace` | 图标容器、英文工具名、tag、kbd |

**字阶**：

| 层级 | 字号 | 字重 | 行高 | 用途 |
|---|---|---|---|---|
| H1 | 32px | 600 | 1.2 | 首页 hero 标题 |
| H3 | 16px | 600 | 1.4 | 卡片标题、空状态标题 |
| Body | 15px | 400 | 1.5 | 搜索框、hero 描述 |
| Body-2 | 13px | 400 | 1.55 | 卡片描述、chip、result-hint |
| Caption | 12px | 400 | 1.4 | footer |
| Label | 11px | 500 | 1.2 | tag、runtime 角标、英文名、kbd |

### 2.3 形状（圆角）

| 组件 | 圆角 |
|---|---|
| App bar logo mark | 10px |
| 图标容器 | 12px |
| 卡片 | 16px |
| Chip | 20px |
| 搜索框（pill） | 28px |
| Toast | 12px |
| Tag / kbd / badge | 6-8px |

### 2.4 层次（阴影）

| Token | 值 | 用途 |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(0,0,0,.3), 0 1px 3px rgba(0,0,0,.15)` | 卡片默认（实际默认无边框阴影，hover 才上） |
| `--shadow-2` | `0 4px 12px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.2)` | 卡片 hover、Toast |

> **无发光**：不使用 `box-shadow: 0 0 Npx color` 形式的彩色光晕。

### 2.5 间距

| Token | 值 | 用途 |
|---|---|---|
| `--space-1` | 4px | 紧凑（icon 与文字） |
| `--space-2` | 8px | chip 间隙、tag 间隙 |
| `--space-3` | 12px | 卡片内组件间距 |
| `--space-4` | 16px | 网格 gap、卡片内主要间距 |
| `--space-5` | 20px | 卡片 padding、filter bar padding |
| `--space-6` | 24px | app bar padding、hero padding |
| `--space-7` | 32px | toast bottom |
| `--space-8` | 48px | hero top padding |

### 2.6 动效

| 元素 | 属性 | 时长 | 缓动 |
|---|---|---|---|
| 卡片 hover | transform/border/background/box-shadow | 150ms | ease |
| 搜索框聚焦 | border/background/box-shadow | 150ms | ease |
| Chip 切换 | background/border/color | 150ms | ease |
| Toast 入场 | opacity/transform | 200ms | ease |
| 卡片左侧强调条 | opacity | 150ms | ease |

> 全部 150-200ms，克制不花哨。无弹簧、无弹跳、无粒子。

---

## 3. 组件设计

> 组件对应 Vue SFC，位于 `src/components/` 与 `src/views/`。每个组件用 `<script setup>`，样式 `<style scoped>` + 共享 token 变量。交互逻辑通过 Pinia store（`tools` store）驱动，组件只读 store + 派发 action，保持单向数据流。映射见下文每个组件末尾的"对应文件"。

### 3.1 App Bar（顶栏）

```
┌─────────────────────────────────────────────────────────────┐
│ [N] Hutch·器舍   [🔍 搜索框................. ⌘K]   [GH][🌙] │
└─────────────────────────────────────────────────────────────┘
64px 高，sticky，半透明背景 + backdrop-blur
```

- **左侧**：logo mark（蓝渐变方块 + "N"）+ 文字"Hutch·器舍"
- **中间**：pill 搜索框，`flex:1, max-width:560px`，左侧搜索图标，右侧 ⌘K kbd 提示
- **右侧**：GitHub 图标按钮 + 主题按钮（P2 主题切换预留）
- 移动端：隐藏 logo 文字和次要按钮，搜索框占满

### 3.2 Hero（首页主标题区）

```
一个顺手就打开的个人工具箱
本地前端工具、联网 AI 助手、精选在线服务，统一入口。关键词 + 正文中英文检索，即搜即用。
12 个工具 · 5 本地 · 3 AI · 4 在线
```

- H1 32px，"顺手"二字用 `--primary` 强调
- 描述 15px `--on-surface-2`
- 统计行 13px `--on-surface-3`，数字用 `--on-surface` 加粗

### 3.3 过滤 Chips（筛选条）

```
[● 全地 12] [● 本地前端 5] [● AI 助手 3] [● 在线服务 4]          显示 12 / 12
```

- 单选 chip，高 36px，圆角 20px
- active：`rgba(primary,.12)` 底 + primary 边框 + primary 文字
- 左侧圆点颜色对应 runtime 类别色
- 右侧 result-hint 显示"显示 N / 总 M"
- spacer 撑开，hint 右对齐

### 3.4 工具卡片（核心单元）

```
┌──────────────────────────────┐
│                    [● 本地] │  ← runtime 角标（右上）
│ ┌──┐  JSON 格式化            │
│ │{}│  JSON Formatter         │  ← 图标容器 + 中英文名
│ └──┘                         │
│                              │
│ 校验、压缩与可视化 JSON 数据，│  ← 描述（2 行截断）
│ 支持错误高亮与路径提取。     │
│                              │
│ [json] [格式化] [校验]       │  ← tags（最多 3 个）
└──────────────────────────────┘
```

- 默认：`--surface` 底 + `--outline` 边框，无边框阴影
- hover：`translateY(-2px)` + `--surface-2` + `--outline-2` 边框 + `--shadow-2` + 左侧 3px 强调条出现
- 图标容器：44×44，圆角 12px，`--surface-3` 底 + `--outline` 边框，等宽字 18px，颜色 = card color
- 卡片标题 15px/600 + 英文名 11px mono `--on-surface-3`
- 描述 13px `--on-surface-2`，2 行截断（`-webkit-line-clamp:2`）
- tags 11px mono，`--bg` 底 + `--outline` 边框

#### soon 占位卡片

- 整卡 `opacity:.65`
- 图标颜色降为 `--on-surface-3`
- 右上角换"即将上线"琥珀标（替代 runtime 角标）
- 点击不跳转，弹 Toast

### 3.5 空状态

```
        ∅
没有找到匹配的工具
试试换个关键词，或清除筛选条件。
[清除筛选]
```

- 居中，padding 80px
- 圆形图标容器 64×64 + "∅" 等宽字符
- H3 16px + 描述 13px + 清空按钮

### 3.6 Toast

```
● 敬请期待
```

- 底部居中浮出，12px 圆角，`--surface-3` + `--outline-2` + `--shadow-2`
- 左侧圆点 + 文字
- 入场 200ms，自动 2.2s 消失

### 3.7 Footer

```
Nexus · 方案 A 样式设计 demo · Material 3 Dark        数据来自 index.json · 技术设计
```

- 顶边框 `--outline`，12px 文字 `--on-surface-3`
- 左右两端对齐，移动端堆叠

---

## 4. 交互设计

### 4.1 搜索交互

| 事件 | 行为 |
|---|---|
| 输入文字 | 实时过滤 + 相关度排序 + 重渲染（debounce 不必要，`indexOf` 足够快） |
| 多词（空格分隔） | AND 匹配，每个词都要命中 |
| Esc（聚焦时） | 清空搜索框 + 恢复全部 |
| ⌘K / Ctrl+K | 聚焦搜索框 + 全选 |
| 无输入 | 显示全部（按 pinned + order 排序） |

### 4.2 筛选交互

| 事件 | 行为 |
|---|---|
| 点击 chip | 切换该筛选，其余取消 active |
| 筛选 + 搜索 | 取交集，两者都生效 |
| 筛选下无结果 | 显示空状态（带清空按钮，清空时仅清搜索保留筛选） |

### 4.3 卡片交互

| 工具状态 | 点击行为 |
|---|---|
| live + local | 跳转 `./pages/<id>.html`（当前页） |
| live + online | 跳转外部链接，`target=_blank, rel=noopener noreferrer`（P1） |
| soon | 不跳转，Toast"即将上线，敬请期待" |

### 4.4 hover 反馈

- 卡片：上浮 2px + 边框加重 + 左侧强调条 + 阴影
- chip：边框加重 + 文字变亮
- icon-btn：背景变 `--surface-2` + 文字变亮

### 4.5 键盘支持

| 快捷键 | 行为 |
|---|---|
| `⌘K` / `Ctrl+K` | 聚焦搜索框 |
| `Esc`（搜索聚焦时） | 清空搜索 |
| `Tab` | 焦点流转（卡片可聚焦，P1 完善） |

---

## 5. 响应式设计

| 断点 | 布局 |
|---|---|
| ≥1024px（桌面） | 网格 `auto-fill, minmax(280px,1fr)`，通常 3-4 列 |
| 720-1023px（平板） | 网格 2 列 |
| <720px（手机） | 网格 1 列；隐藏 logo 文字 + 次要按钮；hero 字号降到 24px |

**移动端适配**：
- app bar padding 减到 16px
- logo 文字隐藏（只留 logo mark）
- actions 只留主按钮
- hero padding 减小，H1 降到 24px
- grid 单列，padding 减小

---

## 6. 信息架构

### 6.1 首页 `/`

```
App Bar
├── Hero（标题 + 描述 + 统计）
├── Filter Bar（chips + result-hint）
└── Grid（工具卡片网格）
    └── 空状态（无结果时）
Footer
```

### 6.2 工具页 `./pages/<id>.html`

> MVP 阶段每个工具独立 HTML，由录入者自行实现页面内容。后续可抽模板（P2）。

统一框架（可选）：
- 复用首页的 app bar + 样式
- 主体 = 工具实际功能
- 顶部返回首页链接

### 6.3 路由

- 首页：`/`（子路径 `/<repo>/`）
- 工具页：`tool.url` 指向 `./pages/<id>.html`，直接访问可分享

---

## 7. 文案规范

### 7.1 语气

- 简洁、直接、不卖弄
- 中文为主，技术术语保留英文
- 不用感叹号、不用营销腔

### 7.2 固定文案

| 位置 | 文案 |
|---|---|
| Hero 标题 | 一个顺手就打开的个人工具箱 |
| Hero 描述 | 本地前端工具、联网 AI 助手、精选在线服务，统一入口。关键词 + 正文中英文检索，即搜即用。 |
| 搜索框 placeholder | 搜索工具名、关键词、拼音首字母… |
| 空状态标题 | 没有找到匹配的工具 |
| 空状态描述 | 试试换个关键词，或清除筛选条件。 |
| 空状态按钮 | 清除筛选 |
| soon Toast | 「<工具名>」即将上线，敬请期待 |
| 跳转 Toast（demo） | 跳转到：<url> |

### 7.3 chip 文案

- 全部 / 本地前端 / AI 助手 / 在线服务

---

## 8. 图标策略

### 8.1 字符图标（优先）

| 工具类型 | 字符示例 |
|---|---|
| JSON | `{ }` |
| Base64 | `64` |
| 二维码 | `▣` |
| 取色 | `◉` |
| 正则 | `/.*/` |
| AI 文本 | `✦` |
| AI 代码 | `</>` |
| 外部链接 | `🔗` 或首字母 |

优点：零资源依赖、等宽字体统一、深色底清晰、科技感。

### 8.2 SVG 图标（备选）

- 放 `assets/icon-set/<name>.svg`
- front matter `icon` 填 svg 名（不带扩展）
- 单色，`currentColor` 继承

---

## 9. 可访问性（A11y）

| 项 | 要求 |
|---|---|
| 对比度 | 文字与背景 ≥ 4.5:1（AA），主文字 `#e3e3e6` on `#0d0e11` 通过 |
| 焦点 | 搜索框、chip、卡片可键盘聚焦，焦点环可见 |
| ARIA | 搜索框 `role=search`；chip `role=tab`；卡片 `role=link` |
| 字号 | 最小 11px（仅 label/caption），正文 ≥ 13px |

---

## 10. 落地参考

设计系统（色彩/字体/形状/层次/间距/动效）已在本方案定稿，并在 `design-demo.html` 完成视觉验证（纯 HTML/CSS 原型，用于敲定视觉风格，非最终产物）。

Vue 实现阶段，`design-demo.html` 作为视觉对照基准：
- 所有 CSS 变量值（色彩/字号/圆角/阴影/间距）直接搬进 `src/styles/tokens.css`
- 组件 DOM 结构与类名对应到 Vue SFC（App Bar / SearchBox / FilterChips / ToolCard / EmptyState / Toast）
- 交互逻辑从 demo 里的命令式 JS 迁移到 Pinia store + computed

```bash
cd /Users/chenxuheng3/.joycode/workspace/personal-toolbox-design && open design-demo.html
```

---

## 11. 设计交付清单

- [x] 设计系统（色彩/字体/形状/层次/间距/动效）
- [x] 组件设计（7 个核心组件）
- [x] 交互设计（搜索/筛选/卡片/键盘）
- [x] 响应式（3 断点）
- [x] 信息架构（首页 + 工具页）
- [x] 文案规范
- [x] 图标策略
- [x] 可访问性
- [x] 样式 demo（design-demo.html）
