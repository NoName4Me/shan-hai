# 山海之间 · SHAN HAI

基于《山海经》的交互式神话地理舆图与 3D 沉浸体验。

**在线体验：** https://noname4me.github.io/shan-hai/

## 当前进度：V0.3

- 十八卷目录：五藏山经、海外四经、海内四经、大荒四经、海内经。
- 神话舆图：按卷查看地点锚点、原文摘录、方位关系和出处。
- 山经路线：五藏山经五卷各自的首段路线，当前整理 80 个具名节点，保留方向和逐段里程。
- 异兽图鉴：15 条文本记录，可按名称、经卷、所在山名搜索，并按兽、鸟、鱼、龟筛选。
- 3D 试境：青丘之山，使用 Three.js / React Three Fiber；WebGL 不可用时提供二维回退。

**范围声明：** V0.3 只录入五卷山经各自的首段路线，不代表五藏山经全部山系已完成抽取。异兽图鉴也是首批文本条目，不是全书异兽全集。

## 技术栈

React 19 + TypeScript + Vite + Three.js + React Three Fiber + Drei + GSAP + Zustand。无后端、无 3D CDN 依赖。

## 数据原则

1. 原文方向、里程、山名、异兽描述与网页视觉坐标分开保存。
2. 原文的“又东/西/南/北若干里”作为相邻路线关系；不将视觉坐标伪装成经纬度。
3. 篇末总山数、总里程与逐段提取结果分别保留。出现差异时标记待校勘，不擅自改写原文。
4. 同名异物、异文和不同篇章的同名地点分别建档；例如《南山经》的“青丘之山”与《海外东经》的“青丘国”不直接合并。
5. 每条异兽记录保留经卷、所在山名、短引文和原文链接。

路线抽取范围、里程核对表与考据边界见 [docs/ATLAS_DATA.md](docs/ATLAS_DATA.md)。

## GitHub 仓库 About 信息

- **Description：** 基于《山海经》的交互式神话地理舆图与 3D 沉浸体验，包含原文溯源、山系路线、异兽图鉴与可探索场景。
- **Website：** https://noname4me.github.io/shan-hai/
- **Topics：** `shan-hai-jing`、`chinese-mythology`、`chinese-classics`、`threejs`、`react-three-fiber`、`interactive-map`、`digital-humanities`、`mythology`、`vite`、`github-pages`

## 本地开发

需要 Node.js 22。

```bash
npm install
npm run dev
npm run build
```

## GitHub Pages 部署

默认分支为 `master`，工作流位于 `.github/workflows/deploy.yml`。

1. 仓库 Settings → Pages → Build and deployment，Source 设为 **GitHub Actions**。
2. 推送到 `master` 后自动安装依赖、执行 `npm run build` 并发布 `dist`。
3. 站点地址：https://noname4me.github.io/shan-hai/ 。

Vite 构建时设置 `GITHUB_PAGES=true`，自动采用 `/shan-hai/` 基础路径。

## 路线图

- V0.1：世界入口、青丘单场景与 WebGL 兼容回退
- V0.2：十八卷目录、地理锚点、原文出处与局部路线关系
- V0.3：五卷山经首段路线、异兽图鉴、文本溯源
- V0.4：扩展五藏山经其余路线，补齐水系、矿物、植物、祭祀数据
- V0.5：异兽与神祇关系图谱、更多可进入的神话空间
- V1.0：场景流式加载、角色动画、性能等级和移动端优化
