import { useEffect, useMemo } from 'react';
import { getAtlasLocationIdForKnowledgeNode, getKnowledgeNeighbors, knowledgeEdges, knowledgeKinds, knowledgeNodes, type KnowledgeKind, type KnowledgeNode } from '../data/knowledgeGraph';
import { dataAudit, dataAuditIssues } from '../data/dataAudit';
import { useAppStore } from '../store';

const kindColors: Record<KnowledgeKind, string> = {
  '山': '#d6bd91',
  '水': '#8dbbc0',
  '异兽': '#d49b9b',
  '物产': '#a9bd8e',
  '祀典': '#b7a3cc',
  '神形': '#d8aa72',
  '古国': '#b59a82',
  '神祇': '#d7b17c',
  '神话意象': '#a6a8c8',
  '篇章': '#8fa9a1',
  '异人': '#c49b86',
  '人物': '#c5a77e',
  '神话人物': '#d6a27e',
  '异鸟': '#a6b9c9',
  '神木': '#91b28b',
  '地理区域': '#9caa9a',
  '神话事件': '#c1a1bb'
};
const center = { x: 420, y: 285 };
const positions = [
  [420, 72], [594, 122], [680, 285], [594, 450], [420, 505], [246, 450],
  [160, 285], [246, 122], [510, 190], [540, 365], [300, 365], [300, 190]
];

export default function KnowledgeGraph({ initialSelectedId = 'south-qingqiu', onOpenMap }: { initialSelectedId?: string; onOpenMap?: (locationId: string) => void }) {
  const selectedId = useAppStore((s) => s.graphSelectedId);
  const setSelectedId = useAppStore((s) => s.setGraphSelectedId);
  const setGraphTargetId = useAppStore((s) => s.setGraphTargetId);
  const kind = useAppStore((s) => s.graphKind) as '全部' | KnowledgeKind;
  const setKind = useAppStore((s) => s.setGraphKind);
  const query = useAppStore((s) => s.graphQuery);
  const setQuery = useAppStore((s) => s.setGraphQuery);

  useEffect(() => {
    setSelectedId(initialSelectedId);
  }, [initialSelectedId, setSelectedId]);
  const selected = knowledgeNodes.find((node) => node.id === selectedId) ?? knowledgeNodes[0];
  const neighbors = useMemo(() => getKnowledgeNeighbors(selected.id), [selected.id]);
  const selectedAtlasLocationId = getAtlasLocationIdForKnowledgeNode(selected.id);
  const visibleNeighbors = neighbors.filter(({ node }) => kind === '全部' || node.kind === kind);
  const graphNeighbors = useMemo(() => {
    const seen = new Set<string>();
    return visibleNeighbors.filter(({ node }) => {
      if (seen.has(node.id)) return false;
      seen.add(node.id);
      return true;
    });
  }, [visibleNeighbors]);
  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return knowledgeNodes.filter((node) => [node.label, node.chapterName, node.description, node.kind].join(' ').toLowerCase().includes(q)).slice(0, 12);
  }, [query]);
  const graphNodes = [{ node: selected, x: center.x, y: center.y }, ...graphNeighbors.slice(0, 12).map(({ node }, index) => ({ node, x: positions[index][0], y: positions[index][1] }))];
  const visibleIds = new Set(graphNodes.map((item) => item.node.id));
  const graphEdges = neighbors.filter(({ edge, node }) => visibleIds.has(node.id) && (edge.from === selected.id || edge.to === selected.id));

  const selectNode = (node: KnowledgeNode) => {
    setSelectedId(node.id);
    setGraphTargetId(node.id);
    setQuery('');
  };

  return (
    <div className="knowledge-view graph-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">SHAN HAI / KNOWLEDGE RELATIONSHIP NETWORK</div>
        <h2>山海关系图谱 <span>万物相连</span></h2>
        <p>从五藏山经的路线、水系与物产，延伸至海外、海内和大荒诸经的古国、神祇、异兽与神话事件。每条连线均对应可追溯的文本依据，不代表现代地理或生物学推断。</p>
      </div>

      <div className="graph-toolbar">
        <label className="bestiary-search"><span>检索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索山名、古国、神祇、异兽或神话事件" /></label>
        <div className="bestiary-kind-filters">
          {(['全部', ...knowledgeKinds] as const).map((item) => <button key={item} className={kind === item ? 'active' : ''} onClick={() => setKind(item)}>{item}</button>)}
        </div>
      </div>

      {matching.length > 0 && (
        <div className="graph-search-results">
          {matching.map((node) => <button key={node.id} onClick={() => selectNode(node)}><i style={{ background: kindColors[node.kind] }} />{node.label}<small>{node.kind} · {node.chapterName}</small></button>)}
        </div>
      )}

      <div className="graph-layout">
        <div className="graph-canvas-wrap">
          <div className="graph-canvas-label"><span>关系视图</span><small>{neighbors.length} 条直接关联 · 显示最多 12 条</small></div>
          <svg className="knowledge-graph-svg" viewBox="0 0 840 570" role="img" aria-label={selected.label + '的直接知识关系图'}>
            {graphEdges.map(({ edge, node }) => {
              const target = graphNodes.find((item) => item.node.id === node.id)!;
              return <g key={edge.id}>
                <line x1={center.x} y1={center.y} x2={target.x} y2={target.y} stroke="#b9c6b2" strokeOpacity=".42" strokeWidth="1.4" />
                <text x={(center.x + target.x) / 2} y={(center.y + target.y) / 2 - 7} textAnchor="middle" className="graph-edge-label">{edge.relation}</text>
              </g>;
            })}
            {graphNodes.map(({ node, x, y }, index) => <g key={node.id} className="graph-node" role="button" tabIndex={0} aria-label={'选择' + node.label} onClick={() => selectNode(node)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') selectNode(node); }}>
              <circle cx={x} cy={y} r={index === 0 ? 43 : 29} fill={kindColors[node.kind]} fillOpacity={index === 0 ? '.22' : '.14'} stroke={kindColors[node.kind]} strokeWidth={index === 0 ? 2 : 1.4} />
              <circle cx={x} cy={y} r={index === 0 ? 35 : 23} fill="none" stroke={kindColors[node.kind]} strokeOpacity=".38" />
              <text x={x} y={y + 4} textAnchor="middle" className="graph-node-label">{node.label.length > 7 ? node.label.slice(0, 7) + '…' : node.label}</text>
              <text x={x} y={y + (index === 0 ? 60 : 45)} textAnchor="middle" className="graph-node-kind">{node.kind}</text>
            </g>)}
          </svg>
          <div className="graph-legend">{knowledgeKinds.map((item) => <span key={item}><i style={{ background: kindColors[item] }} />{item}</span>)}</div>
        </div>

        <aside className="graph-detail">
          <div className="bestiary-detail-kicker">{selected.chapterName} / {selected.kind}</div>
          <h3>{selected.label}</h3>
          <p>{selected.description || '原文关联实体'}</p>
          <div className="graph-neighbor-heading">直接关联 <small>{neighbors.length}</small></div>
          <div className="graph-neighbor-list">
            {neighbors.map(({ edge, node }) => <button key={edge.id} onClick={() => selectNode(node)}>
              <span><i style={{ background: kindColors[node.kind] }} />{node.label}</span>
              <small>{edge.relation} · {node.kind}</small>
            </button>)}
            {neighbors.length === 0 && <p>暂无已录入的直接关联。</p>}
          </div>
          {selected.sourceText && <blockquote>{selected.sourceText}</blockquote>}
          {selected.sourceUrl && <a href={selected.sourceUrl} target="_blank" rel="noreferrer">查阅原文出处 ↗</a>}
          {selectedAtlasLocationId && onOpenMap && <button className="graph-map-link" onClick={() => onOpenMap(selectedAtlasLocationId)}>在舆图中定位 ↗</button>}
          <button className="graph-reset" onClick={() => { setSelectedId('south-qingqiu'); setGraphTargetId('south-qingqiu'); setKind('全部'); setQuery(''); }}>返回青丘起点</button>
        </aside>
      </div>
      <p className="route-method-note">图谱节点与连线均由当前结构化数据生成。山系相邻关系来自路线顺序；水系、物产、异兽及祀典来自对应条目。祭祀形貌只作为“神形记录”，不据此虚构神名。</p>
      <div className="graph-stats"><span>{knowledgeNodes.length} 个实体节点</span><span>{knowledgeEdges.length} 条文本关系</span><span>{knowledgeEdges.filter((edge) => edge.relation.includes('注入')).length} 条水系注入关系</span><span>{dataAudit.routeCount} 段路线 / {dataAudit.uniqueMountainNodeCount} 个唯一山节点</span><span>{dataAudit.seaLocationCount} 个海经/海内地理锚点</span><span>{dataAudit.overseasEntityCount} 个海外四经实体 / {dataAudit.overseasRelationCount} 条关系</span><span>{dataAudit.inlandEntityCount} 个海内四经实体 / {dataAudit.inlandRelationCount} 条关系</span><span>{dataAudit.dahuangEntityCount} 个大荒四经实体 / {dataAudit.dahuangRelationCount} 条关系</span><span>{dataAudit.haineiClassicEntityCount} 个海内经终篇实体 / {dataAudit.haineiClassicRelationCount} 条篇内关系 / {dataAudit.haineiClassicCrossVolumeLinkCount} 条跨卷关联</span><span className={dataAuditIssues.length ? "graph-audit-warning" : "graph-audit-ok"}>{dataAuditIssues.length ? dataAuditIssues.length + " 项关联待修复" : "数据关联完整性检查通过"}</span></div>
    </div>
  );
}
