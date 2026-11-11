export type MountainRitual = {
  id: string;
  routeId: string;
  chapterName: string;
  sectionName: string;
  deityDescription: string;
  ritualText: string;
  status: '篇末祠礼' | '局部祠礼' | '未载';
  sourceUrl: string;
  note?: string;
};

const south = 'https://zh.wikisource.org/zh-hans/山海經/南山經';
const west = 'https://zh.wikisource.org/wiki/山海經/西山經';
const north = 'https://zh.wikisource.org/zh-hans/北山經';
const east = 'https://zh.wikisource.org/zh-hans/山海經/東山經';
const central = 'https://zh.wikisource.org/zh-hans/中山經';

export const mountainRituals: MountainRitual[] = [
  {id:'ritual-south-1',routeId:'south-que',chapterName:'南山经',sectionName:'䧿山之首',deityDescription:'鸟身、龙首',ritualText:'毛用一璋玉瘗；糈用稌米；另记一璧、稻米，并以白菅为席。',status:'篇末祠礼',sourceUrl:south},
  {id:'ritual-south-2',routeId:'south-que-2',chapterName:'南山经',sectionName:'南次二经',deityDescription:'龙身、鸟首',ritualText:'毛用一璧瘗，糈用稌。',status:'篇末祠礼',sourceUrl:south},
  {id:'ritual-south-3',routeId:'south-que-3',chapterName:'南山经',sectionName:'南次三经',deityDescription:'龙身、人面',ritualText:'祠皆用一白狗祈，糈用稌。',status:'篇末祠礼',sourceUrl:south},
  {id:'ritual-west-1',routeId:'west-hua',chapterName:'西山经',sectionName:'华山之首',deityDescription:'篇末分别记华山、羭山及其余山神',ritualText:'华山为冢，祠用太牢；羭山神另用百犧、百瑜、百樽酒及百珪百璧；其余十七山属神用一羊祠。',status:'篇末祠礼',sourceUrl:west,note:'本段祭法分层明显，不宜压缩成单一牲礼。'},
  {id:'ritual-west-2',routeId:'west-hua-2',chapterName:'西山经',sectionName:'西次二经',deityDescription:'十神人面马身；七神人面牛身、四足一臂',ritualText:'相关山神祠礼记少牢、白菅为席；另有神祠用一雄鸡，钤而不糈。',status:'篇末祠礼',sourceUrl:west},
  {id:'ritual-west-3',routeId:'west-hua-3',chapterName:'西山经',sectionName:'西次三经',deityDescription:'羊身、人面',ritualText:'用一吉玉瘗，糈用稷米。',status:'篇末祠礼',sourceUrl:west},
  {id:'ritual-west-4',routeId:'west-hua-4',chapterName:'西山经',sectionName:'西次四经',deityDescription:'篇末未另述神形',ritualText:'祠礼皆用一白鸡祈，糈用稻米，白菅为席。',status:'篇末祠礼',sourceUrl:west},
  {id:'ritual-north-1',routeId:'north-danhu',chapterName:'北山经',sectionName:'北山经之首',deityDescription:'人面、蛇身',ritualText:'毛用一雄鸡彘瘗；吉玉用一珪，瘗而不糈。',status:'篇末祠礼',sourceUrl:north},
  {id:'ritual-north-2',routeId:'north-danhu-2',chapterName:'北山经',sectionName:'北次二经',deityDescription:'蛇身、人面',ritualText:'毛用一雄鸡彘瘗；用一璧、一珪，投而不糈。',status:'篇末祠礼',sourceUrl:north},
  {id:'ritual-north-3',routeId:'north-danhu-3',chapterName:'北山经',sectionName:'北次三经',deityDescription:'分为马身人面、彘身载玉、彘身八足蛇尾等神类',ritualText:'二十神用藻珪瘗；十四神以玉祠而不瘗；十神用一璧瘗；四十四神皆用稌糈米。',status:'篇末祠礼',sourceUrl:north},
  {id:'ritual-east-1',routeId:'east-shuxu',chapterName:'东山经',sectionName:'东山经之首',deityDescription:'人身、龙首',ritualText:'毛用一犬祈，䎶用鱼。',status:'篇末祠礼',sourceUrl:east},
  {id:'ritual-east-2',routeId:'east-shuxu-2',chapterName:'东山经',sectionName:'东次二经',deityDescription:'兽身、人面、载觡',ritualText:'毛用一鸡祈，婴用一璧瘗。',status:'篇末祠礼',sourceUrl:east},
  {id:'ritual-east-3',routeId:'east-shuxu-3',chapterName:'东山经',sectionName:'东次三经',deityDescription:'人身、羊角',ritualText:'用一牡羊，米用黍。',status:'篇末祠礼',sourceUrl:east},
  {id:'ritual-east-4',routeId:'east-shuxu-4',chapterName:'东山经',sectionName:'东次四经',deityDescription:'本段篇末未记神形',ritualText:'篇末仅记八山、一千七百二十里，未附本段专属祠礼条目。',status:'未载',sourceUrl:east},
  {id:'ritual-central-1',routeId:'central-boshan',chapterName:'中山经',sectionName:'薄山之首',deityDescription:'历儿为冢',ritualText:'历儿祠用太牢，县婴以吉玉；其余十三山用一羊，县婴用藻珪，瘗而不糈。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-2',routeId:'central-ji-2',chapterName:'中山经',sectionName:'中次二经',deityDescription:'人面、鸟身',ritualText:'祠用毛，并用一吉玉，投而不糈。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-3',routeId:'central-fu-3',chapterName:'中山经',sectionName:'中次三经',deityDescription:'泰逢、熏池、武罗等山神分别记载',ritualText:'泰逢、熏池、武罗皆用一牡羊副，婴用吉玉；另二神用一雄鸡瘗，糈用稌。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-4',routeId:'central-li-4',chapterName:'中山经',sectionName:'中次四经',deityDescription:'人面、兽身',ritualText:'毛用一白鸡，祈而不糈，以采衣之。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-5',routeId:'central-bo-5',chapterName:'中山经',sectionName:'中次五经',deityDescription:'升山为冢；首山有神；尸水另有合天之祀',ritualText:'升山祠用太牢、婴吉玉；首山祠用稌、黑牺、太牢，并有干舞、鼓与璧；尸水祭法另用黑犬、雌鸡、牝羊及吉玉。',status:'篇末祠礼',sourceUrl:central,note:'此段包含多种特殊祭法，当前仅作结构化摘要，需逐项校勘原文。'},
  {id:'ritual-central-6',routeId:'central-gaodi-6',chapterName:'中山经',sectionName:'中次六经',deityDescription:'平逢之山有骄虫之神',ritualText:'骄虫之祠用一雄鸡，禳而勿杀；篇末另记岳在其中，六月祭之，如诸岳之祠法。',status:'局部祠礼',sourceUrl:central},
  {id:'ritual-central-7',routeId:'central-ku-7',chapterName:'中山经',sectionName:'中次七经',deityDescription:'十六神为豕身人面；苦山、少室、太室另为冢',ritualText:'十六神毛牷用一羊羞，婴用藻玉瘗；苦山、少室、太室祠用太牢之具，婴以吉玉。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-8',routeId:'central-jing-8',chapterName:'中山经',sectionName:'中次八经',deityDescription:'鸟身、人面；骄山为冢',ritualText:'一般祠礼用一雄鸡祈瘗、一藻圭，糈用稌；骄山另用羞酒、少牢祈瘗，婴毛一璧。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-9',routeId:'central-min-9',chapterName:'中山经',sectionName:'中次九经',deityDescription:'马身、龙首；多座山另列为冢或帝',ritualText:'一般祠礼毛用一雄鸡瘗，糈用稌；文山、勾檷、风雨、騩等冢用羞酒、少牢、吉玉；熊山为帝，祠用太牢、一璧，并记干儛、璆冕舞。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-10',routeId:'central-shouyang-10',chapterName:'中山经',sectionName:'中次十经',deityDescription:'龙身、人面；堵山为冢，騩山为帝',ritualText:'一般祠礼毛用一雄鸡瘗，糈用五种之糈；堵山用少牢、羞酒与一璧；騩山用太牢、酒、巫祝二人舞及一璧。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-11',routeId:'central-jing-11',chapterName:'中山经',sectionName:'中次十一经',deityDescription:'彘身、人首；禾山为帝，堵山、玉山为冢',ritualText:'一般祠礼毛用一雄鸡祈，瘗用一珪，糈用五种之精；禾山另用太牢与璧；堵山、玉山倒祠，用少牢与吉玉。',status:'篇末祠礼',sourceUrl:central},
  {id:'ritual-central-12',routeId:'central-dongting-12',chapterName:'中山经',sectionName:'中次十二经',deityDescription:'鸟身、龙首；夫夫、即公、尧、阳帝为冢，洞庭、荣余为山神',ritualText:'一般祠礼毛用一雄鸡、一牝豚刏，糈用稌；四座冢用肆瘗、酒、少牢与吉玉；洞庭、荣余祠用太牢、酒，并婴圭璧十五。',status:'篇末祠礼',sourceUrl:central,note:'篇末山数底本文字“十万山”有疑，祭祀内容与山数校勘分开处理。'}
];
