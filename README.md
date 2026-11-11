# 山海之间 · SHAN HAI

基于《山海经》的交互式神话地理舆图与 3D 沉浸体验。

**在线体验：** https://noname4me.github.io/shan-hai/

## 当前进度：V0.4

- **十八卷目录与神话舆图**：按卷查看地点锚点、原文摘录、方位关系和出处。
- **五藏山经路线**：建立五卷 26 段路线索引，当前录入 449 个路线节点，其中包含水行、流沙等 2 条独立特殊路段记录。
- **异兽图鉴**：15 条文本记录，支持关键词搜索和类别筛选。
- **山川水系**：45 条水源、流向、注入水域及山地关联记录。
- **山产志**：33 条植物、矿物与动物物产记录。
- **山中祀典**：26 段路线的神形、牲礼、玉帛、糈米和特殊祭法摘要。
- **3D 试境**：青丘之山，使用 Three.js / React Three Fiber；WebGL 不可用时提供二维回退。

**范围声明：** V0.4 已建立五卷山经全部 26 段路线索引，但路线计数与篇末汇总存在多处差异。449 个路线节点包含特殊路段，不能直接视为 449 座已考定的独立山体。物产、水系和异兽条目均为第一批文本索引，不是全书全集。

## 技术栈

React 19 + TypeScript + Vite + Three.js + React Three Fiber + Drei + GSAP + Zustand。无后端、无 3D CDN 依赖。

## 数据原则

1. 原文山名、方向、里程、物产、水系、异兽和祭祀记录与网页视觉坐标分开保存。
2. “又东/西/南/北若干里”作为相邻路线关系；水行、流沙等特殊路段保留原文，不强行折算为陆路里程。
3. 篇末山数、总里程与逐段提取结果分别保存。出现差异时标记待校勘，不擅自改写原文。
4. 同名异物、异文和不同篇章的同名地点分别建档；例如《南山经》的“青丘之山”与《海外东经》的“青丘国”不直接合并。
5. 水名按出水山、流向、注入水域和篇章分开建档；同名水流不自动合并。
6. 古代物产名称不直接套用现代物种鉴定；古籍中的食用、疗效和征兆记载不作为现代科学结论。
7. 祭祀数据仅作古籍制度史整理，不构成现实祭祀建议。

路线抽取范围、篇末总计核对、物产和水系数据约定见 [docs/ATLAS_DATA.md](docs/ATLAS_DATA.md)。

## GitHub 仓库 About 信息

- **Description：** 基于《山海经》的交互式神话地理舆图与 3D 沉浸体验，包含原文溯源、山系路线、异兽图鉴与可探索场景。
- **Website：** https://noname4me.github.io/shan-hai/
- **Topics：** \`shan-hai-jing\`、\`chinese-mythology\`、\`chinese-classics\`、\`threejs\`、\`react-three-fiber\`、\`interactive-map\`、\`digital-humanities\`、\`textual-hydrology\`、\`mythology\`、\`vite\`、\`github-pages\`

## 本地开发

需要 Node.js 22。

\`\`\`bash
npm install
npm run dev
npm run build
\`\`\`

## GitHub Pages 部署

默认分支为 \`master\`，工作流位于 \`.github/workflows/deploy.yml\`。

1. 仓库 Settings → Pages → Build and deployment，Source 设为 **GitHub Actions**。
2. 推送到 \`master\` 后自动安装依赖、执行 \`npm run build\` 并发布 \`dist\`。
3. 站点地址：https://noname4me.github.io/shan-hai/ 。

Vite 构建时设置 \`GITHUB_PAGES=true\`，自动采用 \`/shan-hai/\` 基础路径。

## 路线图

- V0.1：世界入口、青丘单场景与 WebGL 兼容回退
- V0.2：十八卷目录、地理锚点、原文出处与局部路线关系
- V0.3：五卷山经首段路线、异兽图鉴、文本溯源
- V0.4：五卷山经 26 段路线索引、水系图谱、山产志与山中祀典
- V0.4.1：逐段复核异文、山数、里程与路线层级，补齐物产和水系的来源字段
- V0.5：异兽、山神、水系、物产与祭祀的关系图谱；将文本关系映射为可探索空间
- V1.0：场景流式加载、角色动画、性能等级和移动端优化
