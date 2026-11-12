import { mountainRoutes } from './mountainRoutes';
import { waterways } from './waterways';
import { mountainResources } from './mountainResources';
import { bestiary } from './bestiary';
import { mountainRituals } from './mountainRituals';
import { getAtlasLocationIdForKnowledgeNode, getKnowledgeNodeIdForAtlasLocation, knowledgeEdges, knowledgeNodes } from './knowledgeGraph';
import { locations } from '../atlas';
import { overseasEntities, overseasRelations } from './overseasEntities';
import { inlandEntities, inlandRelations, inlandChapterNotes } from './inlandEntities';
import { dahuangEntities, dahuangRelations, dahuangChapterNotes } from './dahuangEntities';
import { haineiClassicEntities, haineiClassicRelations, haineiClassicCrossLinks } from './haineiClassicEntities';

const mountainIds = mountainRoutes.flatMap((route) => route.nodes.map((node) => node.id));
const routeIds = mountainRoutes.map((route) => route.id);
const mountainIdSet = new Set(mountainIds);
const routeIdSet = new Set(routeIds);
const atlasLocationIds = locations.map((location) => location.id);
const routeNodeByName = new Map(
  mountainRoutes.flatMap((route) =>
    route.nodes.map((node, index) => [route.id + ':' + node.name, { routeId: route.id, order: index + 1 }] as const)
  )
);

export const dataAudit = {
  routeCount: mountainRoutes.length,
  mountainNodeCount: mountainIds.length,
  uniqueMountainNodeCount: mountainIdSet.size,
  duplicateMountainNodeIds: mountainIds.filter((id, index) => mountainIds.indexOf(id) !== index),
  duplicateRouteIds: routeIds.filter((id, index) => routeIds.indexOf(id) !== index),
  duplicateAtlasLocationIds: atlasLocationIds.filter((id, index) => atlasLocationIds.indexOf(id) !== index),
  duplicateWaterwayIds: waterways.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  duplicateResourceIds: mountainResources.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  duplicateCreatureIds: bestiary.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  duplicateRitualIds: mountainRituals.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  invalidAtlasRouteLinks: locations.filter((location) => location.routeId && !routeIdSet.has(location.routeId)).map((location) => location.id),
  mismatchedAtlasRouteOrders: locations.flatMap((location) => {
    if (!location.routeId || location.routeOrder === undefined) return [];
    const routeNode = routeNodeByName.get(location.routeId + ':' + location.name);
    return routeNode && routeNode.order !== location.routeOrder
      ? [location.id + '（应为 ' + routeNode.order + '，当前 ' + location.routeOrder + '）']
      : [];
  }),
  missingAtlasLocationSources: locations.filter((location) => !location.sourceUrl.startsWith('https://')).map((location) => location.id),
  duplicateGraphNodeIds: knowledgeNodes.map((node) => node.id).filter((id, index, all) => all.indexOf(id) !== index),
  duplicateGraphEdgeIds: knowledgeEdges.map((edge) => edge.id).filter((id, index, all) => all.indexOf(id) !== index),
  duplicateGraphRelations: [...new Set(
    knowledgeEdges
      .map((edge) => edge.from + '|' + edge.to + '|' + edge.relation)
      .filter((key, index, all) => all.indexOf(key) !== index)
  )],
  orphanWaterways: waterways.filter((item) => !mountainIdSet.has(item.mountainId)).map((item) => item.id),
  orphanResources: mountainResources.filter((item) => !mountainIdSet.has(item.mountainId)).map((item) => item.id),
  orphanCreatures: bestiary.filter((item) => !mountainIdSet.has(item.mountainId)).map((item) => item.id),
  orphanRituals: mountainRituals.filter((item) => !routeIdSet.has(item.routeId)).map((item) => item.id),
  orphanGraphEdges: knowledgeEdges.filter((edge) => !knowledgeNodes.some((node) => node.id === edge.from) || !knowledgeNodes.some((node) => node.id === edge.to)).map((edge) => edge.id),
  missingSourceUrls: [
    ...waterways.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => 'water:' + item.id),
    ...mountainResources.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => 'resource:' + item.id),
    ...bestiary.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => 'creature:' + item.id),
    ...mountainRituals.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => 'ritual:' + item.id)
  ],
  seaLocationCount: locations.filter((item) => !['nanshan-jing', 'xishan-jing', 'beishan-jing', 'dongshan-jing', 'zhongshan-jing'].includes(item.chapterId)).length,
  brokenAtlasGraphMappings: locations.filter((location) => {
    const graphNodeId = getKnowledgeNodeIdForAtlasLocation(location.id);
    return !graphNodeId || getAtlasLocationIdForKnowledgeNode(graphNodeId) !== location.id;
  }).map((location) => location.id),
  overseasEntityCount: overseasEntities.length,
  overseasRelationCount: overseasRelations.length,
  duplicateOverseasIds: overseasEntities.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  orphanOverseasRelations: overseasRelations.filter((item) => !overseasEntities.some((entity) => entity.id === item.fromId) || !overseasEntities.some((entity) => entity.id === item.toId)).map((item) => item.id),
  missingOverseasSources: overseasEntities.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => item.id),
  inlandEntityCount: inlandEntities.length,
  inlandRelationCount: inlandRelations.length,
  inlandEditorialNoteCount: inlandChapterNotes.length,
  duplicateInlandIds: inlandEntities.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  orphanInlandRelations: inlandRelations.filter((item) => !inlandEntities.some((entity) => entity.id === item.fromId) || !inlandEntities.some((entity) => entity.id === item.toId)).map((item) => item.id),
  missingInlandSources: inlandEntities.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => item.id),
  dahuangEntityCount: dahuangEntities.length,
  dahuangRelationCount: dahuangRelations.length,
  dahuangEditorialNoteCount: dahuangChapterNotes.length,
  duplicateDahuangIds: dahuangEntities.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  orphanDahuangRelations: dahuangRelations.filter((item) => !dahuangEntities.some((entity) => entity.id === item.fromId) || !dahuangEntities.some((entity) => entity.id === item.toId)).map((item) => item.id),
  missingDahuangSources: dahuangEntities.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => item.id),
  emptyDahuangEntityQuotes: dahuangEntities.filter((item) => !item.quote.trim()).map((item) => item.id),
  emptyDahuangRelationQuotes: dahuangRelations.filter((item) => !item.quote.trim()).map((item) => item.id),
  duplicateDahuangRelationIds: dahuangRelations.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  haineiClassicEntityCount: haineiClassicEntities.length,
  haineiClassicRelationCount: haineiClassicRelations.length,
  haineiClassicCrossVolumeLinkCount: haineiClassicCrossLinks.length,
  duplicateHaineiClassicIds: haineiClassicEntities.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  orphanHaineiClassicRelations: haineiClassicRelations.filter((item) => !haineiClassicEntities.some((entity) => entity.id === item.fromId) || !haineiClassicEntities.some((entity) => entity.id === item.toId)).map((item) => item.id),
  missingHaineiClassicSources: haineiClassicEntities.filter((item) => !item.sourceUrl.startsWith('https://')).map((item) => item.id),
  emptyHaineiClassicEntityQuotes: haineiClassicEntities.filter((item) => !item.quote.trim()).map((item) => item.id),
  emptyHaineiClassicRelationQuotes: haineiClassicRelations.filter((item) => !item.quote.trim()).map((item) => item.id),
  duplicateHaineiClassicRelationIds: haineiClassicRelations.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  orphanHaineiClassicCrossLinks: haineiClassicCrossLinks.filter((item) => !haineiClassicEntities.some((entity) => entity.id === item.fromId) || !knowledgeNodes.some((node) => node.id === item.toGraphId)).map((item) => item.id),
  duplicateHaineiClassicCrossLinkIds: haineiClassicCrossLinks.map((item) => item.id).filter((id, index, all) => all.indexOf(id) !== index),
  missingHaineiClassicGraphTargets: haineiClassicEntities.filter((item) => item.graphId && !knowledgeNodes.some((node) => node.id === item.graphId)).map((item) => item.id),
  graphNodeCount: knowledgeNodes.length,
  graphEdgeCount: knowledgeEdges.length
};

export const dataAuditIssues = [
  ...dataAudit.duplicateRouteIds.map((id) => '重复路线 ID：' + id),
  ...dataAudit.duplicateAtlasLocationIds.map((id) => '重复舆图地点 ID：' + id),
  ...dataAudit.duplicateWaterwayIds.map((id) => '重复水系 ID：' + id),
  ...dataAudit.duplicateResourceIds.map((id) => '重复物产 ID：' + id),
  ...dataAudit.duplicateCreatureIds.map((id) => '重复异兽 ID：' + id),
  ...dataAudit.duplicateRitualIds.map((id) => '重复祀典 ID：' + id),
  ...dataAudit.invalidAtlasRouteLinks.map((id) => '舆图地点引用了不存在的路线：' + id),
  ...dataAudit.mismatchedAtlasRouteOrders.map((id) => '舆图地点路线次序与山经节点不一致：' + id),
  ...dataAudit.missingAtlasLocationSources.map((id) => '舆图地点缺少原文链接：' + id),
  ...dataAudit.duplicateGraphNodeIds.map((id) => '重复图谱节点 ID：' + id),
  ...dataAudit.duplicateGraphEdgeIds.map((id) => '重复图谱关系 ID：' + id),
  ...dataAudit.duplicateGraphRelations.map((key) => '重复图谱关系：' + key),
  ...dataAudit.duplicateMountainNodeIds.map((id) => '重复山节点 ID：' + id),
  ...dataAudit.orphanWaterways.map((id) => '水系未关联山节点：' + id),
  ...dataAudit.orphanResources.map((id) => '物产未关联山节点：' + id),
  ...dataAudit.orphanCreatures.map((id) => '异兽未关联山节点：' + id),
  ...dataAudit.orphanRituals.map((id) => '祀典未关联路线：' + id),
  ...dataAudit.orphanGraphEdges.map((id) => '图谱边缺少端点：' + id),
  ...dataAudit.brokenAtlasGraphMappings.map((id) => '舆图地点无法双向映射到知识图谱：' + id),
  ...dataAudit.duplicateOverseasIds.map((id) => '海经实体 ID 重复：' + id),
  ...dataAudit.orphanOverseasRelations.map((id) => '海经关系缺少实体端点：' + id),
  ...dataAudit.missingOverseasSources.map((id) => '海经实体缺少原文链接：' + id),
  ...dataAudit.duplicateInlandIds.map((id) => '海内经实体 ID 重复：' + id),
  ...dataAudit.orphanInlandRelations.map((id) => '海内经关系缺少实体端点：' + id),
  ...dataAudit.missingInlandSources.map((id) => '海内经实体缺少原文链接：' + id),
  ...dataAudit.duplicateDahuangIds.map((id) => '大荒经实体 ID 重复：' + id),
  ...dataAudit.orphanDahuangRelations.map((id) => '大荒经关系缺少实体端点：' + id),
  ...dataAudit.missingDahuangSources.map((id) => '大荒经实体缺少原文链接：' + id),
  ...dataAudit.emptyDahuangEntityQuotes.map((id) => '大荒经实体缺少原文摘录：' + id),
  ...dataAudit.emptyDahuangRelationQuotes.map((id) => '大荒经关系缺少原文依据：' + id),
  ...dataAudit.duplicateDahuangRelationIds.map((id) => '大荒经关系 ID 重复：' + id),
  ...dataAudit.duplicateHaineiClassicIds.map((id) => '海内经终篇实体 ID 重复：' + id),
  ...dataAudit.orphanHaineiClassicRelations.map((id) => '海内经终篇关系缺少实体端点：' + id),
  ...dataAudit.missingHaineiClassicSources.map((id) => '海内经终篇实体缺少原文链接：' + id),
  ...dataAudit.emptyHaineiClassicEntityQuotes.map((id) => '海内经终篇实体缺少原文摘录：' + id),
  ...dataAudit.emptyHaineiClassicRelationQuotes.map((id) => '海内经终篇关系缺少原文依据：' + id),
  ...dataAudit.duplicateHaineiClassicRelationIds.map((id) => '海内经终篇关系 ID 重复：' + id),
  ...dataAudit.orphanHaineiClassicCrossLinks.map((id) => '海内经终篇跨卷关系缺少端点：' + id),
  ...dataAudit.duplicateHaineiClassicCrossLinkIds.map((id) => '海内经终篇跨卷关系 ID 重复：' + id),
  ...dataAudit.missingHaineiClassicGraphTargets.map((id) => '海内经终篇共享实体目标不存在：' + id),
  ...dataAudit.missingSourceUrls.map((id) => '缺少有效原文链接：' + id)
];
