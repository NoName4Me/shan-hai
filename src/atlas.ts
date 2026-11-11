export type ChapterGroupId = 'mountain' | 'overseas' | 'inland' | 'wilderness' | 'final';

export type ChapterGroup = {
  id: ChapterGroupId;
  label: string;
  sublabel: string;
};

export type AtlasChapter = {
  id: string;
  volume: number;
  name: string;
  group: ChapterGroupId;
  summary: string;
};

export type AtlasLocation = {
  id: string;
  chapterId: string;
  name: string;
  english: string;
  sub: string;
  x: number;
  y: number;
  evidenceLabel: string;
  quote: string;
  relation: string;
  note: string;
  sourceUrl: string;
  routeId?: string;
  routeOrder?: number;
  distanceFromPreviousLi?: number;
  sceneId?: 'qingqiu';
};

export const chapterGroups: ChapterGroup[] = [
  { id: 'mountain', label: '山经', sublabel: '五方山系' },
  { id: 'overseas', label: '海外', sublabel: '四方海外' },
  { id: 'inland', label: '海内', sublabel: '四方海内' },
  { id: 'wilderness', label: '大荒', sublabel: '四方大荒' },
  { id: 'final', label: '终篇', sublabel: '海内经' }
];

export const chapters: AtlasChapter[] = [
  { id: 'nanshan-jing', volume: 1, name: '南山经', group: 'mountain', summary: '以南方山系为线索，逐山记载山川走向、水源、物产、异兽与祭祀。' },
  { id: 'xishan-jing', volume: 2, name: '西山经', group: 'mountain', summary: '沿西方山系展开，记录山脉次序、河流源流、珍异物产与山神祭法。' },
  { id: 'beishan-jing', volume: 3, name: '北山经', group: 'mountain', summary: '以北方山系为骨架，串联山川、泽薮、异兽、草木与矿物。' },
  { id: 'dongshan-jing', volume: 4, name: '东山经', group: 'mountain', summary: '记述东方山系及其水道、物产和异象，延续逐山行进的叙述方式。' },
  { id: 'zhongshan-jing', volume: 5, name: '中山经', group: 'mountain', summary: '以中部山系为主体，记录密集的山脉路线、河流分布和山神祭祀。' },
  { id: 'haiwai-nan-jing', volume: 6, name: '海外南经', group: 'overseas', summary: '从海外南方的方位框架展开，记述诸国、异人、神祇与地理标志。' },
  { id: 'haiwai-xi-jing', volume: 7, name: '海外西经', group: 'overseas', summary: '以海外西方为叙述区域，串联异国、神祇、山川和神话人物。' },
  { id: 'haiwai-bei-jing', volume: 8, name: '海外北经', group: 'overseas', summary: '从东北隅至西北隅的方位次序，包含钟山烛阴、相柳等重要神话节点。' },
  { id: 'haiwai-dong-jing', volume: 9, name: '海外东经', group: 'overseas', summary: '从东南隅至东北隅排列诸国与神祇，记有青丘国、朝阳之谷和汤谷扶桑。' },
  { id: 'hainei-nan-jing', volume: 10, name: '海内南经', group: 'inland', summary: '以海内南方为范围，记述国度、山川与人物之间的方位关系。' },
  { id: 'hainei-xi-jing', volume: 11, name: '海内西经', group: 'inland', summary: '记录海内西南一带的地理关系，并详述昆仑之虚、河流源头与诸国方位。' },
  { id: 'hainei-bei-jing', volume: 12, name: '海内北经', group: 'inland', summary: '以海内北方为叙述范围，记载山川、国度、神异与相互方位。' },
  { id: 'hainei-dong-jing', volume: 13, name: '海内东经', group: 'inland', summary: '以海内东方为线索，记录河流、山川、国度和海域之间的联系。' },
  { id: 'dahuang-dong-jing', volume: 14, name: '大荒东经', group: 'wilderness', summary: '进入东方大荒，展开日出、神木、古国与远方神祇的叙事。' },
  { id: 'dahuang-nan-jing', volume: 15, name: '大荒南经', group: 'wilderness', summary: '以南方大荒为背景，记载神祇、古国、异兽和天地边远之境。' },
  { id: 'dahuang-xi-jing', volume: 16, name: '大荒西经', group: 'wilderness', summary: '记述西北海之外的大荒边隅、不周山及相关神话地理。' },
  { id: 'dahuang-bei-jing', volume: 17, name: '大荒北经', group: 'wilderness', summary: '铺展北方大荒的山泽、古国、神祇与极远之地。' },
  { id: 'hainei-jing', volume: 18, name: '海内经', group: 'final', summary: '以综合性篇章收束全书，串联海内外山川、古国族群、神祇谱系、技术起源与鲧禹治水叙事。' }
];

export const locations: AtlasLocation[] = [
  {
    id: 'jishan',
    chapterId: 'nanshan-jing',
    name: '基山',
    english: 'JI MOUNTAIN',
    sub: '南山经 · 青丘路线前一站',
    x: 53,
    y: 66,
    evidenceLabel: '原文路线节点',
    quote: '又东三百里，曰基山，其阳多玉，其阴多怪木。',
    relation: '原文以“又东三百里”记载其相对前一山的位置。',
    note: '这里仅保留原文的行进次序与里程，不据此推定现代地理坐标。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/南山經',
    routeId: 'que-shan-first',
    routeOrder: 1,
    distanceFromPreviousLi: 300
  },
  {
    id: 'qingqiu-mountain',
    chapterId: 'nanshan-jing',
    name: '青丘之山',
    english: 'QINGQIU MOUNTAIN',
    sub: '南山经 · 九尾狐所在',
    x: 68,
    y: 64,
    evidenceLabel: '原文路线节点',
    quote: '又东三百里，曰青丘之山……有兽焉，其状如狐而九尾。',
    relation: '由基山向东三百里。原文另记英水出于此山，南流注于即翼之泽。',
    note: '这是《南山经》中的山名。它与《海外东经》的“青丘国”是两个不同文本条目，现阶段不将二者合并为同一地点。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/南山經',
    routeId: 'que-shan-first',
    routeOrder: 2,
    distanceFromPreviousLi: 300,
    sceneId: 'qingqiu'
  },
  {
    id: 'jiwei',
    chapterId: 'nanshan-jing',
    name: '箕尾之山',
    english: 'JIWEI MOUNTAIN',
    sub: '南山经 · 临东海',
    x: 83,
    y: 66,
    evidenceLabel: '原文路线节点',
    quote: '又东三百五十里，曰箕尾之山，其尾踆于东海。',
    relation: '由青丘之山向东三百五十里。',
    note: '这里呈现的是文本中的相邻关系；图上距离不按三百五十里比例绘制。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/南山經',
    routeId: 'que-shan-first',
    routeOrder: 3,
    distanceFromPreviousLi: 350
  },
  {
    id: 'kunlun',
    chapterId: 'hainei-xi-jing',
    name: '昆仑之虚',
    english: 'KUNLUN VOID',
    sub: '海内西经 · 帝之下都',
    x: 27,
    y: 39,
    evidenceLabel: '原文方位描述',
    quote: '海内昆仑之虚，在西北，帝之下都。昆仑之虚，方八百里，高万仞。',
    relation: '原文明言“在西北”，并记其规模与神异结构。',
    note: '“西北”是文本方位信息；地图上的点位仅用于视觉导航，不等同于现代地理定位。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/山海經/海內西經'
  },
  {
    id: 'zhongshan',
    chapterId: 'haiwai-bei-jing',
    name: '钟山',
    english: 'ZHONG MOUNTAIN',
    sub: '海外北经 · 烛阴居所',
    x: 56,
    y: 24,
    evidenceLabel: '原文相对方位',
    quote: '锺山之神名曰烛阴……在无启之东……居锺山下。',
    relation: '烛阴居钟山下；钟山位于无启之国以东。',
    note: '这里展示的是神祇与地点的文本关联，并不把“钟山”强行对应到现代同名山脉。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/山海經/海外北經'
  },
  {
    id: 'buzhou',
    chapterId: 'dahuang-xi-jing',
    name: '不周山',
    english: 'BUZHOU MOUNTAIN',
    sub: '大荒西经 · 西北海之外',
    x: 15,
    y: 18,
    evidenceLabel: '原文区域描述',
    quote: '西北海之外，大荒之隅，有山而不合，名曰不周。',
    relation: '位于“西北海之外，大荒之隅”。',
    note: '原文给出的是宏观区域描述，地图点位属于概念性排布。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/山海經/大荒西經'
  },
  {
    id: 'qingqiu-country',
    chapterId: 'haiwai-dong-jing',
    name: '青丘国',
    english: 'QINGQIU COUNTRY',
    sub: '海外东经 · 海外诸国',
    x: 76,
    y: 51,
    evidenceLabel: '原文相对方位',
    quote: '青丘国在其北，其人食五谷，衣丝帛。',
    relation: '承接朝阳之谷等条目，原文另有“一曰在朝阳北”的异文。',
    note: '这是《海外东经》的“青丘国”，与《南山经》的“青丘之山”分卷记载，不能仅凭同名就认定为同一地点。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/山海經/海外東經'
  },
  {
    id: 'fusang',
    chapterId: 'haiwai-dong-jing',
    name: '扶桑',
    english: 'FUSANG',
    sub: '海外东经 · 生于汤谷',
    x: 89,
    y: 39,
    evidenceLabel: '原文相对方位',
    quote: '下有汤谷。汤谷上有扶桑，十日所浴……',
    relation: '原文记在黑齿国以北，扶桑生于汤谷之上，居水中。',
    note: '地图锚点以扶桑为名；关系图谱将汤谷（水域）与扶桑（神木）拆分为两个实体。',
    sourceUrl: 'https://zh.wikisource.org/zh-hans/山海經/海外東經'
  }
];

export const atlasMethodNote = '地图坐标是界面排布用的示意坐标，不是经纬度或历史地理复原。只有标注“原文路线节点”的金色连线，才表示原文明确记载的相邻行进方向与里程；其视觉长度不按里数比例绘制。';
