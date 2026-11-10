import { useMemo, useState } from 'react';
import { mountainResources, type ResourceCategory } from '../data/mountainResources';

const categories = ['全部', '植物', '矿物', '动物', '其他'] as const;

export default function MountainResources() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'全部' | ResourceCategory>('全部');
  const [selectedId, setSelectedId] = useState('kunlun-shatang');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mountainResources.filter((item) => {
      const categoryMatch = category === '全部' || item.category === category;
      const haystack = [item.name, item.chapterName, item.mountainName, item.recordText].join(' ').toLowerCase();
      return categoryMatch && (!normalized || haystack.includes(normalized));
    });
  }, [query, category]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="knowledge-view resources-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">FLORA / MINERALS / FAUNA / MOUNTAIN PRODUCE</div>
        <h2>山产志 <span>草木金石</span></h2>
        <p>按山名收录经文中的植物、矿物与动物记录。名称与描述以所据文本为准，不把古代物产名称直接套用为现代物种鉴定。</p>
      </div>

      <div className="bestiary-tools">
        <label className="bestiary-search">
          <span>检索</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索物产、山名或经卷" />
        </label>
        <div className="bestiary-kind-filters" aria-label="按物产类别筛选">
          {categories.map((item) => (
            <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>
          ))}
        </div>
        <small className="bestiary-count">当前显示 {filtered.length} / {mountainResources.length} 条物产记录</small>
      </div>

      <div className="resources-layout">
        <div className="resources-grid">
          {filtered.map((item, index) => (
            <button key={item.id} className={'resource-card' + (selected?.id === item.id ? ' active' : '')}
              onClick={() => setSelectedId(item.id)} aria-pressed={selected?.id === item.id}>
              <span className="resource-card-top"><small>{String(index + 1).padStart(2, '0')}</small><i>{item.category}</i></span>
              <strong>{item.name}</strong>
              <span className="resource-card-origin">{item.chapterName} · {item.mountainName}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="bestiary-no-results">没有匹配的物产记录。可以更换关键词或类别。</div>}
        </div>

        {selected && (
          <aside className="resource-detail">
            <div className="bestiary-detail-kicker">{selected.chapterName} / {selected.category}</div>
            <h3>{selected.name}</h3>
            <div className="bestiary-origin">{selected.mountainName}</div>
            <p>{selected.recordText}</p>
            {selected.note && <p className="bestiary-note">{selected.note}</p>}
            <a href={selected.sourceUrl} target="_blank" rel="noreferrer">查阅原文出处 ↗</a>
          </aside>
        )}
      </div>

      <p className="route-method-note">当前为第一批山产索引，非全书物产全集。不同篇章、不同山名下的同名物产暂按原文位置分别记录；异文和古今名称对应关系需另行校勘。</p>
    </div>
  );
}
