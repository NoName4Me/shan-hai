# 山海之间 · SHAN HAI

基于《山海经》的交互式神话地理舆图与 3D 沉浸体验实验。

## 当前进度：V0.1

- 可交互的世界概念舆图（入口：青丘）
- **青丘之山** Three.js / React Three Fiber 3D 场景（山峦、森林、九尾狐、雾效、微光）
- 鼠标拖动/触摸环视、滚轮缩放、点击九尾狐查看《南山经》文献线索
- 昆仑、钟山、扶桑、不周山等场景的后续入口占位

注意：地形、方位与人物造型均为艺术性重构，不表示《山海经》原文可以确定的现代地理坐标。首版是交互与美术技术验证，不是十八卷地理考证的最终成果。

## 技术栈

React 19 + TypeScript + Vite + Three.js + React Three Fiber + Drei + GSAP + Zustand。无后端、无 3D CDN 依赖。界面标题字体优先使用本地宋体，网络可用时会加载 Noto Serif SC。

## 本地开发

需要 Node.js 22。

```bash
npm install
npm run dev
npm run build
```

## 部署 GitHub Pages

默认分支为 `master`，工作流在 `.github/workflows/deploy.yml`。

1. 在仓库 Settings → Pages → Build and deployment 中将 Source 设为 **GitHub Actions**（首次部署需要此操作）。
2. 此后每次推送到 `master` 自动执行 `npm ci`、`npm run build`、发布 `dist`。
3. 站点预期地址：https://noname4me.github.io/shan-hai/ 。

Vite 构建时设置 `GITHUB_PAGES=true`，自动采用 `/shan-hai/` 基础路径。本地开发和其他静态托管平台使用 `/`。

## 路线

- V0.1：可运行的世界入口和青丘单场景
- V0.2：十八卷的地理数据结构与原文溯源
- V0.3：昆仑、汤谷扶桑等更多神话场景与动线
- V1.0：场景流式加载、动画角色、性能等级和移动端优化
