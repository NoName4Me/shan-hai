export type CreatureKind = '兽' | '鸟' | '鱼' | '龟';

export type BestiaryEntry = {
  id: string;
  name: string;
  kind: CreatureKind;
  chapterId: string;
  chapterName: string;
  mountainId: string;
  mountainName: string;
  appearance: string;
  record: string;
  quote: string;
  sourceUrl: string;
  note: string;
};

export const bestiary: BestiaryEntry[] = [
  {
    id: 'lushu', name: '鹿蜀', kind: '兽', chapterId: 'nanshan-jing', chapterName: '南山经',
    mountainId: 'south-niuyang', mountainName: '杻阳之山',
    appearance: '马形，白首，身有虎纹，赤尾。',
    record: '原文称其声音如歌谣，并记“佩之宜子孙”。',
    quote: '其状如马而白首，其文如虎而赤尾，其音如谣，其名曰鹿蜀。',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    note: '这里仅呈现《南山经》的文字描述，不将后世图像定型当作原文事实。'
  },
  {
    id: 'xuangu', name: '旋龟', kind: '龟', chapterId: 'nanshan-jing', chapterName: '南山经',
    mountainId: 'south-niuyang', mountainName: '杻阳之山',
    appearance: '龟形，鸟首，虺尾。',
    record: '原文描述其声音如判木，并称佩之不聋。',
    quote: '其状如龟而鸟首虺尾，其名曰旋龟，其音如判木，佩之不聋。',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    note: '“虺尾”沿用原文用字；具体形态不在文本之外补造。'
  },
  {
    id: 'boyi', name: '猼訑', kind: '兽', chapterId: 'nanshan-jing', chapterName: '南山经',
    mountainId: 'south-jishan', mountainName: '基山',
    appearance: '羊形，九尾、四耳，眼睛生在背上。',
    record: '原文称佩之不畏。',
    quote: '其状如羊，九尾四耳，其目在背，其名曰猼訑，佩之不畏。',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    note: '异兽名字在不同整理本中存在字形差异，本站暂按所据维基文库本录入。'
  },
  {
    id: 'jiuweihu', name: '九尾狐', kind: '兽', chapterId: 'nanshan-jing', chapterName: '南山经',
    mountainId: 'south-qingqiu', mountainName: '青丘之山',
    appearance: '狐形，九尾，声音如婴儿。',
    record: '原文同时记载其能食人，以及食其肉“不蛊”的说法。',
    quote: '有兽焉，其状如狐而九尾，其音如婴儿，能食人；食者不蠱。',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    note: '此条属于《南山经》的青丘之山，不与《海外东经》的青丘国合并。'
  },
  {
    id: 'guanguan', name: '灌灌', kind: '鸟', chapterId: 'nanshan-jing', chapterName: '南山经',
    mountainId: 'south-qingqiu', mountainName: '青丘之山',
    appearance: '鸠形，鸣声如呵。',
    record: '原文称佩之不惑。',
    quote: '有鸟焉，其状如鸠，其音若呵，名曰灌灌，佩之不惑。',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    note: '“灌灌”是原文鸟名，不据后世同名词义另作解释。'
  },
  {
    id: 'chiru', name: '赤鱬', kind: '鱼', chapterId: 'nanshan-jing', chapterName: '南山经',
    mountainId: 'south-qingqiu', mountainName: '青丘之山',
    appearance: '鱼形，人面，声音如鸳鸯。',
    record: '原文记其食之不疥。',
    quote: '其中多赤鱬，其状如鱼而人面，其音如鸳鸯，食之不疥。',
    sourceUrl: 'https://zh.wikisource.org/zh/山海經/南山經',
    note: '文本将其记在英水中，地图关联到青丘之山这一水源地。'
  },
  {
    id: 'feiyi-bird', name: '肥遗', kind: '鸟', chapterId: 'xishan-jing', chapterName: '西山经',
    mountainId: 'west-ying', mountainName: '英山',
    appearance: '鹑形，黄身，赤喙。',
    record: '原文称食之已疠，可以杀虫。',
    quote: '有鸟焉，其状如鹑，黄身而赤喙，其名曰肥遗。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/西山經',
    note: '《山海经》中另有蛇形“肥遗”记载；此条特指英山所见之鸟，避免同名异物混淆。'
  },
  {
    id: 'quanshu', name: '䑏疏', kind: '兽', chapterId: 'beishan-jing', chapterName: '北山经',
    mountainId: 'north-dai', mountainName: '带山',
    appearance: '马形，独角，角上有错文。',
    record: '原文称其可以辟火。',
    quote: '有兽焉，其状如马，一角有错，其名曰䑏疏，可以辟火。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    note: '“错”字沿用原文，具体纹样不做超出文本的确定解释。'
  },
  {
    id: 'qitu', name: '鵸䳜', kind: '鸟', chapterId: 'beishan-jing', chapterName: '北山经',
    mountainId: 'north-dai', mountainName: '带山',
    appearance: '乌形，五彩，带赤色纹饰。',
    record: '原文称其自为牝牡，食之不疽。',
    quote: '有鸟焉，其状如乌，五采而赤文，名曰鵸䳜。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    note: '原文的“自为牝牡”属于文本描述，不据此延伸现代生物学结论。'
  },
  {
    id: 'heluoyu', name: '何罗之鱼', kind: '鱼', chapterId: 'beishan-jing', chapterName: '北山经',
    mountainId: 'north-qiaoming', mountainName: '谯明之山',
    appearance: '一首而十身，声音如犬吠。',
    record: '原文称食之已痈。',
    quote: '其中多何罗之鱼，一首而十身，其音如吠犬。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    note: '原文写作“何罗之鱼”，此处不将它改写为后世常见的其他异兽名称。'
  },
  {
    id: 'menghuai', name: '孟槐', kind: '兽', chapterId: 'beishan-jing', chapterName: '北山经',
    mountainId: 'north-qiaoming', mountainName: '谯明之山',
    appearance: '貆形，赤色豪毛。',
    record: '原文称其声音如榴榴，可以禦凶。',
    quote: '有兽焉，其状如貆而赤豪，其音如榴榴，名曰孟槐，可以禦凶。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    note: '形态与功用均按《北山经》原文摘录。'
  },
  {
    id: 'ershu', name: '耳鼠', kind: '兽', chapterId: 'beishan-jing', chapterName: '北山经',
    mountainId: 'north-danxun', mountainName: '丹熏之山',
    appearance: '鼠形，兔首、麋身，以尾飞。',
    record: '原文称食之不䐆，又可以禦百毒。',
    quote: '有兽焉，其状如鼠，而菟首麋身，其音如獆犬，以其尾飞，名曰耳鼠。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    note: '“以尾飞”照录原文，不在本条中解释为真实飞行机制。'
  },
  {
    id: 'yayu', name: '窫窳', kind: '兽', chapterId: 'beishan-jing', chapterName: '北山经',
    mountainId: 'north-shaoxian', mountainName: '少咸之山',
    appearance: '牛形，赤身、人面、马足，声音如婴儿。',
    record: '原文称其食人。',
    quote: '有兽焉，其状如牛，而赤身、人面、马足，名曰窫窳，其音如婴儿，是食人。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/北山經',
    note: '《山海经》不同篇章还有窫窳相关叙事，本条只对应《北山经》少咸之山这一条记录。'
  },
  {
    id: 'tongtong', name: '狪狪', kind: '兽', chapterId: 'dongshan-jing', chapterName: '东山经',
    mountainId: 'east-tai', mountainName: '泰山',
    appearance: '豚形，身有珠。',
    record: '原文称其鸣自訆。',
    quote: '有兽焉，其状如豚而有珠，名曰狪狪，其鸣自訆。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/東山經',
    note: '这里的泰山是《东山经》路线中的山名，不应直接等同于今山东泰山。'
  },
  {
    id: 'feifei', name: '朏朏', kind: '兽', chapterId: 'zhongshan-jing', chapterName: '中山经',
    mountainId: 'central-huo', mountainName: '霍山',
    appearance: '狸形，白尾，有鬛。',
    record: '原文称养之可以已忧。',
    quote: '有兽焉，其状如狸，而白尾有鬛，名曰朏朏，养之可以已忧。',
    sourceUrl: 'https://zh.wikisource.org/wiki/山海經/中山經',
    note: '此条出自《中山经》薄山之首路线，不与其他同名山地做现代地理合并。'
  }
];

export const creatureKinds = ['全部', '兽', '鸟', '鱼', '龟'] as const;
