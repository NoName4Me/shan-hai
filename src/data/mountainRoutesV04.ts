import type { MountainNode, MountainRoute } from './mountainRoutes';

type NodeSeed = Omit<MountainNode, 'id'>;

function makeNodes(prefix: string, seeds: NodeSeed[]): MountainNode[] {
  return seeds.map((seed, index) => ({
    id: prefix + '-' + String(index + 1).padStart(2, '0'),
    kind: '山',
    ...seed
  }));
}

function makeRoute(args: {
  id: string;
  chapterId: string;
  chapterName: string;
  sectionName: string;
  routeName: string;
  sourceUrl: string;
  reportedMountainCount: number | null;
  reportedTotalLi: number | null;
  nodes: NodeSeed[];
  note?: string;
}): MountainRoute {
  const nodes = makeNodes(args.id, args.nodes);
  const mountainCount = nodes.filter((node) => node.kind !== '路段').length;
  const sum = nodes.reduce((total, node) => total + (node.distanceLi ?? 0), 0);
  const countNote = args.reportedMountainCount === null
    ? '篇末山数文字存在异文或识别歧义，暂不强行规范。'
    : '篇末记' + args.reportedMountainCount + '山，当前录入' + mountainCount + '个山名节点。';
  const distanceNote = args.reportedTotalLi === null
    ? '篇末总里程待进一步核对。'
    : '篇末记' + args.reportedTotalLi.toLocaleString('zh-CN') + '里；当前明确标注的陆行里程合计' + sum.toLocaleString('zh-CN') + '里。';
  return {
    id: args.id,
    chapterId: args.chapterId,
    chapterName: args.chapterName,
    sectionName: args.sectionName,
    routeName: args.routeName,
    sourceUrl: args.sourceUrl,
    reportedMountainCount: args.reportedMountainCount,
    reportedTotalLi: args.reportedTotalLi,
    sumOfRecordedIntervalsLi: sum,
    auditNote: [countNote, distanceNote, '水行、流沙、潜行及其他非直线行程保留原文路段说明，不折算为陆路里程。', args.note].filter(Boolean).join(' '),
    nodes
  };
}

const southSource = 'https://zh.wikisource.org/zh-hans/山海經/南山經';
const westSource = 'https://zh.wikisource.org/wiki/山海經/西山經';
const northSource = 'https://zh.wikisource.org/zh-hans/北山經';
const eastSource = 'https://zh.wikisource.org/zh-hans/山海經/東山經';
const centralSource = 'https://zh.wikisource.org/zh-hans/中山經';

export const additionalMountainRoutes: MountainRoute[] = [
  makeRoute({
    id:'south-que-2',chapterId:'nanshan-jing',chapterName:'南山经',sectionName:'南次二经',routeName:'南方山系 · 南次二经',sourceUrl:southSource,reportedMountainCount:17,reportedTotalLi:7200,
    nodes:[
      {name:'柜山',resourceSummary:'英水出焉；多白玉、丹粟'},
      {name:'长右之山',direction:'东南',distanceLi:450},
      {name:'尧光之山',direction:'东',distanceLi:340,resourceSummary:'阳多玉，阴多金'},
      {name:'羽山',direction:'东',distanceLi:350},
      {name:'瞿父之山',direction:'东',distanceLi:370},
      {name:'句馀之山',direction:'东',distanceLi:400},
      {name:'浮玉之山',direction:'东',distanceLi:500},
      {name:'成山',direction:'东',distanceLi:500},
      {name:'会稽之山',direction:'东',distanceLi:500},
      {name:'夷山',direction:'东',distanceLi:500},
      {name:'仆勾之山',direction:'东',distanceLi:500},
      {name:'咸阴之山',direction:'东',distanceLi:500},
      {name:'洵山',direction:'东',distanceLi:400},
      {name:'虖勺之山',direction:'东',distanceLi:400},
      {name:'区吴之山',direction:'东',distanceLi:500},
      {name:'鹿吴之山',direction:'东',distanceLi:500},
      {name:'漆吴之山',direction:'东',distanceLi:500}
    ]
  }),
  makeRoute({
    id:'south-que-3',chapterId:'nanshan-jing',chapterName:'南山经',sectionName:'南次三经',routeName:'南方山系 · 南次三经',sourceUrl:southSource,reportedMountainCount:14,reportedTotalLi:6530,
    note:'篇末记十四山；当前按正文可识别的具名路线节点录入，旄山之尾、非山之首保留为路线节点，仍有一处计数差异待校。',
    nodes:[
      {name:'天虞之山'},
      {name:'祷过之山',direction:'东',distanceLi:500,resourceSummary:'多金玉；泿水出焉'},
      {name:'丹穴之山',direction:'东',distanceLi:500,resourceSummary:'丹水出焉；凤凰见于此'},
      {name:'发爽之山',direction:'东',distanceLi:500},
      {name:'旄山之尾',direction:'东',distanceLi:400},
      {name:'非山之首',direction:'东',distanceLi:400},
      {name:'阳夹之山',direction:'东',distanceLi:500},
      {name:'灌湘之山',direction:'东',distanceLi:500},
      {name:'鸡山',direction:'东',distanceLi:500},
      {name:'令丘之山',direction:'东',distanceLi:400},
      {name:'仑者之山',direction:'东',distanceLi:370},
      {name:'禺槀之山',direction:'东',distanceLi:580},
      {name:'南禺之山',direction:'东',distanceLi:580}
    ]
  }),
  makeRoute({
    id:'west-hua-2',chapterId:'xishan-jing',chapterName:'西山经',sectionName:'西次二经',routeName:'西方山系 · 西次二经',sourceUrl:westSource,reportedMountainCount:17,reportedTotalLi:4140,
    nodes:[
      {name:'钤山',resourceSummary:'多铜、玉；木多杻、橿'},
      {name:'㤗冒之山',direction:'西',distanceLi:200,resourceSummary:'浴水出焉'},
      {name:'数历之山',direction:'西',distanceLi:170},
      {name:'高山',direction:'西北',distanceLi:50,resourceSummary:'银、青碧、雄黄；涇水出焉'},
      {name:'女床之山',direction:'西南',distanceLi:300,resourceSummary:'赤铜、石涅；鸾鸟见于此'},
      {name:'龙首之山',direction:'西',distanceLi:200},
      {name:'鹿台之山',direction:'西',distanceLi:200},
      {name:'鸟危之山',direction:'西南',distanceLi:200},
      {name:'小次之山',direction:'西',distanceLi:400},
      {name:'大次之山',direction:'西',distanceLi:300},
      {name:'薰吴之山',direction:'西',distanceLi:400},
      {name:'厎阳之山',direction:'西',distanceLi:400},
      {name:'众兽之山',direction:'西',distanceLi:250},
      {name:'皇人之山',direction:'西',distanceLi:500},
      {name:'中皇之山',direction:'西',distanceLi:300},
      {name:'西皇之山',direction:'西',distanceLi:350},
      {name:'莱山',direction:'西',distanceText:'西三百里五十里（底本文字如此，按350里暂录）',distanceLi:350}
    ]
  }),
  makeRoute({
    id:'west-hua-3',chapterId:'xishan-jing',chapterName:'西山经',sectionName:'西次三经',routeName:'西方山系 · 西次三经',sourceUrl:westSource,reportedMountainCount:23,reportedTotalLi:6744,
    nodes:[
      {name:'崇吾之山'},
      {name:'长沙之山',direction:'西北',distanceLi:300},
      {name:'不周之山',direction:'西北',distanceLi:370},
      {name:'峚山',direction:'西北',distanceLi:420,resourceSummary:'丹木、丹水、玉膏'},
      {name:'钟山',direction:'西北',distanceLi:420},
      {name:'泰器之山',direction:'西',distanceLi:180},
      {name:'槐江之山',direction:'西',distanceLi:320},
      {name:'昆仑之丘',direction:'西南',distanceLi:400,resourceSummary:'河水、赤水、洋水、黑水皆出焉'},
      {name:'乐游之山',direction:'西',distanceLi:370},
      {name:'流沙',kind:'路段',distanceText:'西水行四百里，至流沙'},
      {name:'蠃母之山',direction:'西',distanceLi:200,distanceText:'流沙二百里至于蠃母之山'},
      {name:'玉山',direction:'西',distanceLi:350},
      {name:'轩辕之丘',direction:'西',distanceLi:480},
      {name:'积石之山',direction:'西',distanceLi:300},
      {name:'长留之山',direction:'西',distanceLi:200},
      {name:'章莪之山',direction:'西',distanceLi:280,resourceSummary:'毕方见于此'},
      {name:'阴山',direction:'西',distanceLi:300},
      {name:'符愓之山',direction:'西',distanceLi:200},
      {name:'三危之山',direction:'西',distanceLi:220},
      {name:'騩山',direction:'西',distanceLi:190},
      {name:'天山',direction:'西',distanceLi:350,resourceSummary:'英水出焉；帝江见于此'},
      {name:'泑山',direction:'西',distanceLi:290},
      {name:'翼望之山',direction:'西',distanceText:'西水行一百里至于翼望之山'}
    ]
  }),
  makeRoute({
    id:'west-hua-4',chapterId:'xishan-jing',chapterName:'西山经',sectionName:'西次四经',routeName:'西方山系 · 西次四经',sourceUrl:westSource,reportedMountainCount:19,reportedTotalLi:3680,
    nodes:[
      {name:'阴山',resourceSummary:'多谷；阴水出焉'},
      {name:'劳山',direction:'北',distanceLi:50},
      {name:'罢父之山',direction:'西',distanceLi:50},
      {name:'申山',direction:'北',distanceLi:70},
      {name:'鸟山',direction:'北',distanceText:'北百二百里（底本文字如此，待校）'},
      {name:'上申之山',direction:'北',distanceLi:20},
      {name:'诸次之山',direction:'北',distanceLi:80},
      {name:'号山',direction:'北',distanceLi:180},
      {name:'盂山',direction:'北',distanceLi:220},
      {name:'白於之山',direction:'西',distanceLi:250},
      {name:'申首之山',direction:'西北',distanceLi:300},
      {name:'涇谷之山',direction:'西',distanceLi:55},
      {name:'刚山',direction:'西',distanceLi:120},
      {name:'刚山之尾',direction:'西',distanceLi:200},
      {name:'英鞮之山',direction:'西',distanceLi:350},
      {name:'中曲之山',direction:'西',distanceLi:300},
      {name:'邽山',direction:'西',distanceLi:260},
      {name:'鸟鼠同穴之山',direction:'西',distanceLi:220},
      {name:'崦嵫之山',direction:'西南',distanceLi:360}
    ]
  }),
  makeRoute({
    id:'north-danhu-2',chapterId:'beishan-jing',chapterName:'北山经',sectionName:'北次二经',routeName:'北方山系 · 北次二经',sourceUrl:northSource,reportedMountainCount:17,reportedTotalLi:5690,
    note:'篇末记十七山；当前可辨认十六个山名，另将北水行五百里、流沙三百里的特殊路段独立建档，仍保留一处山数差异待校。',
    nodes:[
      {name:'管涔之山',resourceSummary:'汾水出焉；下多玉'},
      {name:'少阳之山',direction:'西',distanceLi:250},
      {name:'县雍之山',direction:'北',distanceLi:50},
      {name:'狐岐之山',direction:'北',distanceLi:200},
      {name:'白沙山',direction:'北',distanceLi:350},
      {name:'尔是之山',direction:'北',distanceLi:400},
      {name:'狂山',direction:'北',distanceLi:380},
      {name:'诸馀之山',direction:'北',distanceLi:380},
      {name:'敦头之山',direction:'北',distanceLi:350},
      {name:'钩吾之山',direction:'北',distanceLi:350},
      {name:'北嚻之山',direction:'北',distanceLi:300},
      {name:'梁渠之山',direction:'北',distanceLi:350},
      {name:'姑灌之山',direction:'北',distanceLi:400},
      {name:'湖灌之山',direction:'北',distanceLi:380},
      {name:'流沙',kind:'路段',distanceText:'北水行五百里，流沙三百里'},
      {name:'洹山',distanceText:'至于洹山'},
      {name:'敦题之山',direction:'北',distanceLi:300}
    ]
  }),
  makeRoute({
    id:'north-danhu-3',chapterId:'beishan-jing',chapterName:'北山经',sectionName:'北次三经',routeName:'北方山系 · 北次三经',sourceUrl:northSource,reportedMountainCount:46,reportedTotalLi:12350,
    note:'按正文可识别的主路线山名录入；“太行之山，其首曰归山”、发丸之山等层级地名另有从属关系，后续会进一步拆分。',
    nodes:[
      {name:'归山',resourceSummary:'北次三经首段；多金玉、碧'},
      {name:'龙侯之山',direction:'东北',distanceLi:200},
      {name:'马成之山',direction:'东北',distanceLi:200},
      {name:'咸山',direction:'东北',distanceLi:70},
      {name:'天池之山',direction:'东北',distanceLi:200},
      {name:'阳山',direction:'东',distanceLi:300},
      {name:'贲闻之山',direction:'东',distanceLi:350},
      {name:'王屋之山',direction:'北',distanceLi:100},
      {name:'教山',direction:'东北',distanceLi:300},
      {name:'景山',direction:'南',distanceLi:300},
      {name:'孟门之山',direction:'东南',distanceLi:320},
      {name:'平山',direction:'东南',distanceLi:320},
      {name:'京山',direction:'东',distanceLi:200},
      {name:'虫尾之山',direction:'东',distanceLi:200},
      {name:'彭毗之山',direction:'东',distanceLi:300},
      {name:'小侯之山',direction:'东',distanceLi:180},
      {name:'泰头之山',direction:'东',distanceLi:370},
      {name:'轩辕之山',direction:'东北',distanceLi:200},
      {name:'谒戾之山',direction:'北',distanceLi:200},
      {name:'沮洳之山',direction:'东',distanceLi:300},
      {name:'神囷之山',direction:'北',distanceLi:300},
      {name:'发鸠之山',direction:'北',distanceLi:200,resourceSummary:'精卫见于此；漳水出焉'},
      {name:'少山',direction:'东北',distanceLi:120},
      {name:'锡山',direction:'东北',distanceLi:200},
      {name:'景山',direction:'北',distanceLi:200},
      {name:'题首之山',direction:'北',distanceLi:100},
      {name:'绣山',direction:'北',distanceLi:100},
      {name:'松山',direction:'北',distanceLi:120},
      {name:'敦与之山',direction:'北',distanceLi:120},
      {name:'柘山',direction:'北',distanceLi:170},
      {name:'维龙之山',direction:'北',distanceLi:300},
      {name:'白马之山',direction:'北',distanceLi:180},
      {name:'空桑之山',direction:'北',distanceLi:200},
      {name:'泰戏之山',direction:'北',distanceLi:300},
      {name:'石山',direction:'北',distanceLi:300},
      {name:'童戎之山',direction:'北',distanceLi:200},
      {name:'高是之山',direction:'北',distanceLi:300},
      {name:'陆山',direction:'北',distanceLi:300},
      {name:'沂山',direction:'北',distanceLi:200},
      {name:'燕山',direction:'北',distanceLi:120},
      {name:'饶山',distanceText:'北山行五百里、水行五百里至于饶山'},
      {name:'干山',direction:'北',distanceLi:400},
      {name:'伦山',direction:'北',distanceLi:500},
      {name:'碣石之山',direction:'北',distanceLi:500},
      {name:'雁门之山',distanceText:'又北水行五百里至于雁门之山'},
      {name:'帝都之山',distanceText:'又北水行四百里，泰泽中有帝都之山'},
      {name:'毋逢之山',direction:'北',distanceLi:500}
    ]
  }),
  makeRoute({
    id:'east-shuxu-2',chapterId:'dongshan-jing',chapterName:'东山经',sectionName:'东次二经',routeName:'东方山系 · 东次二经',sourceUrl:eastSource,reportedMountainCount:17,reportedTotalLi:6640,
    nodes:[
      {name:'空桑之山'},
      {name:'曹夕之山',direction:'南',distanceLi:600},
      {name:'峄皋之山',direction:'西南',distanceLi:400},
      {name:'葛山之尾',distanceText:'南水行五百里、流沙三百里至于葛山之尾'},
      {name:'葛山之首',direction:'南',distanceLi:380},
      {name:'馀峩之山',direction:'南',distanceLi:380},
      {name:'杜父之山',direction:'南',distanceLi:300},
      {name:'耿山',direction:'南',distanceLi:300},
      {name:'卢其之山',direction:'南',distanceLi:300},
      {name:'姑射之山',direction:'南',distanceLi:380},
      {name:'北姑射之山',distanceText:'南水行三百里、流沙百里至于北姑射之山'},
      {name:'南姑射之山',direction:'南',distanceLi:300},
      {name:'碧山',direction:'南',distanceLi:300},
      {name:'缑氏之山',direction:'南',distanceLi:500},
      {name:'姑逢之山',direction:'南',distanceLi:300},
      {name:'凫丽之山',direction:'南',distanceLi:500},
      {name:'䃌山',direction:'南',distanceLi:500}
    ]
  }),
  makeRoute({
    id:'east-shuxu-3',chapterId:'dongshan-jing',chapterName:'东山经',sectionName:'东次三经',routeName:'东方山系 · 东次三经',sourceUrl:eastSource,reportedMountainCount:9,reportedTotalLi:6900,
    nodes:[
      {name:'尸胡之山'},
      {name:'岐山',distanceText:'南水行八百里至于岐山'},
      {name:'诸钩之山',distanceText:'南水行七百里至于诸钩之山'},
      {name:'中父之山',distanceText:'南水行七百里至于中父之山'},
      {name:'胡射之山',distanceText:'东水行一千里至于胡射之山'},
      {name:'孟子之山',distanceText:'南水行七百里至于孟子之山'},
      {name:'跂踵之山',distanceText:'南水行五百里、流沙五百里至于跂踵之山'},
      {name:'踇隅之山',distanceText:'南水行九百里至于踇隅之山'},
      {name:'无皋之山',distanceText:'南水行五百里、流沙三百里至于无皋之山'}
    ]
  }),
  makeRoute({
    id:'east-shuxu-4',chapterId:'dongshan-jing',chapterName:'东山经',sectionName:'东次四经',routeName:'东方山系 · 东次四经',sourceUrl:eastSource,reportedMountainCount:8,reportedTotalLi:1720,
    nodes:[
      {name:'北号之山'},
      {name:'旄山',direction:'南',distanceLi:300},
      {name:'东始之山',direction:'南',distanceLi:320},
      {name:'女烝之山',direction:'东南',distanceLi:300},
      {name:'钦山',direction:'东南',distanceLi:200},
      {name:'子桐之山',direction:'东南',distanceLi:200},
      {name:'剡山',direction:'东北',distanceLi:200},
      {name:'太山',direction:'东北',distanceLi:200}
    ]
  }),
  makeRoute({
    id:'central-ji-2',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次二经',routeName:'中部山系 · 中次二经',sourceUrl:centralSource,reportedMountainCount:9,reportedTotalLi:1670,
    nodes:[
      {name:'煇诸之山'},
      {name:'发视之山',direction:'西南',distanceLi:200},
      {name:'豪山',direction:'西',distanceLi:300},
      {name:'鲜山',direction:'西',distanceLi:300,resourceSummary:'多金玉；鲜水出焉，鸣蛇见于此'},
      {name:'阳山',direction:'西',distanceLi:300,resourceSummary:'阳水出焉；化蛇见于此'},
      {name:'昆吾之山',direction:'西',distanceLi:200},
      {name:'葌山',direction:'西',distanceLi:120},
      {name:'独苏之山',direction:'西',distanceLi:150},
      {name:'蔓渠之山',direction:'西',distanceLi:120}
    ]
  }),
  makeRoute({
    id:'central-fu-3',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次三经',routeName:'中部山系 · 中次三经',sourceUrl:centralSource,reportedMountainCount:5,reportedTotalLi:440,
    nodes:[
      {name:'敖岸之山',resourceSummary:'多㻬琈玉、赭、黄金；夫诸见于此'},
      {name:'青要之山',direction:'东',distanceLi:10,resourceSummary:'畛水出焉；武罗司之'},
      {name:'騩山',direction:'东',distanceLi:10},
      {name:'宜苏之山',direction:'东',distanceLi:40},
      {name:'和山',direction:'东',distanceLi:20,resourceSummary:'九水合流注于河；泰逢司之'}
    ]
  }),
  makeRoute({
    id:'central-li-4',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次四经',routeName:'中部山系 · 中次四经',sourceUrl:centralSource,reportedMountainCount:9,reportedTotalLi:1670,
    nodes:[
      {name:'鹿蹄之山',resourceSummary:'多玉、金；甘水出焉'},
      {name:'扶猪之山',direction:'西',distanceLi:50},
      {name:'釐山',direction:'西',distanceLi:120},
      {name:'箕尾之山',direction:'西',distanceLi:200},
      {name:'柄山',direction:'西',distanceLi:250},
      {name:'白边之山',direction:'西',distanceLi:200},
      {name:'熊耳之山',direction:'西',distanceLi:200},
      {name:'牡山',direction:'西',distanceLi:300},
      {name:'讙举之山',direction:'西',distanceLi:350}
    ]
  }),
  makeRoute({
    id:'central-bo-5',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次五经',routeName:'中部山系 · 中次五经',sourceUrl:centralSource,reportedMountainCount:16,reportedTotalLi:2982,
    note:'正文起点写作“苟床之山”，篇末起点写作“苟林之山”；保留两种字形，待校。',
    nodes:[
      {name:'苟床之山'},
      {name:'首山',direction:'东',distanceLi:300},
      {name:'县㔉之山',direction:'东',distanceLi:300},
      {name:'葱聋之山',direction:'东',distanceLi:300},
      {name:'条谷之山',direction:'东北',distanceLi:500},
      {name:'超山',direction:'北',distanceLi:10},
      {name:'成侯之山',direction:'东',distanceLi:500},
      {name:'朝歌之山',direction:'东',distanceLi:500},
      {name:'槐山',direction:'东',distanceLi:500},
      {name:'历山',direction:'东',distanceLi:10},
      {name:'尸山',direction:'东',distanceLi:10},
      {name:'良馀之山',direction:'东',distanceLi:10},
      {name:'蛊尾之山',direction:'东南',distanceLi:10},
      {name:'升山',direction:'东北',distanceLi:20},
      {name:'阳虚之山',direction:'东',distanceLi:20}
    ]
  }),
  makeRoute({
    id:'central-gaodi-6',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次六经',routeName:'中部山系 · 中次六经',sourceUrl:centralSource,reportedMountainCount:14,reportedTotalLi:790,
    nodes:[
      {name:'平逢之山',resourceSummary:'多沙石；骄虫居之'},
      {name:'缟羝之山',direction:'西',distanceLi:10},
      {name:'廆山',direction:'西',distanceLi:10},
      {name:'瞻诸之山',direction:'西',distanceLi:30},
      {name:'娄涿之山',direction:'西',distanceLi:30},
      {name:'白石之山',direction:'西',distanceLi:40},
      {name:'榖山',direction:'西',distanceLi:50},
      {name:'密山',direction:'西',distanceLi:72},
      {name:'长石之山',direction:'西',distanceLi:100},
      {name:'傅山',direction:'西',distanceLi:140},
      {name:'橐山',direction:'西',distanceLi:50},
      {name:'常烝之山',direction:'西',distanceLi:90},
      {name:'夸父之山',direction:'西',distanceLi:90},
      {name:'阳华之山',direction:'西',distanceLi:90}
    ]
  }),
  makeRoute({
    id:'central-ku-7',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次七经',routeName:'中部山系 · 中次七经',sourceUrl:centralSource,reportedMountainCount:19,reportedTotalLi:1184,
    nodes:[
      {name:'休舆之山'},
      {name:'鼓锺之山',direction:'东',distanceLi:300},
      {name:'姑媱之山',direction:'东',distanceLi:200},
      {name:'苦山',direction:'东',distanceLi:20},
      {name:'堵山',direction:'东',distanceLi:27},
      {name:'放皋之山',direction:'东',distanceLi:52},
      {name:'大𩇵之山',direction:'东',distanceLi:57},
      {name:'半石之山',direction:'东',distanceLi:70},
      {name:'少室之山',direction:'东',distanceLi:50},
      {name:'泰室之山',direction:'东',distanceLi:30},
      {name:'讲山',direction:'北',distanceLi:30},
      {name:'婴梁之山',direction:'北',distanceLi:30},
      {name:'浮戏之山',direction:'东',distanceLi:30},
      {name:'少陉之山',direction:'东',distanceLi:40},
      {name:'太山',direction:'东南',distanceLi:10},
      {name:'末山',direction:'东',distanceLi:20},
      {name:'役山',direction:'东',distanceLi:25},
      {name:'敏山',direction:'东',distanceLi:35},
      {name:'大騩之山',direction:'东',distanceLi:30}
    ]
  }),
  makeRoute({
    id:'central-jing-8',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次八经',routeName:'中部山系 · 中次八经',sourceUrl:centralSource,reportedMountainCount:23,reportedTotalLi:2890,
    nodes:[
      {name:'景山',resourceSummary:'雎水出焉；多丹粟、文鱼'},
      {name:'荆山',direction:'东北',distanceLi:100,resourceSummary:'漳水出焉'},
      {name:'骄山',direction:'东北',distanceLi:150},
      {name:'女几之山',direction:'东北',distanceLi:120},
      {name:'宜诸之山',direction:'东北',distanceLi:200},
      {name:'纶山',direction:'东北',distanceLi:350},
      {name:'陆䣀之山',direction:'东',distanceLi:200},
      {name:'光山',direction:'东',distanceLi:130},
      {name:'岐山',direction:'东',distanceLi:150},
      {name:'铜山',direction:'东',distanceLi:130},
      {name:'美山',direction:'东北',distanceLi:100},
      {name:'大尧之山',direction:'东北',distanceLi:100},
      {name:'灵山',direction:'东北',distanceLi:300},
      {name:'龙山',direction:'东北',distanceLi:70},
      {name:'衡山',direction:'东南',distanceLi:50},
      {name:'石山',direction:'东南',distanceLi:70},
      {name:'若山',direction:'南',distanceLi:120},
      {name:'彘山',direction:'东南',distanceLi:120},
      {name:'玉山',direction:'东南',distanceLi:150},
      {name:'讙山',direction:'东南',distanceLi:70},
      {name:'仁举之山',direction:'东北',distanceLi:150},
      {name:'师每之山',direction:'东',distanceLi:50},
      {name:'琴鼓之山',direction:'东南',distanceLi:200}
    ]
  }),
  makeRoute({
    id:'central-min-9',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次九经',routeName:'中部山系 · 中次九经',sourceUrl:centralSource,reportedMountainCount:16,reportedTotalLi:3500,
    nodes:[
      {name:'女几之山',resourceSummary:'洛水出焉；多雄黄'},
      {name:'岷山',direction:'东北',distanceLi:300,resourceSummary:'江水出焉'},
      {name:'崃山',direction:'东北',distanceLi:140},
      {name:'崌山',direction:'东',distanceLi:150},
      {name:'高梁之山',direction:'东',distanceLi:300},
      {name:'蛇山',direction:'东',distanceLi:400},
      {name:'鬲山',direction:'东',distanceLi:500},
      {name:'隅阳之山',direction:'东北',distanceLi:300},
      {name:'岐山',direction:'东',distanceLi:250},
      {name:'勾檷之山',direction:'东',distanceLi:300},
      {name:'风雨之山',direction:'东',distanceLi:150},
      {name:'玉山',direction:'东北',distanceLi:200},
      {name:'熊山',direction:'东',distanceLi:150},
      {name:'騩山',direction:'东',distanceLi:140},
      {name:'葛山',direction:'东',distanceLi:200},
      {name:'贾超之山',direction:'东',distanceLi:170}
    ]
  }),
  makeRoute({
    id:'central-shouyang-10',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次十经',routeName:'中部山系 · 中次十经',sourceUrl:centralSource,reportedMountainCount:9,reportedTotalLi:267,
    nodes:[
      {name:'首阳之山'},
      {name:'虎尾之山',direction:'西',distanceLi:50},
      {name:'繁缋之山',direction:'西南',distanceLi:50},
      {name:'勇石之山',direction:'西南',distanceLi:20},
      {name:'复州之山',direction:'西',distanceLi:20},
      {name:'楮山',direction:'西',distanceLi:30},
      {name:'又原之山',direction:'西',distanceLi:20},
      {name:'涿山',direction:'西',distanceLi:50},
      {name:'丙山',direction:'西',distanceLi:70}
    ]
  }),
  makeRoute({
    id:'central-jing-11',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次十一经',routeName:'中部山系 · 中次十一经',sourceUrl:centralSource,reportedMountainCount:48,reportedTotalLi:3732,
    nodes:[
      {name:'翼望之山',resourceSummary:'湍水、贶水出焉；多松柏、漆梓、赤金'},
      {name:'朝歌之山',direction:'东北',distanceLi:150},
      {name:'帝囷之山',direction:'东南',distanceLi:200},
      {name:'视山',direction:'东南',distanceLi:50},
      {name:'前山',direction:'东南',distanceLi:200},
      {name:'丰山',direction:'东南',distanceLi:300},
      {name:'兔床之山',direction:'东北',distanceLi:800},
      {name:'皮山',direction:'东',distanceLi:60},
      {name:'瑶碧之山',direction:'东',distanceLi:60},
      {name:'支离之山',direction:'东',distanceLi:40},
      {name:'祑𥮐之山',direction:'东北',distanceLi:50},
      {name:'堇理之山',direction:'西北',distanceLi:100},
      {name:'依轱之山',direction:'东南',distanceLi:30},
      {name:'即谷之山',direction:'东南',distanceLi:35},
      {name:'鸡山',direction:'东南',distanceLi:40},
      {name:'高前之山',direction:'东南',distanceLi:50},
      {name:'游戏之山',direction:'东南',distanceLi:30},
      {name:'从山',direction:'东南',distanceLi:35},
      {name:'婴䃌之山',direction:'东南',distanceLi:30},
      {name:'毕山',direction:'东南',distanceLi:30},
      {name:'乐马之山',direction:'东南',distanceLi:20},
      {name:'葴山',direction:'东南',distanceLi:25},
      {name:'婴山',direction:'东',distanceLi:40},
      {name:'虎首之山',direction:'东',distanceLi:30},
      {name:'婴侯之山',direction:'东',distanceLi:20},
      {name:'大孰之山',direction:'东',distanceLi:50},
      {name:'卑山',direction:'东',distanceLi:40},
      {name:'倚帝之山',direction:'东',distanceLi:30},
      {name:'鲵山',direction:'东',distanceLi:30},
      {name:'雅山',direction:'东',distanceLi:30},
      {name:'宣山',direction:'东',distanceLi:55},
      {name:'衡山',direction:'东',distanceLi:45},
      {name:'丰山',direction:'东',distanceLi:40},
      {name:'妪山',direction:'东',distanceLi:70},
      {name:'鲜山',direction:'东',distanceLi:30},
      {name:'章山',direction:'东',distanceLi:30},
      {name:'大支之山',direction:'东',distanceLi:25},
      {name:'区吴之山',direction:'东',distanceLi:50},
      {name:'声匈之山',direction:'东',distanceLi:50},
      {name:'大騩之山',direction:'东',distanceLi:50},
      {name:'踵臼之山',direction:'东',distanceLi:10},
      {name:'历石之山',direction:'东北',distanceLi:70},
      {name:'求山',direction:'东南',distanceLi:100},
      {name:'丑阳之山',direction:'东',distanceLi:200},
      {name:'奥山',direction:'东',distanceLi:300},
      {name:'服山',direction:'东',distanceLi:35},
      {name:'杳山',direction:'东',distanceLi:110},
      {name:'几山',direction:'东',distanceLi:350}
    ]
  }),
  makeRoute({
    id:'central-dongting-12',chapterId:'zhongshan-jing',chapterName:'中山经',sectionName:'中次十二经',routeName:'中部山系 · 中次十二经',sourceUrl:centralSource,reportedMountainCount:null,reportedTotalLi:2800,
    note:'篇末底本文字作“凡十万山”，疑为异文或录入讹误；本卷总计一百九十七山可供总量核对，但不据此擅自改写本段山数。',
    nodes:[
      {name:'篇遇之山'},
      {name:'云山',direction:'东南',distanceLi:50},
      {name:'龟山',direction:'东南',distanceLi:130},
      {name:'丙山',direction:'东',distanceLi:70},
      {name:'风伯之山',direction:'东南',distanceLi:50},
      {name:'夫夫之山',direction:'东',distanceLi:150},
      {name:'洞庭之山',direction:'东南',distanceLi:120,resourceSummary:'多黄金、银铁；帝之二女居之'},
      {name:'暴山',direction:'东南',distanceLi:180},
      {name:'即公之山',direction:'东南',distanceLi:200},
      {name:'尧山',direction:'东南',distanceLi:159},
      {name:'江浮之山',direction:'东南',distanceLi:100},
      {name:'真陵之山',direction:'东',distanceLi:200},
      {name:'阳帝之山',direction:'东南',distanceLi:120},
      {name:'柴桑之山',direction:'南',distanceLi:90},
      {name:'荣余之山',direction:'东',distanceLi:230}
    ]
  })
];
