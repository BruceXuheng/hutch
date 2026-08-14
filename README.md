# Hutch · 器舍

> 一个顺手就打开的个人工具箱：本地前端工具、联网 AI 助手、精选在线服务，统一入口。
> 关键词 + 正文中英文检索，即搜即用。

## 技术栈

- **Vite + Vue 3**（`<script setup>` SFC）
- **Vue Router 4** + **Pinia**
- **GitHub Actions**：扫描 `tools/*.md` 生成 `index.json` → `vite build` → 部署到 GitHub Pages
- 设计系统：Material 3 Dark + 科技感，详见 `DESIGN.md`

## 本地开发

```bash
npm install      # 安装依赖（含 gray-matter / pinyin-pro 用于构建索引）
npm run dev      # 启动 dev server（http://localhost:5173，热更新）
npm run build    # 生产构建到 dist/（构建前自动重新生成 index.json）
npm run preview  # 预览生产构建
```

> `dev` / `build` 前会自动跑 `node scripts/build-index.mjs` 生成 `public/index.json`，所以不用手动跑。

## 录入一个新工具

1. 在 `tools/` 新建 `<id>.md`，按 `tools/json-formatter.md` 的 front matter 格式填写（id / name / name_en / category / icon / color / runtime / component / url / tags / keywords / pinned / order / status / desc），正文即说明文档。
2. 按工具类型：
   - **online 工具**：front matter 填 `url`，无需写组件。
   - **local 工具**：填 `component`（Vue 组件名），在 `src/tools/<Component>.vue` 实现功能。
   - **AI 工具**：先 `status: soon` 占位，后续实现时建组件改 `live`。
3. `git push`。Actions 自动重建索引 + 构建部署，Pages 自动更新。

> 拼音全拼 / 首字母缩写由构建脚本自动生成，录入时不用填。

## 部署（GitHub Pages）

1. 仓库 Settings → Pages → Source 选 **GitHub Actions**。
2. 推送到 `main`，`.github/workflows/build-and-deploy.yml` 自动构建并部署。
3. 访问 `https://<用户名>.github.io/<仓库名>/`。

> 仓库名为 `hutch`，`vite.config.js` 的 `base` 已设为 `/hutch/`。若仓库名不同，改 `vite.config.js` 的 `base`（router 自动跟随 `import.meta.env.BASE_URL`）。

## 文档

| 文档 | 内容 |
|---|---|
| `PROJECT.md` | 项目定义、定位、目标用户 |
| `PRD.md` | 产品需求、功能列表、验收标准、里程碑 |
| `DESIGN.md` | 视觉设计系统、组件设计、交互规范 |
| `TECH_DESIGN.md` | 技术架构、目录结构、构建流程、检索算法 |
| `PLAN.md` | M1 骨架开发规划 |

## 当前进度

- [x] **M1 骨架**：Vite+Vue 项目搭建、设计系统、检索、首页、工具页路由、Actions
- [ ] **M2 首页打磨**：视觉细节、动效、快捷键、统计
- [ ] **M3 内容填充**：10+ 工具实现
- [ ] **M4 发布 v1.0**
