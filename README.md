# 山海之间 · SHAN HAI

基于《山海经》的交互式神话地理舆图与 3D 沉浸体验实验。

## 当前进度：V0.2

- 十八卷目录：五藏山经、海外四经、海内四经、大荒四经、海内经。
- 交互舆图：按卷切换高亮地点，查看原文摘录、方位关系和来源。
- 南山经局部路线：基山 → 青丘之山 → 箕尾之山，展示原文明载的东行里程。
- 区分《南山经》的“青丘之山”与《海外东经》的“青丘国”，不因同名而合并。
- 已有 3D 试境：青丘之山；其余地点暂为文献锚点，尚未开放 3D 场景。

## 技术栈

React 19 + TypeScript + Vite + Three.js + React Three Fiber + Drei + GSAP + Zustand。无后端、无 3D CDN 依赖。

## 数据原则

地图视觉坐标是示意排布，不是经纬度或历史地理复原。只有标注为“原文路线节点”的金色连线表示文本明确记载的相邻路线方向和里程，连线视觉长度不按里数比例绘制。每个已录入地点都保留原文短引与来源链接。

数据结构和考据边界见 [docs/ATLAS_DATA.md](docs/ATLAS_DATA.md)。

## 本地开发

需要 Node.js 22。

\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`

## 部署 GitHub Pages

默认分支为 \`master\`，工作流在 \`.github/workflows/deploy.yml\`。

1. 在仓库 Settings → Pages → Build and deployment 中将 Source 设为 **GitHub Actions**。
2. 推送到 \`master\` 后自动执行依赖安装、\`npm run build\` 并发布 \`dist\`。
3. 站点：https://noname4me.github.io/shan-hai/ 。

Vite 构建时设置 \`GITHUB_PAGES=true\`，自动采用 \`/shan-hai/\` 基础路径。本地开发和其他静态托管平台使用 \`/\`。

## 路线

- V0.1：世界入口、青丘单场景与 WebGL 兼容回退
- V0.2：十八卷目录、地理锚点、原文出处与局部路线关系
- V0.3：异兽/神祇图鉴、场景联动与更多可进入的神话空间
- V1.0：场景流式加载、角色动画、性能等级和移动端优化
