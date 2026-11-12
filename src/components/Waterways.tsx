import { useMemo } from 'react';
import { waterways } from '../data/waterways';
import { useAppStore } from '../store';

const chapters = ['全部', '南山经', '西山经', '北山经', '东山经', '中山经'] as const;

export default function Waterways() {
  const query = useAppStore((s) => s.waterQuery);
  const setQuery = useAppStore((s) => s.setWaterQuery);
  const chapter = useAppStore((s) => s.waterChapter) as (typeof chapters)[number];
  const setChapter = useAppStore((s) => s.setWaterChapter);
  const selectedId = useAppStore((s) => s.waterId);
  const setSelectedId = useAppStore((s) => s.setWaterId);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return waterways.filter((item) => {
      const chapterMatch = chapter === '全部' || item.chapterName === chapter;
      const haystack = [item.name, item.chapterName, item.mountainName, item.destination ?? '', item.flowDirection ?? '', item.recordText].join(' ').toLowerCase();
      return chapterMatch && (!normalized || haystack.includes(normalized));
    });
  }, [query, chapter]);

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="knowledge-view waterways-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">RIVERS / SPRINGS / TEXTUAL HYDROLOGY</div>
        <h2>山川水系 <span>循水而行</span></h2>
        <p>把经文中的“水出焉”“东流注于……”拆成可检索的关系记录。这里只呈现古籍文本所述，不把古代水名直接等同于现代河流。</p>
      </div>

      <div className="waterway-toolbar">
        <label className="bestiary-search">
          <span>检索</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索水名、山名、流向或注入水域" />
        </label>
        <div className="bestiary-kind-filters" aria-label="按经卷筛选">
          {chapters.map((item) => (
            <button key={item} className={chapter === item ? 'active' : ''} onClick={() => setChapter(item)}>{item}</button>
          ))}
        </div>
        <small className="bestiary-count">当前显示 {filtered.length} / {waterways.length} 条水系记录</small>
      </div>

      <div className="waterway-layout">
        <div className="waterway-list">
          {filtered.map((item, index) => (
            <button key={item.id} className={'waterway-card' + (selected?.id === item.id ? ' active' : '')}
              onClick={() => setSelectedId(item.id)} aria-pressed={selected?.id === item.id}>
              <span className="waterway-card-top"><small>{String(index + 1).padStart(2, '0')}</small><i>{item.chapterName}</i></span>
              <strong>{item.name}</strong>
              <span className="waterway-card-route">{item.mountainName} · {item.relation}</span>
              <span className="waterway-card-flow">{item.flowDirection ? item.flowDirection + ' → ' : ''}{item.destination ?? '流向未记'}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="bestiary-no-results">没有匹配的水系记录。可以更换关键词或经卷。</div>}
        </div>

        {selected && (
          <aside className="waterway-detail">
            <div className="bestiary-detail-kicker">{selected.chapterName} / 水系记录</div>
            <h3>{selected.name}</h3>
            <div className="bestiary-origin">{selected.mountainName} · {selected.relation}</div>
            <div className="waterway-flowline">
              <span>{selected.mountainName}</span>
              <b>{selected.flowDirection ?? '原文未载流向'}</b>
              <span>{selected.destination ?? '未载注入水域'}</span>
            </div>
            <p className="waterway-record">{selected.recordText}</p>
            {selected.note && <p className="bestiary-note">{selected.note}</p>}
            <a href={selected.sourceUrl} target="_blank" rel="noreferrer">查阅原文出处 ↗</a>
          </aside>
        )}
      </div>

      <p className="route-method-note">数据原则：水名按篇章和出山位置分别建档；同名水流不自动合并。路线图只表达经文中的文字关系，不代表经纬度、真实河网或现代水文考证结论。</p>
    </div>
  );
}
