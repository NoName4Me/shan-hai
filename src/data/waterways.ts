export type WaterwayEntry = {
  id: string;
  name: string;
  chapterName: string;
  mountainId: string;
  mountainName: string;
  relation: '发源' | '临水' | '流经';
  flowDirection?: string;
  destination?: string;
  recordText: string;
  sourceUrl: string;
  note?: string;
};

const south = 'https://zh.wikisource.org/zh-hans/山海經/南山經';
const west = 'https://zh.wikisource.org/wiki/山海經/西山經';
const north = 'https://zh.wikisource.org/zh-hans/北山經';
const east = 'https://zh.wikisource.org/zh-hans/山海經/東山經';
const central = 'https://zh.wikisource.org/zh-hans/中山經';

export const waterways: WaterwayEntry[] = [
  {id:'ying-shui-south',name:'英水',chapterName:'南山经',mountainId:'south-qingqiu',mountainName:'青丘之山',relation:'发源',flowDirection:'南流',destination:'即翼之泽',recordText:'英水出青丘之山，南流注于即翼之泽；水中多赤鱬。',sourceUrl:south},
  {id:'ying-shui-gui',name:'英水',chapterName:'南山经',mountainId:'south-que-2-01',mountainName:'柜山',relation:'发源',flowDirection:'西南流',destination:'赤水',recordText:'英水出柜山，西南流注于赤水。',sourceUrl:south,note:'与青丘之山所出英水为同名异处，分开建档。'},
  {id:'dan-shui-south',name:'丹水',chapterName:'南山经',mountainId:'south-que-3-03',mountainName:'丹穴之山',relation:'发源',flowDirection:'南流',destination:'渤海',recordText:'丹水出丹穴之山，南流注于渤海。',sourceUrl:south},
  {id:'fan-shui',name:'汎水',chapterName:'南山经',mountainId:'south-que-3-04',mountainName:'发爽之山',relation:'发源',flowDirection:'南流',destination:'渤海',recordText:'汎水出发爽之山，南流注于渤海。',sourceUrl:south},
  {id:'fen-shui',name:'汾水',chapterName:'北山经',mountainId:'north-danhu-2-01',mountainName:'管涔之山',relation:'发源',flowDirection:'西流',destination:'河',recordText:'汾水出管涔之山，西流注于河。',sourceUrl:north},
  {id:'suan-shui',name:'酸水',chapterName:'北山经',mountainId:'north-danhu-2-02',mountainName:'少阳之山',relation:'发源',flowDirection:'东流',destination:'汾水',recordText:'酸水出少阳之山，东流注于汾水。',sourceUrl:north},
  {id:'peng-shui',name:'彭水',chapterName:'北山经',mountainId:'north-dai',mountainName:'带山',relation:'发源',flowDirection:'西流',destination:'芘湖之水',recordText:'彭水出带山，西流注于芘湖之水。',sourceUrl:north},
  {id:'qiao-shui',name:'谯水',chapterName:'北山经',mountainId:'north-qiaoming',mountainName:'谯明之山',relation:'发源',flowDirection:'西流',destination:'河',recordText:'谯水出谯明之山，西流注于河。',sourceUrl:north},
  {id:'dan-shui-west',name:'丹水',chapterName:'西山经',mountainId:'west-hua-3-04',mountainName:'峚山',relation:'发源',flowDirection:'西流',destination:'稷泽',recordText:'丹水出峚山，西流注于稷泽；原文并记山中有玉膏。',sourceUrl:west},
  {id:'he-shui-kunlun',name:'河水',chapterName:'西山经',mountainId:'west-hua-3-08',mountainName:'昆仑之丘',relation:'发源',flowDirection:'南流',destination:'无达',recordText:'河水出昆仑之丘东北隅，南流注于无达。',sourceUrl:west,note:'这里记录的是古籍叙述中的水源关系，不等同于现代水文学对黄河源头的认定。'},
  {id:'chi-shui',name:'赤水',chapterName:'西山经',mountainId:'west-hua-3-08',mountainName:'昆仑之丘',relation:'发源',flowDirection:'东南流',destination:'氾天之水',recordText:'赤水出昆仑之丘东南隅，东南流注于氾天之水。',sourceUrl:west},
  {id:'hei-shui',name:'黑水',chapterName:'西山经',mountainId:'west-hua-3-08',mountainName:'昆仑之丘',relation:'发源',flowDirection:'西流',destination:'大杅',recordText:'黑水出昆仑之丘西北隅，西流于大杅。',sourceUrl:west},
  {id:'yin-shui',name:'阴水',chapterName:'西山经',mountainId:'west-hua-4-01',mountainName:'阴山',relation:'发源',flowDirection:'西流',destination:'洛',recordText:'阴水出阴山，西流注于洛。',sourceUrl:west},
  {id:'ruo-shui',name:'弱水',chapterName:'西山经',mountainId:'west-hua-4-02',mountainName:'劳山',relation:'发源',flowDirection:'西流',destination:'洛',recordText:'弱水出劳山，西流注于洛。',sourceUrl:west},
  {id:'shui-east1',name:'食水',chapterName:'东山经',mountainId:'east-shuxu',mountainName:'樕𧑤之山',relation:'临水',flowDirection:'东北流',destination:'海',recordText:'樕𧑤之山一段记载北临食水；食水东北流注于海。',sourceUrl:east,note:'此条按山水相邻关系收录，原文未在此处明确说食水出于该山。'},
  {id:'li-shui',name:'澧水',chapterName:'东山经',mountainId:'east-shuxu-2-05',mountainName:'葛山之首',relation:'发源',flowDirection:'东流',destination:'余泽',recordText:'澧水出葛山之首，东流注于余泽。',sourceUrl:east},
  {id:'zayu-shui',name:'杂余之水',chapterName:'东山经',mountainId:'east-shuxu-2-06',mountainName:'馀峩之山',relation:'发源',flowDirection:'东流',destination:'黄水',recordText:'杂余之水出馀峩之山，东流注于黄水。',sourceUrl:east},
  {id:'shajiang-shui',name:'沙水',chapterName:'东山经',mountainId:'east-shuxu-2-09',mountainName:'卢其之山',relation:'发源',flowDirection:'南流',destination:'涔水',recordText:'沙水出卢其之山，南流注于涔水。',sourceUrl:east},
  {id:'bih-shui',name:'碧阳之水',chapterName:'东山经',mountainId:'east-shuxu-3-06',mountainName:'孟子之山',relation:'发源',recordText:'孟子之山上有水出焉，名曰碧阳。',sourceUrl:east},
  {id:'shijian-shui',name:'食水',chapterName:'东山经',mountainId:'east-shuxu-4-01',mountainName:'北号之山',relation:'发源',flowDirection:'东北流',destination:'海',recordText:'食水出北号之山，东北流注于海。',sourceUrl:east,note:'与东次一经“北临食水”相关但分属不同路线段；此处依东次四经的明确水源记载单列。'},
  {id:'cangti-shui',name:'苍体之水',chapterName:'东山经',mountainId:'east-shuxu-4-02',mountainName:'旄山',relation:'发源',flowDirection:'西流',destination:'展水',recordText:'苍体之水出旄山，西流注于展水。',sourceUrl:east},
  {id:'xian-shui',name:'鲜水',chapterName:'中山经',mountainId:'central-ji-2-04',mountainName:'鲜山',relation:'发源',flowDirection:'北流',destination:'伊水',recordText:'鲜水出鲜山，北流注于伊水。',sourceUrl:central},
  {id:'yang-shui',name:'阳水',chapterName:'中山经',mountainId:'central-ji-2-05',mountainName:'阳山',relation:'发源',flowDirection:'北流',destination:'伊水',recordText:'阳水出阳山，北流注于伊水。',sourceUrl:central},
  {id:'gan-shui',name:'甘水',chapterName:'中山经',mountainId:'central-li-4-01',mountainName:'鹿蹄之山',relation:'发源',flowDirection:'北流',destination:'洛',recordText:'甘水出鹿蹄之山，北流注于洛。',sourceUrl:central},
  {id:'zhen-shui',name:'畛水',chapterName:'中山经',mountainId:'central-fu-3-02',mountainName:'青要之山',relation:'发源',flowDirection:'北流',destination:'河',recordText:'畛水出青要之山，北流注于河。',sourceUrl:central},
  {id:'zhenghui-shui',name:'正回之水',chapterName:'中山经',mountainId:'central-fu-3-03',mountainName:'騩山',relation:'发源',flowDirection:'北流',destination:'河',recordText:'正回之水出騩山，北流注于河。',sourceUrl:central},
  {id:'ju-shui',name:'雎水',chapterName:'中山经',mountainId:'central-jing-8-01',mountainName:'景山',relation:'发源',flowDirection:'东南流',destination:'江',recordText:'雎水出景山，东南流注于江。',sourceUrl:central},
  {id:'zhang-shui',name:'漳水',chapterName:'中山经',mountainId:'central-jing-8-02',mountainName:'荆山',relation:'发源',flowDirection:'东南流',destination:'雎水',recordText:'漳水出荆山，东南流注于雎水。',sourceUrl:central},
  {id:'luo-shui',name:'洛水',chapterName:'中山经',mountainId:'central-min-9-01',mountainName:'女几之山',relation:'发源',flowDirection:'东流',destination:'江',recordText:'洛水出女几之山，东注于江。',sourceUrl:central},
  {id:'jiang-shui',name:'江水',chapterName:'中山经',mountainId:'central-min-9-02',mountainName:'岷山',relation:'发源',flowDirection:'东北流',destination:'海',recordText:'江水出岷山，东北流注于海。',sourceUrl:central,note:'此为《中山经》文本中的水系叙述，未将古今水名直接作现代水系等同。'},
  {id:'tuan-shui',name:'湍水',chapterName:'中山经',mountainId:'central-jing-11-01',mountainName:'翼望之山',relation:'发源',flowDirection:'东流',destination:'济',recordText:'湍水出翼望之山，东流注于济。',sourceUrl:central},
  {id:'kuang-shui',name:'贶水',chapterName:'中山经',mountainId:'central-jing-11-01',mountainName:'翼望之山',relation:'发源',flowDirection:'东南流',destination:'汉',recordText:'贶水出翼望之山，东南流注于汉，其中多蛟。',sourceUrl:central},
  {id:'ming-shui',name:'明水',chapterName:'中山经',mountainId:'central-ku-7-06',mountainName:'放皋之山',relation:'发源',flowDirection:'南流',destination:'伊水',recordText:'明水出放皋之山，南流注于伊水。',sourceUrl:central},
  {id:'xiu-shui',name:'休水',chapterName:'中山经',mountainId:'central-ku-7-09',mountainName:'少室之山',relation:'发源',flowDirection:'北流',destination:'洛',recordText:'休水出少室之山，北流注于洛。',sourceUrl:central},
  {id:'huang-suan-shui',name:'黄酸之水',chapterName:'中山经',mountainId:'central-bo-5-14',mountainName:'升山',relation:'发源',flowDirection:'北流',destination:'河',recordText:'黄酸之水出升山，北流注于河。',sourceUrl:central}
];
