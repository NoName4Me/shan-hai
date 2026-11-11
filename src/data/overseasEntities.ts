export type OverseasKind =
  | '古国' | '异人' | '人物' | '神祇' | '异兽' | '异鸟'
  | '山' | '水' | '神木' | '地理区域' | '神话事件' | '神话人物' | '神话意象' | '物产';

export type OverseasChapterId =
  | 'haiwai-nan-jing' | 'haiwai-xi-jing' | 'haiwai-bei-jing' | 'haiwai-dong-jing';

export type OverseasEntity = {
  id: string;
  name: string;
  kind: OverseasKind;
  chapterId: OverseasChapterId;
  chapterName: string;
  description: string;
  quote: string;
  sourceUrl: string;
  note?: string;
  graphId?: string;
};

export type OverseasRelation = {
  id: string;
  fromId: string;
  toId: string;
  relation: string;
  quote: string;
};

const sourceUrls: Record<OverseasChapterId, string> = {
  'haiwai-nan-jing': 'https://zh.wikisource.org/zh-hans/山海經/海外南經',
  'haiwai-xi-jing': 'https://zh.wikisource.org/zh-hans/山海經/海外西經',
  'haiwai-bei-jing': 'https://zh.wikisource.org/zh-hans/山海經/海外北經',
  'haiwai-dong-jing': 'https://zh.wikisource.org/zh-hans/山海經/海外東經'
};

const chapterNames: Record<OverseasChapterId, string> = {
  'haiwai-nan-jing': '海外南经',
  'haiwai-xi-jing': '海外西经',
  'haiwai-bei-jing': '海外北经',
  'haiwai-dong-jing': '海外东经'
};

function entity(
  chapterId: OverseasChapterId,
  id: string,
  name: string,
  kind: OverseasKind,
  description: string,
  quote: string,
  note?: string,
  graphId?: string
): OverseasEntity {
  return {
    id, name, kind, chapterId, chapterName: chapterNames[chapterId],
    description, quote, sourceUrl: sourceUrls[chapterId], note, graphId
  };
}

export const overseasEntities: OverseasEntity[] = [
  // 海外南经
  entity('haiwai-nan-jing', 'hn-jie-xiong', '结匈国', '古国', '原文记其人胸部形态异常；位于海外西南隅。', '结匈国在其西南，其为人结匈。'),
  entity('haiwai-nan-jing', 'hn-nan-shan', '南山', '山', '海外南经方位叙述中的山地锚点。', '南山在其东南。自此山来，虫为蛇，蛇号为鱼。'),
  entity('haiwai-nan-jing', 'hn-biyi', '比翼鸟', '异鸟', '青、赤两鸟并翼而飞；文本另有其位于南山东的异文。', '比翼鸟在其东，其为鸟青、赤，两鸟比翼。'),
  entity('haiwai-nan-jing', 'hn-yumin', '羽民国', '古国', '其人长头、身生羽；另一传本记作长颊。', '羽民国在其东南，其为人长头，身生羽。', '“长头”与“长颊”保留为文本异文，不据此补画统一族群形象。'),
  entity('haiwai-nan-jing', 'hn-night-gods', '二八神人', '神祇', '十六位连臂神人，为帝在此野司夜。', '有神人二八，连臂，为帝司夜于此野。'),
  entity('haiwai-nan-jing', 'hn-bifang', '毕方鸟', '异鸟', '原文记为一足；异文另有“人面一脚”。', '毕方鸟在其东，青水西，其为鸟一脚。', '仅保留原文的一足特征；不把后世图像设定写入古籍字段。'),
  entity('haiwai-nan-jing', 'hn-huantou', '讙头国', '古国', '其人面、有翼、鸟喙，正在捕鱼；又称讙朱国。', '讙头国在其南，其为人人面有翼，鸟喙，方捕鱼。', '异名“讙朱国”作为异文保留，不另建同一实体。'),
  entity('haiwai-nan-jing', 'hn-yanhuo', '厌火国', '古国', '其人兽身黑色，口中生火。', '厌火国在其南，兽身黑色。生火出其口中。'),
  entity('haiwai-nan-jing', 'hn-three-trees', '三株树', '神木', '生于赤水之上，形如柏，叶皆为珠。', '三株树在厌火北，生赤水上，其为树如柏，叶皆为珠。'),
  entity('haiwai-nan-jing', 'hn-red-river', '赤水', '水', '海外南经中与三株树、三苗国相关的水体。', '三株树在厌火北，生赤水上；三苗国在赤水东。'),
  entity('haiwai-nan-jing', 'hn-san-miao', '三苗国', '古国', '原文称其人相随；另有“三毛国”异文。', '三苗国在赤水东，其为人相随。', '“三毛国”为异文，不据此建立第二个国家实体。'),
  entity('haiwai-nan-jing', 'hn-zhi', '臷国', '古国', '其人黄色，能持弓射蛇。', '臷国在其东，其为人黄，能操弓射蛇。'),
  entity('haiwai-nan-jing', 'hn-guan-xiong', '贯匈国', '古国', '原文记其人胸有孔窍。', '贯匈国在其东，其为人匈有窍。'),
  entity('haiwai-nan-jing', 'hn-jiao-jing', '交胫国', '古国', '原文以“交胫”描述其人身体特征。', '交胫国在其东，其为人交胫。'),
  entity('haiwai-nan-jing', 'hn-busi', '不死民', '异人', '原文称其人黑色、长寿不死。', '不死民在其东，其为人黑色，寿，不死。'),
  entity('haiwai-nan-jing', 'hn-fan-she', '反舌国', '古国', '其人反舌；异文作支舌国或岐舌国。', '反舌国在其东，其为人反舌。', '“支舌国”“岐舌国”为文本异文。'),
  entity('haiwai-nan-jing', 'hn-kunlun', '昆仑虚', '山', '海外南经记载的方形之虚；不与海内西经的昆仑之虚自动合并。', '昆仑虚在其东，虚四方。', '同名或近名地理实体按篇章分开建档，暂不推定为同一地点。'),
  entity('haiwai-nan-jing', 'hn-shouhua', '寿华之野', '地理区域', '羿与凿齿交战的场所。', '羿与凿齿战于寿华之野，羿射杀之。'),
  entity('haiwai-nan-jing', 'hn-yi', '羿', '人物', '持弓矢，与凿齿在寿华之野交战。', '羿与凿齿战于寿华之野，羿持弓矢。'),
  entity('haiwai-nan-jing', 'hn-zaochi', '凿齿', '异人', '与羿交战；原文记其持盾，异文作持戈。', '羿与凿齿战于寿华之野，凿齿持盾。', '持盾与持戈为异文，不合并为确定器物。'),
  entity('haiwai-nan-jing', 'hn-three-head-country', '三首国', '古国', '其人一身三首。', '三首国在其东，其为人一身三首。'),
  entity('haiwai-nan-jing', 'hn-zhou-rao', '周饶国', '古国', '其人短小而冠带；又有焦侥国异文。', '周饶国在其东，其为人短小，冠带。', '“焦侥国”为异文。'),
  entity('haiwai-nan-jing', 'hn-long-arm', '长臂国', '古国', '其人入水捕鱼，两手各操一鱼。', '长臂国在其东，捕鱼水中，两手各操一鱼。'),
  entity('haiwai-nan-jing', 'hn-dishan', '狄山', '山', '帝尧葬于其阳、帝喾葬于其阴；另有汤山异名。', '狄山，帝尧葬于阳，帝喾葬于阴。', '文本另称汤山；本条暂以篇章主文“狄山”为名。'),
  entity('haiwai-nan-jing', 'hn-zhurong', '祝融', '神祇', '南方之神，兽身人面，乘两龙。', '南方祝融，兽身人面，乘两龙。'),

  // 海外西经
  entity('haiwai-xi-jing', 'hx-miemeng', '灭蒙鸟', '异鸟', '青色、赤尾，位于结匈国之北。', '灭蒙鸟在结匈国北，为鸟青，赤尾。'),
  entity('haiwai-xi-jing', 'hx-dayun', '大运山', '山', '高三百仞，位于灭蒙鸟之北。', '大运山高三百仞，在灭蒙鸟北。'),
  entity('haiwai-xi-jing', 'hx-dale-wilds', '大乐之野', '地理区域', '夏后启在此舞九代；异文作大遗之野。', '大乐之野，夏后启于此儛九代。', '“大遗之野”为异文。'),
  entity('haiwai-xi-jing', 'hx-xiahouqi', '夏后启', '人物', '在大乐之野舞九代；原文记其乘两龙、持翳与环、佩玉璜。', '夏后启于此儛九代；乘两龙，云盖三层。'),
  entity('haiwai-xi-jing', 'hx-three-body-country', '三身国', '古国', '其人一首而三身。', '三身国在夏后启北，一首而三身。'),
  entity('haiwai-xi-jing', 'hx-one-arm-country', '一臂国', '古国', '原文记一臂、一目、一鼻孔；并记黄马虎文。', '一臂国在其北，一臂、一目、一鼻孔。'),
  entity('haiwai-xi-jing', 'hx-qigong-country', '奇肱之国', '古国', '其人一臂三目，乘文马；旁有两头鸟。', '奇肱之国在其北，其人一臂三目，有阴有阳，乘文马。'),
  entity('haiwai-xi-jing', 'hx-two-headed-bird', '两头鸟', '异鸟', '奇肱之国旁所见，赤黄色、两头。', '有鸟焉，两头，赤黄色，在其旁。'),
  entity('haiwai-xi-jing', 'hx-xingtian', '刑天', '神话人物', '与帝争神，被断首葬于常羊之山；后以乳为目、脐为口，操干戚而舞。', '刑天与帝争神，帝断其首，葬之常羊之山，乃以乳为目，以脐为口，操干戚以舞。'),
  entity('haiwai-xi-jing', 'hx-changyang', '常羊之山', '山', '刑天被葬之山。', '帝断其首，葬之常羊之山。'),
  entity('haiwai-xi-jing', 'hx-nvji', '女祭', '人物', '与女戚并见于两水之间；女祭操俎。', '女祭、女戚在其北，居两水闲，戚操鱼觛，祭操俎。'),
  entity('haiwai-xi-jing', 'hx-nvqi', '女戚', '人物', '与女祭并见于两水之间；女戚操鱼觛。', '女祭、女戚在其北，居两水闲，戚操鱼觛，祭操俎。'),
  entity('haiwai-xi-jing', 'hx-ci-bird', '䳐鸟', '异鸟', '青黄色；原文称其所经之国亡，并记其人面、居山上。', '䳐鸟、𪆻鸟，其色青黄，所经国亡。䳐鸟人面，居山上。', '鸟名生僻，保留底本文字，不擅自替换为后世常见鸟名。'),
  entity('haiwai-xi-jing', 'hx-weibird', '维鸟', '异鸟', '原文以“一曰维鸟”记作异名，并称青鸟、黄鸟所集。', '一曰维鸟，青鸟、黄鸟所集。', '“维鸟”按原文异名单独建立检索节点，不擅自断定其与其他鸟名的分类关系。'),
  entity('haiwai-xi-jing', 'hx-meng-bird', '𪆻鸟', '异鸟', '与䳐鸟并见，原文记其色青黄。', '䳐鸟、𪆻鸟，其色青黄，所经国亡。', '生僻字形按所据维基文库文本录入。'),
  entity('haiwai-xi-jing', 'hx-virile-country', '丈夫国', '古国', '其人衣冠带剑。', '丈夫国在维鸟北，其为人衣冠带剑。'),
  entity('haiwai-xi-jing', 'hx-nvchou', '女丑之尸', '神话意象', '生而被十日炙杀，右手遮面；十日居上，女丑居山上。', '女丑之尸，生而十日炙杀之。在丈夫北。以右手鄣其面。'),
  entity('haiwai-xi-jing', 'hx-wuxian-country', '巫咸国', '古国', '右手操青蛇、左手操赤蛇；位于登葆山，群巫由此上下。', '巫咸国在女丑北，右手操青蛇，左手操赤蛇。在登葆山，群巫所从上下也。'),
  entity('haiwai-xi-jing', 'hx-dengbao', '登葆山', '山', '群巫由此上下的山。', '在登葆山，群巫所从上下也。'),
  entity('haiwai-xi-jing', 'hx-bingfeng', '并封', '异兽', '黑色，形如彘，前后皆有首。', '并封在巫咸东，其状如彘，前后皆有首，黑。'),
  entity('haiwai-xi-jing', 'hx-women-country', '女子国', '古国', '两女子居于其中，水环绕；另有居一门中的异文。', '女子国在巫咸北，两女子居，水周之。'),
  entity('haiwai-xi-jing', 'hx-xuanyuan-country', '轩辕之国', '古国', '人面蛇身，尾交于首上；原文记其不寿者亦八百岁。', '轩辕之国在女子国北。人面蛇身，尾交首上。'),
  entity('haiwai-xi-jing', 'hx-qiongshan', '穷山', '山', '在轩辕之国北；原文称其丘方，四蛇相绕。', '穷山在其北，不敢西射，畏轩辕之丘。'),
  entity('haiwai-xi-jing', 'hx-four-snakes', '四蛇', '神话意象', '四蛇相绕于轩辕之丘；诸夭之野在四蛇北。', '其丘方，四蛇相绕。诸夭之野……在四蛇北。'),
  entity('haiwai-xi-jing', 'hx-zhuyao-wilds', '诸夭之野', '地理区域', '鸾鸟自歌、凤鸟自舞；凤皇卵与甘露为当地饮食。', '诸夭之野，鸾鸟自歌，凤鸟自舞；凤皇卵，民食之；甘露，民饮之。'),
  entity('haiwai-xi-jing', 'hx-luan', '鸾鸟', '异鸟', '在诸夭之野自歌。', '鸾鸟自歌，凤鸟自舞。'),
  entity('haiwai-xi-jing', 'hx-feng', '凤鸟', '异鸟', '在诸夭之野自舞；原文另称凤皇卵。', '鸾鸟自歌，凤鸟自舞；凤皇卵，民食之。'),
  entity('haiwai-xi-jing', 'hx-longyu', '龙鱼', '异兽', '陵居，状如狸；另有鰕、鳖鱼等异文。', '龙鱼陵居在其北，状如狸。', '“一曰鰕”“一曰鳖鱼”作为异文备注，不与龙鱼强行合并为同一形态。'),
  entity('haiwai-xi-jing', 'hx-baimin-country', '白民之国', '古国', '其人白身披发；国中有乘黄。', '白民之国在龙鱼北，白身披发。'),
  entity('haiwai-xi-jing', 'hx-chenghuang', '乘黄', '异兽', '状如狐，背上有角；原文记乘之寿二千岁。', '有乘黄，其状如狐，其背上有角，乘之寿二千岁。'),
  entity('haiwai-xi-jing', 'hx-sushen-country', '肃慎之国', '古国', '国中有雒棠树，异文作雄常；圣人代立时于此取衣。', '肃慎之国在白民北，有树名曰雒棠，一作“雄常”。'),
  entity('haiwai-xi-jing', 'hx-luotang-tree', '雒棠', '神木', '肃慎之国的树，异文作雄常；文本称圣人代立时于此取衣。', '有树名曰雒棠，一作“雄常”，圣人代立，于此取衣。', '“雒棠”“雄常”按异文关系记录，暂不推定为两种树。'),
  entity('haiwai-xi-jing', 'hx-longleg-country', '长股之国', '古国', '其人被发；另有长脚异文。', '长股之国在雒棠北，被发。'),
  entity('haiwai-xi-jing', 'hx-rushou', '蓐收', '神祇', '西方之神，左耳有蛇，乘两龙。', '西方蓐收，左耳有蛇，乘两龙。'),

  // 海外北经
  entity('haiwai-bei-jing', 'hb-wuqi-country', '无启之国', '古国', '位于长股之东；国名另有异文。', '无启之国在长股东，为人无启。', '“无启”另有𦜹字异文，暂按主文立目。'),
  entity('haiwai-bei-jing', 'hb-zhongshan', '钟山', '山', '烛阴居于山下；与无启之国存在文本方位关系。', '锺山之神名曰烛阴……在无启之东……居锺山下。', '“锺山”按通行简体写作“钟山”；不与其他同名山脉合并。', 'place:zhongshan'),
  entity('haiwai-bei-jing', 'hb-zhuyin', '烛阴', '神祇', '钟山之神；视为昼、瞑为夜，吹为冬、呼为夏，息为风。', '锺山之神名曰烛阴，视为昼，瞑为夜，吹为冬，呼为夏。', '已有地图锚点使用“烛阴”节点，本条复用该节点。', 'mythic:zhuyin'),
  entity('haiwai-bei-jing', 'hb-one-eye-country', '一目国', '古国', '其人一目居面中央；异文另有手足描述。', '一目国在其东，一目中其面而居。'),
  entity('haiwai-bei-jing', 'hb-rouli-country', '柔利国', '古国', '其人一手一足、反膝；另有留利异名。', '柔利国在一目东，为人一手一足，反膝，曲足居上。'),
  entity('haiwai-bei-jing', 'hb-xiangliu', '相柳氏', '神话人物', '共工之臣，九首人面、青色蛇身；所抵之处成为泽谿。', '共工之臣曰相柳氏，九首，以食于九山。相柳者，九首人面，蛇身而青。'),
  entity('haiwai-bei-jing', 'hb-zhongdi-platform', '众帝之台', '地理区域', '禹厥治相柳之地后所筑之台；台四方，隅有一蛇。', '禹厥之，三仞三沮，乃以为众帝之台。'),
  entity('haiwai-bei-jing', 'hb-deep-eye-country', '深目国', '古国', '其人深目；异文涉及举手或举手一目。', '深目国在其东，为人深目，举一手。'),
  entity('haiwai-bei-jing', 'hb-no-intestines-country', '无肠之国', '古国', '其人身长而无肠。', '无肠之国在深目东，其为人长而无肠。'),
  entity('haiwai-bei-jing', 'hb-nieer-country', '聂耳之国', '古国', '其人以两手聂耳，驱使两文虎；居于海水之中。', '聂耳之国在无肠国东，使两文虎，为人两手聂其耳。'),
  entity('haiwai-bei-jing', 'hb-kuafu', '夸父', '人物', '与日逐走，饮河渭仍不足，欲北饮大泽，途中渴死；手杖化为邓林。', '夸父与日逐走，入日。渴，欲得饮，饮于河、渭。'),
  entity('haiwai-bei-jing', 'hb-kuafu-chase', '夸父逐日', '神话事件', '夸父追逐太阳，最终因渴而死。', '夸父与日逐走，入日。渴，欲得饮……未至，道渴而死。'),
  entity('haiwai-bei-jing', 'hb-daze', '大泽', '水', '夸父欲北饮之、未至而渴死的水域。', '北饮大泽。未至，道渴而死。'),
  entity('haiwai-bei-jing', 'hb-denglin', '邓林', '神木', '夸父弃杖所化；原文称其为二树木。', '弃其杖，化为邓林。'),
  entity('haiwai-bei-jing', 'hb-kuafu-country', '夸父国', '古国', '位于聂耳之东；其人为大，右手操青蛇、左手操黄蛇。', '夸父国在聂耳东，其为人大，右手操青蛇，左手操黄蛇。', '“夸父国”与逐日故事中的夸父分立为不同条目，不据同名合并。'),
  entity('haiwai-bei-jing', 'hb-jishi-mountain', '禹所积石之山', '山', '原文记其在夸父国之东，为河水所入。', '禹所积石之山在其东，河水所入。'),
  entity('haiwai-bei-jing', 'hb-he', '河', '水', '原文记河水所入于禹所积石之山。', '禹所积石之山在其东，河水所入。'),
  entity('haiwai-bei-jing', 'hb-juying-country', '拘瘿之国', '古国', '其人一手把瘿；国名有“拘缨”“利瘿”等异文。', '拘瘿之国在其东，一手把瘿。', '“拘缨”“利瘿”为异文。'),
  entity('haiwai-bei-jing', 'hb-xunmu', '寻木', '神木', '长千里，生于河上西北。', '寻木长千里，在拘瘿南，生河上西北。'),
  entity('haiwai-bei-jing', 'hb-qizhong-country', '跂踵国', '古国', '其人两足皆支；另有“大两足”等异文。', '跂踵国在拘瘿南，其为人两足皆支。'),
  entity('haiwai-bei-jing', 'hb-ousi-wilds', '欧丝之野', '地理区域', '一女子跪据树而欧丝。', '欧丝之野在反踵东，一女子跪据树欧丝。'),
  entity('haiwai-bei-jing', 'hb-sansang', '三桑', '神木', '无枝，木长百仞。', '三桑无枝，在欧丝东，其木长百仞，无枝。'),
  entity('haiwai-bei-jing', 'hb-fanlin', '范林', '地理区域', '方三百里，位于三桑之东。', '范林方三百里，在三桑东，洲环其下。'),
  entity('haiwai-bei-jing', 'hb-wuyu', '务隅之山', '山', '帝颛顼葬于其阳，九嫔葬于其阴。', '务隅之山，帝颛顼葬于阳，九嫔葬于阴。'),
  entity('haiwai-bei-jing', 'hb-pingqiu', '平丘', '地理区域', '有遗玉、青鸟、视肉、杨柳、甘柤、甘华；两山夹上谷。', '平丘在三桑东，爰有遗玉、青鸟、视肉、杨柳、甘柤、甘华。'),
  entity('haiwai-bei-jing', 'hb-taotie-beast', '𫘦𬳿', '异兽', '北海内所见，状如马；生僻兽名依底本保留。', '北海内有兽，其状如马，名曰𫘦𬳿。'),
  entity('haiwai-bei-jing', 'hb-bo', '駮', '异兽', '状如白马，锯牙，食虎豹。', '有兽焉，其名曰駮，状如白马，锯牙，食虎豹。'),
  entity('haiwai-bei-jing', 'hb-qiongqiong', '蛩蛩', '异兽', '北海内所见，状如马。', '有素兽焉，状如马，名曰蛩蛩。'),
  entity('haiwai-bei-jing', 'hb-luoluo', '罗罗', '异兽', '北海内所见，状如虎。', '有青兽焉，状如虎，名曰罗罗。'),
  entity('haiwai-bei-jing', 'hb-yujiang', '禺彊', '神祇', '北方之神，人面鸟身，珥两青蛇并践两青蛇。', '北方禺彊，人面鸟身，珥两青蛇。践两青蛇。'),

  // 海外东经
  entity('haiwai-dong-jing', 'he-jiaoqiu', '𨲠丘', '地理区域', '位于东海，两山夹丘；原文称此处百果所生。', '𨲠丘，爰有遗玉、青马、视肉、杨桃、甘柤、甘华。'),
  entity('haiwai-dong-jing', 'he-remnant-jade', '遗玉', '物产', '𨲠丘所产之一，原文未进一步描述形态。', '𨲠丘，爰有遗玉。'),
  entity('haiwai-dong-jing', 'he-qing-horse', '青马', '异兽', '𨲠丘所记异物之一，原文仅记名称。', '𨲠丘，爰有遗玉、青马、视肉。'),
  entity('haiwai-dong-jing', 'he-shirou', '视肉', '物产', '𨲠丘所记异物之一，平丘也再次出现此名。', '𨲠丘，爰有遗玉、青马、视肉。'),
  entity('haiwai-dong-jing', 'he-yangtao', '杨桃', '物产', '𨲠丘所记果木之一；原文有“杨柳”异文。', '𨲠丘，爰有……杨桃一作“柳”。', '“杨桃/杨柳”为异文，保留主文名与异文说明。'),
  entity('haiwai-dong-jing', 'he-ganzha', '甘柤', '物产', '𨲠丘所记果木。', '𨲠丘，爰有……甘柤。'),
  entity('haiwai-dong-jing', 'he-ganhua', '甘华', '物产', '原文称其为百果所生之处的相关物产。', '甘华，百果所生。'),
  entity('haiwai-dong-jing', 'he-great-person-country', '大人国', '古国', '其人为大，坐而削船。', '大人国在其北，为人大，坐而削船。'),
  entity('haiwai-dong-jing', 'he-shebi-corpse', '奢比之尸', '神话意象', '兽身、人面、大耳，耳珥两青蛇；异文作肝榆之尸。', '奢比之尸在其北，兽身、人面、大耳，珥两青蛇。', '“肝榆之尸”为异文。'),
  entity('haiwai-dong-jing', 'he-gentleman-country', '君子国', '古国', '衣冠带剑、食兽，使二虎在旁；其人好让不争。', '君子国在其北，衣冠带剑，食兽，使二文虎在旁，其人好让不争。'),
  entity('haiwai-dong-jing', 'he-double-heads', '𧈫𧈫', '异兽', '原文记其各有两首；字形依底本保留。', '𧈫𧈫在其北，各有两首。', '名称为生僻字形，未擅自替换为后世拟定名称。'),
  entity('haiwai-dong-jing', 'he-chaoyang-valley', '朝阳之谷', '地理区域', '位于两水之间；天吴为此处之神、水伯。', '朝阳之谷，神曰天吴，是为水伯。在𧈫𧈫北两水间。'),
  entity('haiwai-dong-jing', 'he-tianwu', '天吴', '神祇', '朝阳之谷之神、水伯；八首人面、八足八尾，背青黄。', '神曰天吴，是为水伯。其为兽也，八首人面，八足八尾。'),
  entity('haiwai-dong-jing', 'he-qingqiu-country', '青丘国', '古国', '其人食五谷、衣丝帛；另有其狐四足九尾的异文。', '青丘国在其北，其人食五谷，衣丝帛。', '与南山经青丘之山分卷建档，不因同名合并。', 'place:qingqiu-country'),
  entity('haiwai-dong-jing', 'he-shuhai', '竖亥', '人物', '奉帝命步量，自东极至西极；右手把算，左手指青丘北。', '帝命竖亥步，自东极至于西极……竖亥右手把算，左手指青丘北。'),
  entity('haiwai-dong-jing', 'he-black-teeth-country', '黑齿国', '古国', '其人黑，食稻啖蛇，旁有一赤一青之蛇。', '黑齿国在其北，为人黑，食稻啖蛇，一赤一青在其旁。'),
  entity('haiwai-dong-jing', 'he-tanggu', '汤谷', '水', '扶桑生于汤谷之上；十日于此沐浴。', '下有汤谷。汤谷上有扶桑，十日所浴。'),
  entity('haiwai-dong-jing', 'he-fusang', '扶桑', '神木', '生于汤谷水中；九日居下枝，一日居上枝。', '汤谷上有扶桑，十日所浴。在黑齿北，居水中，有大木，九日居下枝，一日居上枝。', '地图锚点原先将汤谷与扶桑合并；图谱中拆为水域与神木两个实体。', 'place:fusang'),
  entity('haiwai-dong-jing', 'he-ten-suns', '十日', '神话意象', '在扶桑上沐浴；九日居下枝，一日居上枝。', '汤谷上有扶桑，十日所浴……九日居下枝，一日居上枝。'),
  entity('haiwai-dong-jing', 'he-yushi-concubine', '雨师妾国', '古国', '其人黑，两手各操一蛇；耳侧亦有青蛇、赤蛇。', '雨师妾国在其北，其为人黑，两手各操一蛇，左耳有青蛇，右耳有赤蛇。'),
  entity('haiwai-dong-jing', 'he-xuangu-country', '玄股之国', '古国', '其人股黑，衣鱼食鸟；另有“衣鱼食䳼”等异文。', '玄股之国在其北，其为人股黑，衣鱼食䳼。', '保留“衣鱼食䳼”等底本字样，不据异文推定物种。'),
  entity('haiwai-dong-jing', 'he-maomin-country', '毛民之国', '古国', '其人身生毛。', '毛民之国在其北，为人身生毛。'),
  entity('haiwai-dong-jing', 'he-laomin-country', '劳民国', '古国', '其人黑，食果草实；异文作教民。', '劳民国在其北，其为人黑，食果草实。', '“教民”为异文。'),
  entity('haiwai-dong-jing', 'he-goumang', '句芒', '神祇', '东方之神，鸟身人面，乘两龙。', '东方句芒，鸟身人面，乘两龙。')
];

export const overseasRelations: OverseasRelation[] = [
  // 海外南经：保留原文明确方位，不推定现代坐标
  { id: 'hn-r-01', fromId: 'hn-jie-xiong', toId: 'hn-nan-shan', relation: '南山在其东南', quote: '南山在其东南。' },
  { id: 'hn-r-02', fromId: 'hn-nan-shan', toId: 'hn-biyi', relation: '比翼鸟在其东', quote: '比翼鸟在其东。' },
  { id: 'hn-r-03', fromId: 'hn-biyi', toId: 'hn-yumin', relation: '羽民国在其东南（异文）', quote: '羽民国在其东南。' },
  { id: 'hn-r-04', fromId: 'hn-yumin', toId: 'hn-night-gods', relation: '二八神人在羽民东', quote: '有神人二八，连臂……在羽民东。' },
  { id: 'hn-r-05', fromId: 'hn-night-gods', toId: 'hn-bifang', relation: '毕方鸟在其东（异文）', quote: '毕方鸟在其东……一曰在二八神东。' },
  { id: 'hn-r-06', fromId: 'hn-bifang', toId: 'hn-huantou', relation: '讙头国在其南', quote: '讙头国在其南。' },
  { id: 'hn-r-07', fromId: 'hn-huantou', toId: 'hn-yanhuo', relation: '厌火国在其南', quote: '厌火国在其南。' },
  { id: 'hn-r-08', fromId: 'hn-yanhuo', toId: 'hn-three-trees', relation: '三株树在厌火北', quote: '三株树在厌火北，生赤水上。' },
  { id: 'hn-r-09', fromId: 'hn-three-trees', toId: 'hn-red-river', relation: '三株树生于赤水', quote: '三株树……生赤水上。' },
  { id: 'hn-r-10', fromId: 'hn-red-river', toId: 'hn-san-miao', relation: '三苗国在赤水东', quote: '三苗国在赤水东。' },
  { id: 'hn-r-11', fromId: 'hn-san-miao', toId: 'hn-zhi', relation: '臷国在其东', quote: '臷国在其东。' },
  { id: 'hn-r-12', fromId: 'hn-zhi', toId: 'hn-guan-xiong', relation: '贯匈国在其东', quote: '贯匈国在其东。' },
  { id: 'hn-r-13', fromId: 'hn-guan-xiong', toId: 'hn-jiao-jing', relation: '交胫国在其东', quote: '交胫国在其东。' },
  { id: 'hn-r-14', fromId: 'hn-jiao-jing', toId: 'hn-busi', relation: '不死民在其东', quote: '不死民在其东。' },
  { id: 'hn-r-15', fromId: 'hn-busi', toId: 'hn-fan-she', relation: '反舌国在其东', quote: '反舌国在其东。' },
  { id: 'hn-r-16', fromId: 'hn-fan-she', toId: 'hn-kunlun', relation: '昆仑虚在其东', quote: '昆仑虚在其东。' },
  { id: 'hn-r-17', fromId: 'hn-kunlun', toId: 'hn-shouhua', relation: '羿与凿齿战于昆仑虚东的寿华之野', quote: '羿与凿齿战于寿华之野……在昆仑虚东。' },
  { id: 'hn-r-18', fromId: 'hn-shouhua', toId: 'hn-yi', relation: '羿在寿华之野射杀凿齿', quote: '羿与凿齿战于寿华之野，羿射杀之。' },
  { id: 'hn-r-19', fromId: 'hn-shouhua', toId: 'hn-zaochi', relation: '凿齿在寿华之野与羿交战', quote: '羿与凿齿战于寿华之野。' },
  { id: 'hn-r-20', fromId: 'hn-zaochi', toId: 'hn-three-head-country', relation: '三首国在凿齿东（异文）', quote: '一曰在凿齿东。' },
  { id: 'hn-r-21', fromId: 'hn-three-head-country', toId: 'hn-zhou-rao', relation: '周饶国在其东', quote: '周饶国在其东。' },
  { id: 'hn-r-22', fromId: 'hn-zhou-rao', toId: 'hn-long-arm', relation: '长臂国在其东', quote: '长臂国在其东。' },
  { id: 'hn-r-23', fromId: 'hn-long-arm', toId: 'hn-dishan', relation: '篇章转记狄山', quote: '狄山，帝尧葬于阳，帝喾葬于阴。' },
  { id: 'hn-r-24', fromId: 'hn-dishan', toId: 'hn-zhurong', relation: '篇末记南方祝融', quote: '南方祝融，兽身人面，乘两龙。' },

  // 海外西经
  { id: 'hx-r-01', fromId: 'hn-jie-xiong', toId: 'hx-miemeng', relation: '灭蒙鸟在结匈国北', quote: '灭蒙鸟在结匈国北。' },
  { id: 'hx-r-02', fromId: 'hx-miemeng', toId: 'hx-dayun', relation: '大运山在灭蒙鸟北', quote: '大运山高三百仞，在灭蒙鸟北。' },
  { id: 'hx-r-03', fromId: 'hx-dayun', toId: 'hx-dale-wilds', relation: '大乐之野在大运山北', quote: '大乐之野……在大运山北。' },
  { id: 'hx-r-04', fromId: 'hx-dale-wilds', toId: 'hx-xiahouqi', relation: '夏后启在此舞九代', quote: '夏后启于此儛九代。' },
  { id: 'hx-r-05', fromId: 'hx-xiahouqi', toId: 'hx-three-body-country', relation: '三身国在夏后启北', quote: '三身国在夏后启北。' },
  { id: 'hx-r-06', fromId: 'hx-three-body-country', toId: 'hx-one-arm-country', relation: '一臂国在其北', quote: '一臂国在其北。' },
  { id: 'hx-r-07', fromId: 'hx-one-arm-country', toId: 'hx-qigong-country', relation: '奇肱之国在其北', quote: '奇肱之国在其北。' },
  { id: 'hx-r-08', fromId: 'hx-qigong-country', toId: 'hx-two-headed-bird', relation: '奇肱之国旁有两头鸟', quote: '有鸟焉，两头，赤黄色，在其旁。' },
  { id: 'hx-r-09', fromId: 'hx-qigong-country', toId: 'hx-xingtian', relation: '篇中转记刑天与帝争神', quote: '刑天与帝争神，帝断其首。' },
  { id: 'hx-r-10', fromId: 'hx-xingtian', toId: 'hx-changyang', relation: '刑天葬于常羊之山', quote: '帝断其首，葬之常羊之山。' },
  { id: 'hx-r-11', fromId: 'hx-xingtian', toId: 'hx-nvji', relation: '女祭、女戚在其北', quote: '女祭、女戚在其北。' },
  { id: 'hx-r-12', fromId: 'hx-nvji', toId: 'hx-nvqi', relation: '女祭与女戚并见', quote: '女祭、女戚在其北。' },
  { id: 'hx-r-13', fromId: 'hx-nvji', toId: 'hx-ci-bird', relation: '䳐鸟、𪆻鸟在女祭北', quote: '䳐鸟、𪆻鸟……在女祭北。' },
  { id: 'hx-r-14', fromId: 'hx-ci-bird', toId: 'hx-meng-bird', relation: '两鸟并见', quote: '䳐鸟、𪆻鸟，其色青黄。' },
  { id: 'hx-r-14a', fromId: 'hx-ci-bird', toId: 'hx-weibird', relation: '异文称维鸟', quote: '一曰维鸟，青鸟、黄鸟所集。' },
  { id: 'hx-r-15', fromId: 'hx-weibird', toId: 'hx-virile-country', relation: '丈夫国在维鸟北', quote: '丈夫国在维鸟北。' },
  { id: 'hx-r-16', fromId: 'hx-virile-country', toId: 'hx-nvchou', relation: '女丑之尸在丈夫北', quote: '女丑之尸……在丈夫北。' },
  { id: 'hx-r-17', fromId: 'hx-nvchou', toId: 'hx-wuxian-country', relation: '巫咸国在女丑北', quote: '巫咸国在女丑北。' },
  { id: 'hx-r-18', fromId: 'hx-wuxian-country', toId: 'hx-dengbao', relation: '巫咸国在登葆山', quote: '在登葆山，群巫所从上下也。' },
  { id: 'hx-r-19', fromId: 'hx-wuxian-country', toId: 'hx-bingfeng', relation: '并封在巫咸东', quote: '并封在巫咸东。' },
  { id: 'hx-r-20', fromId: 'hx-wuxian-country', toId: 'hx-women-country', relation: '女子国在巫咸北', quote: '女子国在巫咸北。' },
  { id: 'hx-r-21', fromId: 'hx-women-country', toId: 'hx-xuanyuan-country', relation: '轩辕之国在女子国北', quote: '轩辕之国……在女子国北。' },
  { id: 'hx-r-22', fromId: 'hx-xuanyuan-country', toId: 'hx-qiongshan', relation: '穷山在轩辕国北', quote: '穷山在其北……在轩辕国北。' },
  { id: 'hx-r-23a', fromId: 'hx-qiongshan', toId: 'hx-four-snakes', relation: '轩辕之丘四蛇相绕', quote: '其丘方，四蛇相绕。' },
  { id: 'hx-r-23', fromId: 'hx-four-snakes', toId: 'hx-zhuyao-wilds', relation: '诸夭之野在四蛇北', quote: '诸夭之野……在四蛇北。' },
  { id: 'hx-r-24', fromId: 'hx-zhuyao-wilds', toId: 'hx-luan', relation: '鸾鸟在野中自歌', quote: '鸾鸟自歌。' },
  { id: 'hx-r-25', fromId: 'hx-zhuyao-wilds', toId: 'hx-feng', relation: '凤鸟在野中自舞', quote: '凤鸟自舞。' },
  { id: 'hx-r-26', fromId: 'hx-zhuyao-wilds', toId: 'hx-longyu', relation: '龙鱼在其北', quote: '龙鱼陵居在其北。' },
  { id: 'hx-r-27', fromId: 'hx-longyu', toId: 'hx-baimin-country', relation: '白民之国在龙鱼北', quote: '白民之国在龙鱼北。' },
  { id: 'hx-r-28', fromId: 'hx-baimin-country', toId: 'hx-chenghuang', relation: '白民之国有乘黄', quote: '有乘黄，其状如狐，其背上有角。' },
  { id: 'hx-r-29', fromId: 'hx-baimin-country', toId: 'hx-sushen-country', relation: '肃慎之国在白民北', quote: '肃慎之国在白民北。' },
  { id: 'hx-r-30', fromId: 'hx-sushen-country', toId: 'hx-luotang-tree', relation: '肃慎之国有雒棠树', quote: '肃慎之国……有树名曰雒棠。' },
  { id: 'hx-r-31', fromId: 'hx-sushen-country', toId: 'hx-longleg-country', relation: '长股之国在雒棠北', quote: '长股之国在雒棠北。' },
  { id: 'hx-r-32', fromId: 'hx-longleg-country', toId: 'hx-rushou', relation: '篇末记西方蓐收', quote: '西方蓐收，左耳有蛇，乘两龙。' },

  // 海外北经
  { id: 'hb-r-01', fromId: 'hx-longleg-country', toId: 'hb-wuqi-country', relation: '无启之国在长股东', quote: '无启之国在长股东。' },
  { id: 'hb-r-02', fromId: 'hb-wuqi-country', toId: 'hb-zhongshan', relation: '钟山在无启之东', quote: '锺山之神名曰烛阴……在无启之东。' },
  { id: 'hb-r-03', fromId: 'hb-zhongshan', toId: 'hb-zhuyin', relation: '钟山之神名曰烛阴', quote: '锺山之神名曰烛阴。' },
  { id: 'hb-r-04', fromId: 'hb-zhongshan', toId: 'hb-one-eye-country', relation: '一目国在其东', quote: '一目国在其东。' },
  { id: 'hb-r-05', fromId: 'hb-one-eye-country', toId: 'hb-rouli-country', relation: '柔利国在一目东', quote: '柔利国在一目东。' },
  { id: 'hb-r-06', fromId: 'hb-rouli-country', toId: 'hb-xiangliu', relation: '相柳记于柔利之东', quote: '在昆仑之北，柔利之东。' },
  { id: 'hb-r-07', fromId: 'hb-xiangliu', toId: 'hb-zhongdi-platform', relation: '禹治相柳之地后为众帝之台', quote: '禹厥之……乃以为众帝之台。' },
  { id: 'hb-r-08', fromId: 'hb-zhongdi-platform', toId: 'hb-deep-eye-country', relation: '深目国在其东（异文称共工台东）', quote: '深目国在其东……一曰在共工台东。' },
  { id: 'hb-r-09', fromId: 'hb-deep-eye-country', toId: 'hb-no-intestines-country', relation: '无肠之国在深目东', quote: '无肠之国在深目东。' },
  { id: 'hb-r-10', fromId: 'hb-no-intestines-country', toId: 'hb-nieer-country', relation: '聂耳之国在无肠国东', quote: '聂耳之国在无肠国东。' },
  { id: 'hb-r-11', fromId: 'hb-nieer-country', toId: 'hb-kuafu', relation: '夸父逐日故事接续于聂耳之国之后', quote: '夸父与日逐走，入日。' },
  { id: 'hb-r-12', fromId: 'hb-kuafu', toId: 'hb-kuafu-chase', relation: '夸父逐日', quote: '夸父与日逐走，入日。' },
  { id: 'hb-r-13', fromId: 'hb-kuafu', toId: 'hb-daze', relation: '夸父欲北饮大泽', quote: '北饮大泽。未至，道渴而死。' },
  { id: 'hb-r-14', fromId: 'hb-kuafu', toId: 'hb-denglin', relation: '夸父弃杖化为邓林', quote: '弃其杖，化为邓林。' },
  { id: 'hb-r-15', fromId: 'hb-nieer-country', toId: 'hb-kuafu-country', relation: '夸父国在聂耳东', quote: '夸父国在聂耳东。' },
  { id: 'hb-r-16', fromId: 'hb-kuafu-country', toId: 'hb-jishi-mountain', relation: '积石之山在其东', quote: '禹所积石之山在其东。' },
  { id: 'hb-r-17', fromId: 'hb-jishi-mountain', toId: 'hb-he', relation: '积石之山为河水所入', quote: '禹所积石之山……河水所入。' },
  { id: 'hb-r-18', fromId: 'hb-jishi-mountain', toId: 'hb-juying-country', relation: '拘瘿之国在其东', quote: '拘瘿之国在其东。' },
  { id: 'hb-r-19', fromId: 'hb-juying-country', toId: 'hb-xunmu', relation: '寻木在拘瘿南，生河上西北', quote: '寻木长千里，在拘瘿南，生河上西北。' },
  { id: 'hb-r-20', fromId: 'hb-juying-country', toId: 'hb-qizhong-country', relation: '跂踵国在拘瘿南', quote: '跂踵国在拘瘿南。' },
  { id: 'hb-r-21', fromId: 'hb-qizhong-country', toId: 'hb-ousi-wilds', relation: '欧丝之野在反踵东', quote: '欧丝之野在反踵东。' },
  { id: 'hb-r-22', fromId: 'hb-ousi-wilds', toId: 'hb-sansang', relation: '三桑在欧丝东', quote: '三桑无枝，在欧丝东。' },
  { id: 'hb-r-23', fromId: 'hb-sansang', toId: 'hb-fanlin', relation: '范林在三桑东', quote: '范林方三百里，在三桑东。' },
  { id: 'hb-r-24', fromId: 'hb-fanlin', toId: 'hb-wuyu', relation: '篇中转记务隅之山', quote: '务隅之山，帝颛顼葬于阳。' },
  { id: 'hb-r-25', fromId: 'hb-sansang', toId: 'hb-pingqiu', relation: '平丘在三桑东', quote: '平丘在三桑东。' },
  { id: 'hb-r-26', fromId: 'hb-pingqiu', toId: 'hb-taotie-beast', relation: '篇末记北海内异兽', quote: '北海内有兽，其状如马，名曰𫘦𬳿。' },
  { id: 'hb-r-27', fromId: 'hb-taotie-beast', toId: 'hb-bo', relation: '北海内异兽并列记载', quote: '有兽焉，其名曰駮，状如白马。' },
  { id: 'hb-r-28', fromId: 'hb-bo', toId: 'hb-qiongqiong', relation: '北海内异兽并列记载', quote: '有素兽焉，状如马，名曰蛩蛩。' },
  { id: 'hb-r-29', fromId: 'hb-qiongqiong', toId: 'hb-luoluo', relation: '北海内异兽并列记载', quote: '有青兽焉，状如虎，名曰罗罗。' },
  { id: 'hb-r-30', fromId: 'hb-luoluo', toId: 'hb-yujiang', relation: '篇末记北方禺彊', quote: '北方禺彊，人面鸟身，珥两青蛇。' },

  // 海外东经
  { id: 'he-r-01', fromId: 'he-jiaoqiu', toId: 'he-great-person-country', relation: '大人国在其北', quote: '大人国在其北。' },
  { id: 'he-r-02', fromId: 'he-great-person-country', toId: 'he-shebi-corpse', relation: '奢比之尸在其北', quote: '奢比之尸在其北。' },
  { id: 'he-r-03', fromId: 'he-shebi-corpse', toId: 'he-gentleman-country', relation: '君子国在其北', quote: '君子国在其北。' },
  { id: 'he-r-04', fromId: 'he-gentleman-country', toId: 'he-double-heads', relation: '𧈫𧈫在其北', quote: '𧈫𧈫在其北，各有两首。' },
  { id: 'he-r-05', fromId: 'he-double-heads', toId: 'he-chaoyang-valley', relation: '朝阳之谷在两水之间、其北', quote: '朝阳之谷……在𧈫𧈫北两水间。' },
  { id: 'he-r-06', fromId: 'he-chaoyang-valley', toId: 'he-tianwu', relation: '朝阳之谷神曰天吴', quote: '朝阳之谷，神曰天吴，是为水伯。' },
  { id: 'he-r-07', fromId: 'he-chaoyang-valley', toId: 'he-qingqiu-country', relation: '青丘国在其北', quote: '青丘国在其北。' },
  { id: 'he-r-08', fromId: 'he-shuhai', toId: 'he-qingqiu-country', relation: '竖亥左手指青丘北', quote: '竖亥右手把算，左手指青丘北。' },
  { id: 'he-r-09', fromId: 'he-shuhai', toId: 'he-black-teeth-country', relation: '竖亥条后接黑齿国（“其北”指代待校）', quote: '黑齿国在其北。' },
  { id: 'he-r-10', fromId: 'he-black-teeth-country', toId: 'he-tanggu', relation: '汤谷在黑齿北', quote: '汤谷上有扶桑……在黑齿北。' },
  { id: 'he-r-11', fromId: 'he-tanggu', toId: 'he-fusang', relation: '汤谷上有扶桑', quote: '汤谷上有扶桑。' },
  { id: 'he-r-12', fromId: 'he-tanggu', toId: 'he-ten-suns', relation: '十日于汤谷沐浴', quote: '汤谷上有扶桑，十日所浴。' },
  { id: 'he-r-13', fromId: 'he-fusang', toId: 'he-ten-suns', relation: '十日分居扶桑枝上', quote: '九日居下枝，一日居上枝。' },
  { id: 'he-r-14', fromId: 'he-fusang', toId: 'he-yushi-concubine', relation: '雨师妾国在其北；异文称在十日北', quote: '雨师妾国在其北……一曰在十日北。' },
  { id: 'he-r-15', fromId: 'he-yushi-concubine', toId: 'he-xuangu-country', relation: '玄股之国在其北', quote: '玄股之国在其北。' },
  { id: 'he-r-16', fromId: 'he-xuangu-country', toId: 'he-maomin-country', relation: '毛民之国在其北', quote: '毛民之国在其北。' },
  { id: 'he-r-17', fromId: 'he-maomin-country', toId: 'he-laomin-country', relation: '劳民国在其北', quote: '劳民国在其北。' },
  { id: 'he-r-18', fromId: 'he-laomin-country', toId: 'he-goumang', relation: '篇末记东方句芒', quote: '东方句芒，鸟身人面，乘两龙。' }
];
