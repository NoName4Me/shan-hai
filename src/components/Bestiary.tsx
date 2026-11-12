import { useMemo } from 'react';
import { bestiary, creatureKinds, type CreatureKind } from '../data/bestiary';
import { useAppStore } from '../store';

export default function Bestiary() {
  const query = useAppStore((s) => s.bestiaryQuery);
  const setQuery = useAppStore((s) => s.setBestiaryQuery);
  const kind = useAppStore((s) => s.bestiaryKind) as '全部' | CreatureKind;
  const setKind = useAppStore((s) => s.setBestiaryKind);
  const selectedId = useAppStore((s) => s.bestiaryId);
  const setSelectedId = useAppStore((s) => s.setBestiaryId);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return bestiary.filter((entry) => {
      const matchesKind = kind === '全部' || entry.kind === kind;
      const haystack = [entry.name, entry.chapterName, entry.mountainName, entry.appearance, entry.record].join(' ').toLowerCase();
      return matchesKind && (!normalized || haystack.includes(normalized));
    });
  }, [query, kind]);

  const selected = filtered.find((entry) => entry.id === selectedId) ?? filtered[0] ?? null;

  return (
    <div className="knowledge-view bestiary-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">CREATURES OF THE CLASSIC / TEXTUAL BESTIARY</div>
        <h2>异兽图鉴 <span>山海有灵</span></h2>
        <p>先看古籍怎样写，再决定它在三维世界里应该长成什么样。每条记录都关联经卷、山名与原文。</p>
      </div>

      <div className="bestiary-tools">
        <label className="bestiary-search">
          <span>检索</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索异兽、经卷或所在山名" />
        </label>
        <div className="bestiary-kind-filters" aria-label="按类别筛选">
          {creatureKinds.map((item) => (
            <button key={item} className={kind === item ? 'active' : ''} onClick={() => setKind(item)}>{item}</button>
          ))}
        </div>
        <small className="bestiary-count">当前显示 {filtered.length} / {bestiary.length} 条文本记录</small>
      </div>

      <div className="bestiary-layout">
        <div className="bestiary-grid">
          {filtered.map((entry, index) => (
            <button key={entry.id} className={'bestiary-card' + (selected?.id === entry.id ? ' active' : '')}
              onClick={() => setSelectedId(entry.id)} aria-pressed={selected?.id === entry.id}>
              <span className="bestiary-card-top"><small>{String(index + 1).padStart(2, '0')}</small><i>{entry.kind}</i></span>
              <strong>{entry.name}</strong>
              <span className="bestiary-card-appearance">{entry.appearance}</span>
              <span className="bestiary-card-origin">{entry.chapterName} · {entry.mountainName}</span>
            </button>
          ))}
          {filtered.length === 0 && <div className="bestiary-no-results">没有匹配的条目。可以更换关键词或类别。</div>}
        </div>

        {selected && (
          <aside className="bestiary-detail">
            <div className="bestiary-detail-kicker">{selected.chapterName} / {selected.kind}</div>
            <h3>{selected.name}</h3>
            <div className="bestiary-origin">{selected.mountainName}</div>
            <p className="bestiary-appearance">{selected.appearance}</p>
            <blockquote>{selected.quote}</blockquote>
            <p className="bestiary-record">{selected.record}</p>
            <p className="bestiary-note">{selected.note}</p>
            <a href={selected.sourceUrl} target="_blank" rel="noreferrer">查阅原文出处 ↗</a>
          </aside>
        )}
      </div>
      <p className="route-method-note">图鉴内容是古籍文本整理，不是现代动物学分类。相同名称在不同篇章中若存在不同形态或叙事，将分别建档，不强行合并。</p>
    </div>
  );
}
