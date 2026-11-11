import { mountainRoutes } from './mountainRoutes';
import { waterways } from './waterways';
import { mountainResources } from './mountainResources';
import { bestiary } from './bestiary';
import { mountainRituals } from './mountainRituals';
import { knowledgeEdges, knowledgeNodes } from './knowledgeGraph';
import { locations } from '../atlas';
import { overseasEntities, overseasRelations } from './overseasEntities';
import { inlandEntities, inlandRelations, inlandChapterNotes } from './inlandEntities';

const mountainIds = mountainRoutes.flatMap((route) => route.nodes.map((node) => node.id));
const routeIds = mountainRoutes.map((route) => route.id);
const mountainIdSet = new Set(mountainIds);
const routeIdSet = new Set(routeIds);

export const dataAudit = {
  routeCount: mountainRoutes.length,
  mountainNodeCount: mountainIds.length,
  uniqueMountainNodeCount: mountainIdSet.size,
  duplicateMountainNodeIds: mountainIds.filter((id, index) => mountainIds.indexOf(id) !== index),
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
  graphNodeCount: knowledgeNodes.length,
  graphEdgeCount: knowledgeEdges.length
};

export const dataAuditIssues = [
  ...dataAudit.duplicateMountainNodeIds.map((id) => '重复山节点 ID：' + id),
  ...dataAudit.orphanWaterways.map((id) => '水系未关联山节点：' + id),
  ...dataAudit.orphanResources.map((id) => '物产未关联山节点：' + id),
  ...dataAudit.orphanCreatures.map((id) => '异兽未关联山节点：' + id),
  ...dataAudit.orphanRituals.map((id) => '祀典未关联路线：' + id),
  ...dataAudit.orphanGraphEdges.map((id) => '图谱边缺少端点：' + id),
  ...dataAudit.duplicateOverseasIds.map((id) => '海经实体 ID 重复：' + id),
  ...dataAudit.orphanOverseasRelations.map((id) => '海经关系缺少实体端点：' + id),
  ...dataAudit.missingOverseasSources.map((id) => '海经实体缺少原文链接：' + id),
  ...dataAudit.duplicateInlandIds.map((id) => '海内经实体 ID 重复：' + id),
  ...dataAudit.orphanInlandRelations.map((id) => '海内经关系缺少实体端点：' + id),
  ...dataAudit.missingInlandSources.map((id) => '海内经实体缺少原文链接：' + id),
  ...dataAudit.missingSourceUrls.map((id) => '缺少有效原文链接：' + id)
];
