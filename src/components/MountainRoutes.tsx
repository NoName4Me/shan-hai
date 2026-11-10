import { useState } from 'react';
import { mountainRoutes } from '../data/mountainRoutes';
import { bestiary } from '../data/bestiary';
import { waterways } from '../data/waterways';

export default function MountainRoutes({ onOpenBestiary }: { onOpenBestiary: () => void }) {
  const [routeId, setRouteId] = useState(mountainRoutes[0].id);
  const route = mountainRoutes.find((item) => item.id === routeId) ?? mountainRoutes[0];
  const [selectedNodeId, setSelectedNodeId] = useState(route.nodes[0].id);
  const selectedNode = route.nodes.find((node) => node.id === selectedNodeId) ?? route.nodes[0];
  const relatedCreatures = bestiary.filter((entry) => selectedNode.creatureIds?.includes(entry.id));
  const recordedSum = route.nodes.reduce((sum, node) => sum + (node.distanceLi ?? 0), 0);
  const mountainCount = route.nodes.filter((node) => node.kind !== '路段').length;
  const relatedRivers = waterways.filter((river) => river.sourceMountainId === selectedNode.id);

  const selectRoute = (nextId: string) => {
    const nextRoute = mountainRoutes.find((item) => item.id === nextId);
    if (!nextRoute) return;
    setRouteId(nextId);
    setSelectedNodeId(nextRoute.nodes[0].id);
  };

  return (
    <div className="knowledge-view mountain-route-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">THE FIVE MOUNTAIN CLASSICS / ROUTE ARCHIVE</div>
        <h2>五藏山经 <span>山系路线</span></h2>
        <p>覆盖五卷山经的 26 条路线段，按原文记录山名、方向、里程及特殊水行路段。这里展示的是文本行进关系，不是现代地图上的真实路线。</p>
      </div>

      <div className="route-selectors" role="tablist" aria-label="选择山经路线">
        {mountainRoutes.map((item) => (
          <button key={item.id} role="tab" aria-selected={item.id === route.id}
            className={item.id === route.id ? 'active' : ''} onClick={() => selectRoute(item.id)}>
            <small>{item.chapterName}</small><strong>{item.sectionName}</strong>
          </button>
        ))}
      </div>

      <div className="route-metrics">
        <div><small>篇末记载山数</small><strong>{route.reportedMountainCount === null ? '待校勘' : route.reportedMountainCount.toLocaleString('zh-CN')}<i>山</i></strong></div>
        <div><small>篇末记载总里程</small><strong>{route.reportedTotalLi === null ? '待校勘' : route.reportedTotalLi.toLocaleString('zh-CN')}<i>里</i></strong></div>
        <div><small>当前逐段记录合计</small><strong>{recordedSum.toLocaleString('zh-CN')}<i>里</i></strong></div>
        <div><small>已录入具名节点</small><strong>{mountainCount}<i>山</i></strong></div>
      </div>

      <div className="route-layout">
        <div className="route-list-panel">
          <div className="route-list-heading"><span>{route.routeName}</span><small>SELECT A MOUNTAIN</small></div>
          <div className="route-node-list">
            {route.nodes.map((node, index) => (
              <button key={node.id} className={'route-node' + (node.id === selectedNode.id ? ' active' : '')}
                onClick={() => setSelectedNodeId(node.id)} aria-pressed={node.id === selectedNode.id}>
                <span className="route-node-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="route-node-name"><strong>{node.name}</strong><small>{node.kind === '路段' ? '特殊行程记录' : index === 0 ? '本段起点' : '由前一节点继续行进'}</small></span>
                <span className="route-node-distance">{node.distanceText ?? (node.distanceLi ? node.direction + ' ' + node.distanceLi + ' 里' : index === 0 ? '起点' : node.kind === '路段' ? '特殊路段' : '里程待录')}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="route-detail-panel">
          <div className="route-detail-kicker">{route.chapterName} / {route.sectionName}</div>
          <div className="route-detail-index">NO. {String(route.nodes.findIndex((node) => node.id === selectedNode.id) + 1).padStart(2, '0')}</div>
          <h3>{selectedNode.name}</h3>
          <p className="route-detail-direction">{selectedNode.distanceText ?? (selectedNode.distanceLi
            ? '由前一山向' + selectedNode.direction + '行进 ' + selectedNode.distanceLi + ' 里'
            : selectedNode.kind === '路段' ? '原文记载的水行、流沙或其他特殊路段。' : '本段路线的起始山名，原文未在此节点前标注里程。')}</p>
          {selectedNode.resourceSummary && <div className="route-resource-summary"><small>原文物产 / 地理记录</small><p>{selectedNode.resourceSummary}</p></div>}
          {relatedRivers.length > 0 && <div className="route-creatures"><small>此山发源水系</small><div>{relatedRivers.map((river) => <span key={river.id}>{river.name}</span>)}</div></div>}
          {relatedCreatures.length > 0 ? (
            <div className="route-creatures">
              <small>此山相关异兽</small>
              <div>{relatedCreatures.map((entry) => <span key={entry.id}>{entry.name}</span>)}</div>
              <button onClick={onOpenBestiary}>打开异兽图鉴 ↗</button>
            </div>
          ) : (
            <p className="route-empty-creatures">当前首批图鉴尚未收录此山的异兽条目；不代表原文没有相关记载。</p>
          )}
          <a href={route.sourceUrl} target="_blank" rel="noreferrer" className="route-source-link">查阅本卷原文 ↗</a>
        </aside>
      </div>

      <div className="route-audit-note">
        <span>校勘提示</span>
        <p>{route.auditNote}</p>
      </div>
      <p className="route-method-note">范围说明：本版已建立五卷 26 段路线索引。篇末总里程与已录入陆行里程分别保存；水行、流沙等特殊路段不强行折算。地图位置不按里程比例绘制。</p>
    </div>
  );
}
