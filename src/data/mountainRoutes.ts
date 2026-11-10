export type RouteDirection = '东' | '西' | '西南' | '北' | '南' | '东北' | '东南' | '西北';

export type MountainNode = {
  id: string;
  name: string;
  direction?: RouteDirection;
  distanceLi?: number;
  creatureIds?: string[];
  kind?: '山' | '路段';
  distanceText?: string;
  resourceSummary?: string;
  riverIds?: string[];
};

export type MountainRoute = {
  id: string;
  chapterId: string;
  chapterName: string;
  sectionName: string;
  routeName: string;
  sourceUrl: string;
  reportedMountainCount: number | null;
  reportedTotalLi: number | null;
  sumOfRecordedIntervalsLi: number;
  auditNote: string;
  nodes: MountainNode[];
};

const v03Routes: MountainRoute[] = [
  {
    id: 'south-que',
    chapterId: 'nanshan-jing',
    chapterName: '南山经',
    sectionName: '䧿山之首',
    routeName: '南方山系 · 䧿山之首',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    reportedMountainCount: 10,
    reportedTotalLi: 2950,
    sumOfRecordedIntervalsLi: 2700,
    auditNote: '篇末记“凡十山，二千九百五十里”；当前逐段识别到九个具名山节点，已录距离合计二千七百里。山数与里数均有差异，保留原文总计与逐段记录，待版本校勘。',
    nodes: [
      { id: 'south-zhaoyao', name: '招摇之山' },
      { id: 'south-tangting', name: '堂庭之山', direction: '东', distanceLi: 300 },
      { id: 'south-yuanyi', name: '猨翼之山', direction: '东', distanceLi: 380 },
      { id: 'south-niuyang', name: '杻阳之山', direction: '东', distanceLi: 370, creatureIds: ['lushu', 'xuangu'] },
      { id: 'south-dishan', name: '柢山', direction: '东', distanceLi: 300 },
      { id: 'south-danruan', name: '亶爰之山', direction: '东', distanceLi: 400 },
      { id: 'south-jishan', name: '基山', direction: '东', distanceLi: 300, creatureIds: ['boyi'] },
      { id: 'south-qingqiu', name: '青丘之山', direction: '东', distanceLi: 300, creatureIds: ['jiuweihu', 'guanguan', 'chiru'] },
      { id: 'south-jiwei', name: '箕尾之山', direction: '东', distanceLi: 350 }
    ]
  },
  {
    id: 'west-hua',
    chapterId: 'xishan-jing',
    chapterName: '西山经',
    sectionName: '华山之首',
    routeName: '西方山系 · 华山之首',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/西山經',
    reportedMountainCount: 19,
    reportedTotalLi: 2957,
    sumOfRecordedIntervalsLi: 3045,
    auditNote: '篇末记十九山、二千九百五十七里；按当前逐段里程相加为三千零四十五里，相差八十八里。保留两组原文数据，不用计算值覆盖篇末总计。',
    nodes: [
      { id: 'west-qianlai', name: '钱来之山' },
      { id: 'west-songguo', name: '松果之山', direction: '西', distanceLi: 45 },
      { id: 'west-taihua', name: '太华之山', direction: '西', distanceLi: 60 },
      { id: 'west-xiaohua', name: '小华之山', direction: '西', distanceLi: 80 },
      { id: 'west-fuyu', name: '符禺之山', direction: '西', distanceLi: 80 },
      { id: 'west-shicui', name: '石脆之山', direction: '西', distanceLi: 60 },
      { id: 'west-ying', name: '英山', direction: '西', distanceLi: 70, creatureIds: ['feiyi-bird'] },
      { id: 'west-zhu', name: '竹山', direction: '西', distanceLi: 52 },
      { id: 'west-fu', name: '浮山', direction: '西', distanceLi: 120 },
      { id: 'west-yuci', name: '羭次之山', direction: '西', distanceLi: 70 },
      { id: 'west-shi', name: '时山', direction: '西', distanceLi: 150 },
      { id: 'west-nan', name: '南山', direction: '西', distanceLi: 170 },
      { id: 'west-dashi', name: '大时之山', direction: '西', distanceLi: 408 },
      { id: 'west-bozhong', name: '嶓冢之山', direction: '西', distanceLi: 320 },
      { id: 'west-tiandi', name: '天帝之山', direction: '西', distanceLi: 350 },
      { id: 'west-gaotu', name: '臯涂之山', direction: '西南', distanceLi: 380 },
      { id: 'west-huang', name: '黄山', direction: '西', distanceLi: 180 },
      { id: 'west-cui', name: '翠山', direction: '西', distanceLi: 200 },
      { id: 'west-gui', name: '騩山', direction: '西', distanceLi: 250 }
    ]
  },
  {
    id: 'north-danhu',
    chapterId: 'beishan-jing',
    chapterName: '北山经',
    sectionName: '北山经之首',
    routeName: '北方山系 · 北山经之首',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    reportedMountainCount: 25,
    reportedTotalLi: 5490,
    sumOfRecordedIntervalsLi: 5480,
    auditNote: '篇末记二十五山、五千四百九十里；按当前逐段里程相加为五千四百八十里，相差十里。保留原文总计与逐段记录，待校勘。',
    nodes: [
      { id: 'north-danhu', name: '单狐之山' },
      { id: 'north-qiuru', name: '求如之山', direction: '北', distanceLi: 250 },
      { id: 'north-dai', name: '带山', direction: '北', distanceLi: 300, creatureIds: ['quanshu', 'qitu'] },
      { id: 'north-qiaoming', name: '谯明之山', direction: '北', distanceLi: 400, creatureIds: ['heluoyu', 'menghuai'] },
      { id: 'north-zhuoguang', name: '涿光之山', direction: '北', distanceLi: 350 },
      { id: 'north-guo', name: '虢山', direction: '北', distanceLi: 380 },
      { id: 'north-guowei', name: '虢山之尾', direction: '北', distanceLi: 400 },
      { id: 'north-danxun', name: '丹熏之山', direction: '北', distanceLi: 200, creatureIds: ['ershu'] },
      { id: 'north-shizhe', name: '石者之山', direction: '北', distanceLi: 280 },
      { id: 'north-bianchun', name: '边春之山', direction: '北', distanceLi: 110 },
      { id: 'north-manlian', name: '蔓联之山', direction: '北', distanceLi: 200 },
      { id: 'north-danzhang', name: '单张之山', direction: '北', distanceLi: 180 },
      { id: 'north-guanti', name: '灌题之山', direction: '北', distanceLi: 320 },
      { id: 'north-panhou', name: '潘侯之山', direction: '北', distanceLi: 200 },
      { id: 'north-xiaoxian', name: '小咸之山', direction: '北', distanceLi: 230 },
      { id: 'north-daxian', name: '大咸之山', direction: '北', distanceLi: 280 },
      { id: 'north-dunhong', name: '敦薨之山', direction: '北', distanceLi: 320 },
      { id: 'north-shaoxian', name: '少咸之山', direction: '北', distanceLi: 200, creatureIds: ['yayu'] },
      { id: 'north-yuefa', name: '嶽法之山', direction: '北', distanceLi: 200 },
      { id: 'north-beiyue', name: '北嶽之山', direction: '北', distanceLi: 200 },
      { id: 'north-hunxi', name: '浑夕之山', direction: '北', distanceLi: 180 },
      { id: 'north-beidan', name: '北单之山', direction: '北', distanceLi: 50 },
      { id: 'north-bicha', name: '羆差之山', direction: '北', distanceLi: 100 },
      { id: 'north-beixian', name: '北鲜之山', direction: '北', distanceLi: 180 },
      { id: 'north-di', name: '隄山', direction: '北', distanceLi: 170 }
    ]
  },
  {
    id: 'east-shuxu',
    chapterId: 'dongshan-jing',
    chapterName: '东山经',
    sectionName: '东山经之首',
    routeName: '东方山系 · 东山经之首',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/東山經',
    reportedMountainCount: 12,
    reportedTotalLi: 3600,
    sumOfRecordedIntervalsLi: 3500,
    auditNote: '篇末记十二山、三千六百里；按当前逐段里程相加为三千五百里，相差一百里。保留原文总计与逐段记录，待校勘。',
    nodes: [
      { id: 'east-shuxu', name: '樕𧑤之山' },
      { id: 'east-lei', name: '藟山', direction: '南', distanceLi: 300 },
      { id: 'east-xunzhuang', name: '栒状之山', direction: '南', distanceLi: 300 },
      { id: 'east-boqi', name: '勃斋之山', direction: '南', distanceLi: 300 },
      { id: 'east-fantiao', name: '番条之山', direction: '南', distanceLi: 300 },
      { id: 'east-gu-er', name: '姑儿之山', direction: '南', distanceLi: 400 },
      { id: 'east-gaoshi', name: '高氏之山', direction: '南', distanceLi: 400 },
      { id: 'east-yue', name: '岳山', direction: '南', distanceLi: 300 },
      { id: 'east-chai', name: '犲山', direction: '南', distanceLi: 300 },
      { id: 'east-du', name: '独山', direction: '南', distanceLi: 300 },
      { id: 'east-tai', name: '泰山', direction: '南', distanceLi: 300, creatureIds: ['tongtong'] },
      { id: 'east-zhu', name: '竹山', direction: '南', distanceLi: 300 }
    ]
  },
  {
    id: 'central-boshan',
    chapterId: 'zhongshan-jing',
    chapterName: '中山经',
    sectionName: '薄山之首',
    routeName: '中部山系 · 薄山之首',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/中山經',
    reportedMountainCount: 15,
    reportedTotalLi: 6670,
    sumOfRecordedIntervalsLi: 937,
    auditNote: '篇末现存文本记十五山、六千六百七十里；当前可见逐段里程相加为九百三十七里，差异显著。该数值不用于推算地图距离，需优先复核底本、断句与传抄异文。',
    nodes: [
      { id: 'central-ganzhao', name: '甘枣之山' },
      { id: 'central-lier', name: '历儿之山', direction: '东', distanceLi: 20 },
      { id: 'central-quzhu', name: '渠猪之山', direction: '东', distanceLi: 15 },
      { id: 'central-conglong', name: '蔥聾之山', direction: '东', distanceLi: 35 },
      { id: 'central-wo', name: '涹山', direction: '东', distanceLi: 15 },
      { id: 'central-tuohu', name: '脱扈之山', direction: '东', distanceLi: 70 },
      { id: 'central-jinxing', name: '金星之山', direction: '东', distanceLi: 20 },
      { id: 'central-taiwei', name: '泰威之山', direction: '东', distanceLi: 70 },
      { id: 'central-jianggu', name: '橿谷之山', direction: '东', distanceLi: 15 },
      { id: 'central-wulin', name: '吴林之山', direction: '东', distanceLi: 120 },
      { id: 'central-niushou', name: '牛首之山', direction: '北', distanceLi: 30 },
      { id: 'central-huo', name: '霍山', direction: '北', distanceLi: 40, creatureIds: ['feifei'] },
      { id: 'central-hegu', name: '合谷之山', direction: '北', distanceLi: 52 },
      { id: 'central-yin', name: '阴山', direction: '北', distanceLi: 35 },
      { id: 'central-gudeng', name: '鼓鐙之山', direction: '东北', distanceLi: 400 }
    ]
  }
];

import { additionalMountainRoutes } from './mountainRoutesV04';

export const mountainRoutes: MountainRoute[] = [...v03Routes, ...additionalMountainRoutes];

export function getRecordedDistance(route: MountainRoute): number {
  return route.nodes.reduce((sum, node) => sum + (node.distanceLi ?? 0), 0);
}
