import { useMemo, useState } from 'react';
import { chapters } from '../atlas';
import {
  getKnowledgeNeighbors,
  knowledgeEdges,
  knowledgeNodes,
  type KnowledgeEdge,
  type KnowledgeNode
} from '../data/knowledgeGraph';

type ExplorerMode = 'events' | 'lineage';
type Props = { onOpenGraph: (nodeId: string) => void };
type EventRow = { node: KnowledgeNode; related: ReturnType<typeof getKnowledgeNeighbors> };
type LineageRow = { edge: KnowledgeEdge; from: KnowledgeNode; to: KnowledgeNode };

const chapterOrder = new Map(chapters.map((chapter, index) => [chapter.name, index]));
const personKinds = new Set(['神祇', '神话人物', '人物', '异人', '古国']);

function isLineageRelation(relation: string) {
  if (/生于|发源|相关|树生于/.test(relation)) return false;
  return /生(?!于)|娶|之妻|为妻|之孙|有子/.test(relation);
}

export default function MythologyExplorer({ onOpenGraph }: Props) {
  const [mode, setMode] = useState<ExplorerMode>('events');
  const [query, setQuery] = useState('');
  const [chapterFilter, setChapterFilter] = useState('');

  const eventRows = useMemo<EventRow[]>(() => knowledgeNodes
    .filter((node) => node.kind === '神话事件')
    .map((node) => ({
      node,
      related: getKnowledgeNeighbors(node.id).filter(({ edge, node: relatedNode }) =>
        relatedNode.kind !== '篇章' && edge.relation !== '本篇记载'
      )
    }))
    .sort((a, b) => (chapterOrder.get(a.node.chapterName) ?? 99) - (chapterOrder.get(b.node.chapterName) ?? 99)), []);

  const lineageRows = useMemo<LineageRow[]>(() => {
    const byId = new Map(knowledgeNodes.map((node) => [node.id, node]));
    return knowledgeEdges.flatMap((edge) => {
      if (!isLineageRelation(edge.relation)) return [];
      const from = byId.get(edge.from);
      const to = byId.get(edge.to);
      if (!from || !to || !personKinds.has(from.kind) || !personKinds.has(to.kind)) return [];
      return [{ edge, from, to }];
    }).sort((a, b) => (chapterOrder.get(a.edge.chapterName) ?? 99) - (chapterOrder.get(b.edge.chapterName) ?? 99));
  }, []);

  const chapterOptions = useMemo(() => [...new Set(
    (mode === 'events' ? eventRows.map((row) => row.node.chapterName) : lineageRows.map((row) => row.edge.chapterName))
  )], [mode, eventRows, lineageRows]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredEvents = eventRows.filter(({ node, related }) =>
    (!chapterFilter || node.chapterName === chapterFilter) &&
    (!normalizedQuery || [
      node.label, node.chapterName, node.description, node.sourceText ?? '',
      ...related.flatMap(({ node: relatedNode, edge }) => [relatedNode.label, edge.relation])
    ].join(' ').toLowerCase().includes(normalizedQuery))
  );
  const filteredLineage = lineageRows.filter(({ edge, from, to }) =>
    (!chapterFilter || edge.chapterName === chapterFilter) &&
    (!normalizedQuery || [from.label, to.label, edge.relation, edge.chapterName, edge.sourceText ?? ''].join(' ').toLowerCase().includes(normalizedQuery))
  );

  const eventGroups = filteredEvents.reduce<Array<{ chapterName: string; rows: EventRow[] }>>((groups, row) => {
    const current = groups[groups.length - 1];
    if (current?.chapterName === row.node.chapterName) current.rows.push(row);
    else groups.push({ chapterName: row.node.chapterName, rows: [row] });
    return groups;
  }, []);

  return (
    <div className="knowledge-view mythology-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">SHAN HAI / MYTHOLOGY THREADS</div>
        <h2>神话脉络 <span>人物与事件</span></h2>
        <p>从分散在十八篇中的神话事件与人物关系出发，沿原文证据继续探索。这里整理的是文本叙事与谱系线索，不将不同篇章的记载强行合并为单一历史。</p>
      </div>

      <div className="mythology-toolbar">
        <div className="mythology-mode-tabs" role="tablist" aria-label="神话脉络视图">
          <button role="tab" aria-selected={mode === 'events'} className={mode === 'events' ? 'active' : ''} onClick={() => { setMode('events'); setChapterFilter(''); }}>神话事件线 <small>{eventRows.length}</small></button>
          <button role="tab" aria-selected={mode === 'lineage'} className={mode === 'lineage' ? 'active' : ''} onClick={() => { setMode('lineage'); setChapterFilter(''); }}>人物谱系 <small>{lineageRows.length}</small></button>
        </div>
        <label className="bestiary-search mythology-search"><span>检索</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === 'events' ? '搜索事件、人物或原文' : '搜索人物、亲属关系或篇章'} /></label>
        <label className="mythology-chapter-filter"><span>篇章</span><select value={chapterFilter} onChange={(event) => setChapterFilter(event.target.value)}><option value="">全部篇章</option>{chapterOptions.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
      </div>

      {mode === 'events' ? (
        <>
          <div className="mythology-method-note"><strong>阅读方式</strong><span>按篇章卷次分组；同篇条目沿用当前数据索引顺序。跨篇先后不代表神话发生年代。</span></div>
          <div className="mythology-results-count">显示 {filteredEvents.length} / {eventRows.length} 条神话事件</div>
          {eventGroups.length ? eventGroups.map((group) => (
            <section className="mythology-chapter-group" key={group.chapterName}>
              <div className="mythology-chapter-heading"><span>{group.chapterName}</span><small>{group.rows.length} 条记录</small></div>
              <div className="mythology-event-list">
                {group.rows.map(({ node, related }, index) => (
                  <article className="mythology-event-card" key={node.id}>
                    <div className="mythology-event-index">{String(index + 1).padStart(2, '0')}</div>
                    <div className="mythology-event-content">
                      <div className="mythology-event-kicker">MYTH / {node.kind}</div>
                      <h3>{node.label}</h3>
                      <p>{node.description}</p>
                      {node.sourceText && <blockquote>{node.sourceText}</blockquote>}
                      {related.length > 0 && (
                        <div className="mythology-related">
                          <small>关联人物与对象</small>
                          <div>{related.slice(0, 8).map(({ edge, node: relatedNode }) => (
                            <button key={edge.id} onClick={() => onOpenGraph(relatedNode.id)} title={edge.relation}>
                              {relatedNode.label}<span>{edge.relation}</span>
                            </button>
                          ))}</div>
                        </div>
                      )}
                      <div className="mythology-event-actions">
                        <button onClick={() => onOpenGraph(node.id)}>在关系图谱中探索 ↗</button>
                        {node.sourceUrl && <a href={node.sourceUrl} target="_blank" rel="noreferrer">查阅原文 ↗</a>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )) : <div className="mythology-empty">没有符合条件的神话事件。</div>}
        </>
      ) : (
        <>
          <div className="mythology-method-note"><strong>关系边界</strong><span>仅收录原文明确支持的生育、婚配、子孙关系；地理上的“发源”“生于”不作为人物谱系。</span></div>
          <div className="mythology-results-count">显示 {filteredLineage.length} / {lineageRows.length} 条人物关系</div>
          <div className="mythology-lineage-list">
            {filteredLineage.map(({ edge, from, to }, index) => (
              <article className="mythology-lineage-row" key={edge.id}>
                <div className="mythology-lineage-person">
                  <small>{from.chapterName} · {from.kind}</small>
                  <button onClick={() => onOpenGraph(from.id)}>{from.label}</button>
                </div>
                <div className="mythology-lineage-link"><span>{edge.relation}</span><i>→</i></div>
                <div className="mythology-lineage-person">
                  <small>{to.kind}</small>
                  <button onClick={() => onOpenGraph(to.id)}>{to.label}</button>
                </div>
                <div className="mythology-lineage-evidence">{edge.sourceText && <blockquote>{edge.sourceText}</blockquote>}<small>{edge.chapterName} · #{String(index + 1).padStart(2, '0')}</small></div>
              </article>
            ))}
            {!filteredLineage.length && <div className="mythology-empty">没有符合条件的人物关系。</div>}
          </div>
        </>
      )}
    </div>
  );
}
