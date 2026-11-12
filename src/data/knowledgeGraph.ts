import { mountainRoutes } from './mountainRoutes';
import { waterways } from './waterways';
import { mountainResources } from './mountainResources';
import { bestiary } from './bestiary';
import { mountainRituals } from './mountainRituals';
import { chapters, locations } from '../atlas';
import { overseasEntities, overseasRelations, type OverseasKind } from './overseasEntities';
import { inlandEntities, inlandRelations, inlandChapterNotes } from './inlandEntities';
import { dahuangEntities, dahuangRelations, dahuangChapterNotes } from './dahuangEntities';
import { haineiClassicEntities, haineiClassicRelations, haineiClassicCrossLinks, haineiClassicChapterNote } from './haineiClassicEntities';

export type KnowledgeKind = '山' | '水' | '物产' | '异兽' | '祀典' | '神形' | '古国' | '神祇' | '神话意象' | '篇章' | OverseasKind;
export type KnowledgeNode = {
  id: string;
  label: string;
  kind: KnowledgeKind;
  chapterName: string;
  description: string;
  sourceUrl?: string;
  sourceText?: string;
};
export type KnowledgeEdge = {
  id: string;
  from: string;
  to: string;
  relation: string;
  chapterName: string;
  sourceUrl?: string;
  sourceText?: string;
};

const nodes = new Map<string, KnowledgeNode>();
const edges = new Map<string, KnowledgeEdge>();

function addNode(node: KnowledgeNode) {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}
function addEdge(edge: KnowledgeEdge) {
  if (edge.from === edge.to) return;
  const duplicate = [...edges.values()].some(
    (existing) => existing.from === edge.from && existing.to === edge.to && existing.relation === edge.relation
  );
  if (!duplicate) edges.set(edge.id, edge);
}

for (const route of mountainRoutes) {
  route.nodes.forEach((mountain, index) => {
    addNode({
      id: mountain.id,
      label: mountain.name,
      kind: '山',
      chapterName: route.chapterName,
      description: [route.sectionName, mountain.kind === '路段' ? '特殊行程记录' : '山名节点', mountain.resourceSummary].filter(Boolean).join(' · '),
      sourceUrl: route.sourceUrl
    });
    if (index > 0) {
      const previous = route.nodes[index - 1];
      const relation = mountain.distanceText
        ? mountain.distanceText
        : mountain.distanceLi
          ? (mountain.direction ?? '') + mountain.distanceLi + '里'
          : '路线相邻（原文距离未结构化）';
      addEdge({
        id: 'route:' + previous.id + ':' + mountain.id,
        from: previous.id,
        to: mountain.id,
        relation,
        chapterName: route.chapterName,
        sourceUrl: route.sourceUrl
      });
    }
  });
}

for (const item of waterways) {
  const id = 'water:' + item.id;
  addNode({
    id,
    label: item.name,
    kind: '水',
    chapterName: item.chapterName,
    description: [item.relation, item.flowDirection, item.destination && '注入' + item.destination].filter(Boolean).join(' · '),
    sourceUrl: item.sourceUrl,
    sourceText: item.recordText
  });
  addEdge({
    id: 'water-origin:' + item.id,
    from: item.mountainId,
    to: id,
    relation: item.relation,
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.recordText
  });
  if (item.destination) {
    const destinationId = 'watershed:' + item.chapterName + ':' + item.destination;
    addNode({
      id: destinationId,
      label: item.destination,
      kind: '水',
      chapterName: item.chapterName,
      description: '原文所记注入水域或承接水体',
      sourceUrl: item.sourceUrl
    });
    addEdge({
      id: 'water-destination:' + item.id,
      from: id,
      to: destinationId,
      relation: item.flowDirection ? item.flowDirection + '注入' : '注入',
      chapterName: item.chapterName,
      sourceUrl: item.sourceUrl,
      sourceText: item.recordText
    });
  }
}

for (const item of mountainResources) {
  const id = 'resource:' + item.id;
  addNode({
    id,
    label: item.name,
    kind: '物产',
    chapterName: item.chapterName,
    description: item.category + ' · ' + item.mountainName,
    sourceUrl: item.sourceUrl,
    sourceText: item.recordText
  });
  addEdge({
    id: 'resource-origin:' + item.id,
    from: item.mountainId,
    to: id,
    relation: '记有物产',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.recordText
  });
}

for (const item of bestiary) {
  const id = 'creature:' + item.id;
  addNode({
    id,
    label: item.name,
    kind: '异兽',
    chapterName: item.chapterName,
    description: item.appearance,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
  addEdge({
    id: 'creature-origin:' + item.id,
    from: item.mountainId,
    to: id,
    relation: '见于',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
}

const seaLocationKinds: Record<string, KnowledgeKind> = {
  'qingqiu-country': '古国',
  'fusang': '神木',
  'kunlun': '山',
  'zhongshan': '山',
  'buzhou': '山'
};

for (const place of locations.filter((item) => !['nanshan-jing', 'xishan-jing', 'beishan-jing', 'dongshan-jing', 'zhongshan-jing'].includes(item.chapterId))) {
  const chapter = chapters.find((item) => item.id === place.chapterId);
  const chapterNodeId = 'chapter:' + place.chapterId;
  addNode({
    id: chapterNodeId,
    label: chapter?.name ?? place.chapterId,
    kind: '篇章',
    chapterName: chapter?.name ?? place.chapterId,
    description: chapter?.summary ?? '《山海经》篇章索引'
  });
  const placeId = 'place:' + place.id;
  addNode({
    id: placeId,
    label: place.name,
    kind: seaLocationKinds[place.id] ?? '神话意象',
    chapterName: chapter?.name ?? place.chapterId,
    description: place.relation + ' ' + place.note,
    sourceUrl: place.sourceUrl,
    sourceText: place.quote
  });
  addEdge({
    id: 'chapter-place:' + place.id,
    from: chapterNodeId,
    to: placeId,
    relation: '本篇记载',
    chapterName: chapter?.name ?? place.chapterId,
    sourceUrl: place.sourceUrl,
    sourceText: place.quote
  });
}

const seaMythicLinks = [
  { placeId: 'kunlun', id: 'lower-capital', label: '帝之下都', relation: '原文称为', placeLabel: '昆仑之虚', chapterId: 'hainei-xi-jing', chapterName: '海内西经', quote: '海内昆仑之虚，在西北，帝之下都。', sourceUrl: 'https://zh.wikisource.org/zh-hans/山海經/海內西經' }
];
for (const item of seaMythicLinks) {
  const nodeId = 'mythic:' + item.id;
  addNode({
    id: nodeId,
    label: item.label,
    kind: '神话意象',
    chapterName: item.chapterName,
    description: '原文将' + item.placeLabel + '称为“' + item.label + '”。',
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
  addEdge({
    id: 'sea-mythic:' + item.id,
    from: 'place:' + item.placeId,
    to: nodeId,
    relation: item.relation,
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
}

for (const chapterId of new Set(overseasEntities.map((item) => item.chapterId))) {
  const chapter = chapters.find((item) => item.id === chapterId);
  addNode({
    id: 'chapter:' + chapterId,
    label: chapter?.name ?? chapterId,
    kind: '篇章',
    chapterName: chapter?.name ?? chapterId,
    description: chapter?.summary ?? '《山海经》篇章索引'
  });
}

const overseasGraphIds = new Map<string, string>();
const overseasById = new Map(overseasEntities.map((item) => [item.id, item]));
for (const item of overseasEntities) {
  const nodeId = item.graphId ?? 'overseas:' + item.id;
  overseasGraphIds.set(item.id, nodeId);
  addNode({
    id: nodeId,
    label: item.name,
    kind: item.kind,
    chapterName: item.chapterName,
    description: item.description + (item.note ? ' · ' + item.note : ''),
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
  addEdge({
    id: 'overseas-chapter:' + item.id,
    from: 'chapter:' + item.chapterId,
    to: nodeId,
    relation: '本篇记载',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
}
for (const relation of overseasRelations) {
  const from = overseasGraphIds.get(relation.fromId);
  const to = overseasGraphIds.get(relation.toId);
  const source = overseasById.get(relation.fromId);
  if (!from || !to || !source) continue;
  addEdge({
    id: 'overseas-relation:' + relation.id,
    from,
    to,
    relation: relation.relation,
    chapterName: source.chapterName,
    sourceUrl: source.sourceUrl,
    sourceText: relation.quote
  });
}

const inlandGraphIds = new Map<string, string>();
const inlandById = new Map(inlandEntities.map((item) => [item.id, item]));
for (const chapterId of new Set(inlandEntities.map((item) => item.chapterId))) {
  const chapter = chapters.find((item) => item.id === chapterId);
  const editorialNote = inlandChapterNotes.find((item) => item.chapterId === chapterId)?.note;
  addNode({
    id: 'chapter:' + chapterId,
    label: chapter?.name ?? chapterId,
    kind: '篇章',
    chapterName: chapter?.name ?? chapterId,
    description: [chapter?.summary, editorialNote].filter(Boolean).join(' · ') || '《山海经》篇章索引'
  });
}
for (const item of inlandEntities) {
  const nodeId = item.graphId ?? 'inland:' + item.id;
  inlandGraphIds.set(item.id, nodeId);
  addNode({
    id: nodeId,
    label: item.name,
    kind: item.kind,
    chapterName: item.chapterName,
    description: item.description + (item.note ? ' · ' + item.note : ''),
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
  addEdge({
    id: 'inland-chapter:' + item.id,
    from: 'chapter:' + item.chapterId,
    to: nodeId,
    relation: '本篇记载',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
}
for (const relation of inlandRelations) {
  const from = inlandGraphIds.get(relation.fromId);
  const to = inlandGraphIds.get(relation.toId);
  const source = inlandById.get(relation.fromId);
  if (!from || !to || !source) continue;
  addEdge({
    id: 'inland-relation:' + relation.id,
    from,
    to,
    relation: relation.relation,
    chapterName: source.chapterName,
    sourceUrl: source.sourceUrl,
    sourceText: relation.quote
  });
}

const dahuangGraphIds = new Map<string, string>();
const dahuangById = new Map(dahuangEntities.map((item) => [item.id, item]));
for (const chapterId of new Set(dahuangEntities.map((item) => item.chapterId))) {
  const chapter = chapters.find((item) => item.id === chapterId);
  const editorialNote = dahuangChapterNotes.find((item) => item.chapterId === chapterId)?.note;
  addNode({
    id: 'chapter:' + chapterId,
    label: chapter?.name ?? chapterId,
    kind: '篇章',
    chapterName: chapter?.name ?? chapterId,
    description: [chapter?.summary, editorialNote].filter(Boolean).join(' · ') || '《山海经》篇章索引'
  });
}
for (const item of dahuangEntities) {
  const nodeId = 'dahuang:' + item.id;
  dahuangGraphIds.set(item.id, nodeId);
  addNode({
    id: nodeId,
    label: item.name,
    kind: item.kind,
    chapterName: item.chapterName,
    description: item.description + (item.note ? ' · ' + item.note : ''),
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
  addEdge({
    id: 'dahuang-chapter:' + item.id,
    from: 'chapter:' + item.chapterId,
    to: nodeId,
    relation: '本篇记载',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
}
for (const relation of dahuangRelations) {
  const from = dahuangGraphIds.get(relation.fromId);
  const to = dahuangGraphIds.get(relation.toId);
  const source = dahuangById.get(relation.fromId);
  if (!from || !to || !source) continue;
  addEdge({
    id: 'dahuang-relation:' + relation.id,
    from,
    to,
    relation: relation.relation,
    chapterName: source.chapterName,
    sourceUrl: source.sourceUrl,
    sourceText: relation.quote
  });
}

const haineiClassicGraphIds = new Map<string, string>();
const haineiClassicById = new Map(haineiClassicEntities.map((item) => [item.id, item]));
const haineiClassicChapter = chapters.find((item) => item.id === 'hainei-jing');
addNode({
  id: 'chapter:hainei-jing',
  label: haineiClassicChapter?.name ?? '海内经',
  kind: '篇章',
  chapterName: '海内经',
  description: [haineiClassicChapter?.summary, haineiClassicChapterNote].filter(Boolean).join(' · ')
});
for (const item of haineiClassicEntities) {
  const nodeId = item.graphId ?? 'hainei-classic:' + item.id;
  haineiClassicGraphIds.set(item.id, nodeId);
  addNode({
    id: nodeId,
    label: item.name,
    kind: item.kind,
    chapterName: item.chapterName,
    description: item.description + (item.note ? ' · ' + item.note : ''),
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
  addEdge({
    id: 'hainei-classic-chapter:' + item.id,
    from: 'chapter:hainei-jing',
    to: nodeId,
    relation: '本篇记载',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl,
    sourceText: item.quote
  });
}
for (const relation of haineiClassicRelations) {
  const from = haineiClassicGraphIds.get(relation.fromId);
  const to = haineiClassicGraphIds.get(relation.toId);
  const source = haineiClassicById.get(relation.fromId);
  if (!from || !to || !source) continue;
  addEdge({
    id: 'hainei-classic-relation:' + relation.id,
    from,
    to,
    relation: relation.relation,
    chapterName: source.chapterName,
    sourceUrl: source.sourceUrl,
    sourceText: relation.quote
  });
}
for (const link of haineiClassicCrossLinks) {
  const from = haineiClassicGraphIds.get(link.fromId);
  const source = haineiClassicById.get(link.fromId);
  if (!from || !source) continue;
  addEdge({
    id: 'hainei-classic-cross:' + link.id,
    from,
    to: link.toGraphId,
    relation: link.relation,
    chapterName: source.chapterName + ' ↔ ' + link.targetChapterName,
    sourceUrl: source.sourceUrl,
    sourceText: link.quote
  });
}

for (const item of mountainRituals) {
  const route = mountainRoutes.find((candidate) => candidate.id === item.routeId);
  const firstMountain = route?.nodes[0];
  const ritualId = 'ritual:' + item.id;
  addNode({
    id: ritualId,
    label: item.sectionName + '祀典',
    kind: '祀典',
    chapterName: item.chapterName,
    description: item.ritualText,
    sourceUrl: item.sourceUrl,
    sourceText: item.ritualText
  });
  if (firstMountain) {
    addEdge({
      id: 'ritual-origin:' + item.id,
      from: firstMountain.id,
      to: ritualId,
      relation: '篇末祀典',
      chapterName: item.chapterName,
      sourceUrl: item.sourceUrl,
      sourceText: item.ritualText
    });
  }
  const deityId = 'deity-form:' + item.id;
  addNode({
    id: deityId,
    label: '山神形貌',
    kind: '神形',
    chapterName: item.chapterName,
    description: item.deityDescription,
    sourceUrl: item.sourceUrl
  });
  addEdge({
    id: 'deity-form-link:' + item.id,
    from: ritualId,
    to: deityId,
    relation: '记载神形（非神名）',
    chapterName: item.chapterName,
    sourceUrl: item.sourceUrl
  });
}

export const knowledgeNodes = [...nodes.values()];
export const knowledgeEdges = [...edges.values()];
export const knowledgeKinds: KnowledgeKind[] = ['山', '水', '异兽', '异鸟', '物产', '古国', '异人', '人物', '神祇', '神话人物', '神木', '地理区域', '神话事件', '祀典', '神形', '神话意象', '篇章'];


export function getKnowledgeNodeIdForAtlasLocation(locationId: string): string | null {
  const location = locations.find((item) => item.id === locationId);
  if (!location) return null;
  const directId = 'place:' + locationId;
  if (nodes.has(directId)) return directId;
  const chapterName = chapters.find((chapter) => chapter.id === location.chapterId)?.name;
  const routeNode = mountainRoutes
    .filter((route) => route.chapterName === chapterName)
    .flatMap((route) => route.nodes)
    .find((node) => node.name === location.name);
  return routeNode && nodes.has(routeNode.id) ? routeNode.id : null;
}

export function getAtlasLocationIdForKnowledgeNode(nodeId: string): string | null {
  if (nodeId.startsWith('place:')) {
    const locationId = nodeId.slice('place:'.length);
    return locations.some((item) => item.id === locationId) ? locationId : null;
  }
  const node = nodes.get(nodeId);
  if (!node) return null;
  const location = locations.find((item) =>
    item.name === node.label &&
    chapters.find((chapter) => chapter.id === item.chapterId)?.name === node.chapterName
  );
  return location?.id ?? null;
}

export function getKnowledgeNeighbors(nodeId: string) {
  return knowledgeEdges
    .filter((edge) => edge.from === nodeId || edge.to === nodeId)
    .map((edge) => ({
      edge,
      node: knowledgeNodes.find((node) => node.id === (edge.from === nodeId ? edge.to : edge.from))!
    }))
    .filter((item) => Boolean(item.node));
}
