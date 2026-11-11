export type AtlasLocation = {
  id: string;
  name: string;
  english: string;
  sub: string;
  x: number;
  y: number;
  available: boolean;
};
export const locations: AtlasLocation[] = [
  { id: 'kunlun', name: '昆仑之虚', english: 'KUNLUN', sub: '西海之南 · 神山', x: 27, y: 35, available: false },
  { id: 'zhongshan', name: '钟山', english: 'ZHONGSHAN', sub: '烛阴之居', x: 57, y: 25, available: false },
  { id: 'qingqiu', name: '青丘之山', english: 'QINGQIU', sub: '南山经 · 九尾狐', x: 68, y: 66, available: true },
  { id: 'fusang', name: '汤谷扶桑', english: 'FUSANG', sub: '十日所浴', x: 87, y: 47, available: false },
  { id: 'buzhou', name: '不周之山', english: 'BUZHOU', sub: '西北海之外', x: 16, y: 21, available: false }
];
