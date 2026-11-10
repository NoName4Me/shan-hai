export type ResourceCategory = '植物' | '矿物' | '动物' | '其他';

export type MountainResource = {
  id: string;
  name: string;
  category: ResourceCategory;
  chapterName: string;
  mountainId: string;
  mountainName: string;
  recordText: string;
  sourceUrl: string;
  note?: string;
};

const south = 'https://zh.wikisource.org/zh-hans/山海經/南山經';
const west = 'https://zh.wikisource.org/wiki/山海經/西山經';
const north = 'https://zh.wikisource.org/zh-hans/北山經';
const east = 'https://zh.wikisource.org/zh-hans/山海經/東山經';
const central = 'https://zh.wikisource.org/zh-hans/中山經';

export const mountainResources: MountainResource[] = [
  {id:'zhaoyao-gui',name:'桂木',category:'植物',chapterName:'南山经',mountainId:'south-zhaoyao',mountainName:'招摇之山',recordText:'其上多桂。',sourceUrl:south},
  {id:'zhaoyao-zhuyu',name:'祝余',category:'植物',chapterName:'南山经',mountainId:'south-zhaoyao',mountainName:'招摇之山',recordText:'有草焉，其状如韭而青华，其名曰祝余。',sourceUrl:south},
  {id:'zhaoyao-migu',name:'迷谷',category:'植物',chapterName:'南山经',mountainId:'south-zhaoyao',mountainName:'招摇之山',recordText:'有木焉，其状如榖而黑理，其华四照，其名曰迷谷。',sourceUrl:south},
  {id:'tangting-yian',name:'棪木',category:'植物',chapterName:'南山经',mountainId:'south-tangting',mountainName:'堂庭之山',recordText:'多棪木。',sourceUrl:south},
  {id:'tangting-gold',name:'黄金',category:'矿物',chapterName:'南山经',mountainId:'south-tangting',mountainName:'堂庭之山',recordText:'多黄金。',sourceUrl:south},
  {id:'niuyang-chijin',name:'赤金',category:'矿物',chapterName:'南山经',mountainId:'south-niuyang',mountainName:'杻阳之山',recordText:'其阳多赤金，其阴多白金。',sourceUrl:south},
  {id:'niuyang-baijin',name:'白金',category:'矿物',chapterName:'南山经',mountainId:'south-niuyang',mountainName:'杻阳之山',recordText:'其阴多白金。',sourceUrl:south},
  {id:'qingqiu-qinghuo',name:'青雘',category:'矿物',chapterName:'南山经',mountainId:'south-qingqiu',mountainName:'青丘之山',recordText:'其阳多青雘。',sourceUrl:south},
  {id:'gui-danyu',name:'丹粟',category:'矿物',chapterName:'南山经',mountainId:'south-que-2-01',mountainName:'柜山',recordText:'英水出焉，其中多白玉、多丹粟。',sourceUrl:south},
  {id:'yaoguang-yu',name:'玉',category:'矿物',chapterName:'南山经',mountainId:'south-que-2-03',mountainName:'尧光之山',recordText:'其阳多玉，其阴多金。',sourceUrl:south},
  {id:'danxue-fenghuang',name:'凤凰',category:'动物',chapterName:'南山经',mountainId:'south-que-3-03',mountainName:'丹穴之山',recordText:'有鸟焉，其状如鸡，五采而文，名曰凤皇。',sourceUrl:south},
  {id:'gaoshan-qingbi',name:'青碧',category:'矿物',chapterName:'西山经',mountainId:'west-hua-2-04',mountainName:'高山',recordText:'其下多青碧、雄黄。',sourceUrl:west},
  {id:'gaoshan-xionghuang',name:'雄黄',category:'矿物',chapterName:'西山经',mountainId:'west-hua-2-04',mountainName:'高山',recordText:'其下多青碧、雄黄。',sourceUrl:west},
  {id:'nuchuang-chitong',name:'赤铜',category:'矿物',chapterName:'西山经',mountainId:'west-hua-2-05',mountainName:'女床之山',recordText:'其阳多赤铜，其阴多石涅。',sourceUrl:west},
  {id:'mishan-danmu',name:'丹木',category:'植物',chapterName:'西山经',mountainId:'west-hua-3-04',mountainName:'峚山',recordText:'其上多丹木，员叶而赤茎，黄华而赤实。',sourceUrl:west},
  {id:'mishan-yugao',name:'玉膏',category:'其他',chapterName:'西山经',mountainId:'west-hua-3-04',mountainName:'峚山',recordText:'是有玉膏，其原沸沸汤汤。',sourceUrl:west},
  {id:'kunlun-shatang',name:'沙棠',category:'植物',chapterName:'西山经',mountainId:'west-hua-3-08',mountainName:'昆仑之丘',recordText:'有木焉，其状如棠，黄华赤实，名曰沙棠。',sourceUrl:west},
  {id:'kunlun-pincao',name:'薲草',category:'植物',chapterName:'西山经',mountainId:'west-hua-3-08',mountainName:'昆仑之丘',recordText:'有草焉，名曰薲草，其状如葵。',sourceUrl:west},
  {id:'zhange-bifang',name:'毕方',category:'动物',chapterName:'西山经',mountainId:'west-hua-3-16',mountainName:'章莪之山',recordText:'有鸟焉，其状如鹤，一足，名曰毕方。',sourceUrl:west},
  {id:'guancen-yu',name:'玉',category:'矿物',chapterName:'北山经',mountainId:'north-danhu-2-01',mountainName:'管涔之山',recordText:'其上无木而多草，其下多玉。',sourceUrl:north},
  {id:'daishan-qingbi',name:'青碧',category:'矿物',chapterName:'北山经',mountainId:'north-dai',mountainName:'带山',recordText:'其上多玉，其下多青碧。',sourceUrl:north},
  {id:'dunhong-zongnan',name:'棕枏',category:'植物',chapterName:'北山经',mountainId:'north-dunhong',mountainName:'敦薨之山',recordText:'其上多棕枏，其下多茈草。',sourceUrl:north},
  {id:'fajiu-zhe',name:'柘木',category:'植物',chapterName:'北山经',mountainId:'north-danhu-3-22',mountainName:'发鸠之山',recordText:'其上多柘木。',sourceUrl:north},
  {id:'yigao-jinyu',name:'金玉',category:'矿物',chapterName:'东山经',mountainId:'east-shuxu-2-03',mountainName:'峄皋之山',recordText:'其上多金玉，其下多白垩。',sourceUrl:east},
  {id:'dongshi-cangyu',name:'苍玉',category:'矿物',chapterName:'东山经',mountainId:'east-shuxu-4-03',mountainName:'东始之山',recordText:'上多苍玉。',sourceUrl:east},
  {id:'qinshan-jinyu',name:'金玉',category:'矿物',chapterName:'东山经',mountainId:'east-shuxu-4-05',mountainName:'钦山',recordText:'多金玉而无石。',sourceUrl:east},
  {id:'yishan-jin',name:'赤金',category:'矿物',chapterName:'中山经',mountainId:'central-jing-11-01',mountainName:'翼望之山',recordText:'其阳多赤金，其阴多珉。',sourceUrl:central},
  {id:'yishan-songbai',name:'松柏',category:'植物',chapterName:'中山经',mountainId:'central-jing-11-01',mountainName:'翼望之山',recordText:'其上多松柏，其下多漆梓。',sourceUrl:central},
  {id:'minshan-baimin',name:'白珉',category:'矿物',chapterName:'中山经',mountainId:'central-min-9-02',mountainName:'岷山',recordText:'其上多金玉，其下多白珉。',sourceUrl:central},
  {id:'laishan-tanzhe',name:'檀柘',category:'植物',chapterName:'中山经',mountainId:'central-min-9-03',mountainName:'崃山',recordText:'其木多檀柘。',sourceUrl:central},
  {id:'shengshan-yuhui',name:'藇蕙',category:'植物',chapterName:'中山经',mountainId:'central-bo-5-14',mountainName:'升山',recordText:'其草多藇蕙，多寇脱。',sourceUrl:central},
  {id:'dongting-yintie',name:'银铁',category:'矿物',chapterName:'中山经',mountainId:'central-dongting-12-07',mountainName:'洞庭之山',recordText:'其上多黄金，其下多银铁。',sourceUrl:central},
  {id:'dongting-fruit',name:'柤、梨、橘、櫾',category:'植物',chapterName:'中山经',mountainId:'central-dongting-12-07',mountainName:'洞庭之山',recordText:'其木多柤、梨、橘、櫾。',sourceUrl:central}
];
