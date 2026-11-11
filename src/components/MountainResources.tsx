import { useMemo, useState } from 'react';
import { mountainResources, type ResourceCategory } from '../data/mountainResources';
import { mountainRituals } from '../data/mountainRituals';
import { getRitualFacets } from '../data/ritualFacets';

const categories = ['全部', '植物', '矿物', '动物', '其他'] as const;
const chapters = ['全部', '南山经', '西山经', '北山经', '东山经', '中山经'] as const;

export default function MountainResources({ initialView = 'resources' }: { initialView?: 'resources' | 'rituals' }) {
  const [view, setView] = useState<'resources' | 'rituals'>(initialView);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'全部' | ResourceCategory>('全部');
  const [chapter, setChapter] = useState<(typeof chapters)[number]>('全部');
  const [selectedId, setSelectedId] = useState('kunlun-shatang');
  const [selectedRitualId, setSelectedRitualId] = useState('ritual-south-1');

  const filteredResources = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mountainResources.filter((item) => {
      const categoryMatch = category === '全部' || item.category === category;
      const haystack = [item.name, item.chapterName, item.mountainName, item.recordText].join(' ').toLowerCase();
      return categoryMatch && (!normalized || haystack.includes(normalized));
    });
  }, [query, category]);

  const filteredRituals = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mountainRituals.filter((item) => {
      const chapterMatch = chapter === '全部' || item.chapterName === chapter;
      const haystack = [item.chapterName, item.sectionName, item.deityDescription, item.ritualText].join(' ').toLowerCase();
      return chapterMatch && (!normalized || haystack.includes(normalized));
    });
  }, [query, chapter]);

  const selected = filteredResources.find((item) => item.id === selectedId) ?? filteredResources[0] ?? null;
  const selectedRitual = filteredRituals.find((item) => item.id === selectedRitualId) ?? filteredRituals[0] ?? null;

  return (
    <div className="knowledge-view resources-view">
      <div className="knowledge-heading">
        <div className="knowledge-eyebrow">MOUNTAIN PRODUCE / RITUAL ARCHIVE</div>
        <h2>山产志 <span>{view === 'resources' ? '草木金石' : '山中祀典'}</span></h2>
        <p>{view === 'resources'
          ? '按山名收录经文中的植物、矿物与动物记录。名称与描述以所据文本为准，不把古代物产名称直接套用为现代物种鉴定。'
          : '整理五藏山经各路线篇末的神形、牲礼、玉帛与糈米记录。不同山段祭法并不相同，特殊冢山与山神另行保留。'}</p>
      </div>

      <div className="knowledge-subnav" role="tablist" aria-label="山产志内容">
        <button role="tab" aria-selected={view === 'resources'} className={view === 'resources' ? 'active' : ''} onClick={() => {setView('resources');setQuery('');}}>草木金石</button>
        <button role="tab" aria-selected={view === 'rituals'} className={view === 'rituals' ? 'active' : ''} onClick={() => {setView('rituals');setQuery('');}}>山中祀典</button>
      </div>

      {view === 'resources' ? (
        <>
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
            <small className="bestiary-count">当前显示 {filteredResources.length} / {mountainResources.length} 条物产记录</small>
          </div>

          <div className="resources-layout">
            <div className="resources-grid">
              {filteredResources.map((item, index) => (
                <button key={item.id} className={'resource-card' + (selected?.id === item.id ? ' active' : '')}
                  onClick={() => setSelectedId(item.id)} aria-pressed={selected?.id === item.id}>
                  <span className="resource-card-top"><small>{String(index + 1).padStart(2, '0')}</small><i>{item.category}</i></span>
                  <strong>{item.name}</strong>
                  <span className="resource-card-origin">{item.chapterName} · {item.mountainName}</span>
                </button>
              ))}
              {filteredResources.length === 0 && <div className="bestiary-no-results">没有匹配的物产记录。可以更换关键词或类别。</div>}
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
        </>
      ) : (
        <>
          <div className="waterway-toolbar">
            <label className="bestiary-search">
              <span>检索</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索经卷、山段、神形或祭品" />
            </label>
            <div className="bestiary-kind-filters" aria-label="按经卷筛选">
              {chapters.map((item) => (
                <button key={item} className={chapter === item ? 'active' : ''} onClick={() => setChapter(item)}>{item}</button>
              ))}
            </div>
            <small className="bestiary-count">当前显示 {filteredRituals.length} / {mountainRituals.length} 条祀典记录</small>
          </div>

          <div className="resources-layout">
            <div className="resources-grid">
              {filteredRituals.map((item, index) => (
                <button key={item.id} className={'ritual-card' + (selectedRitual?.id === item.id ? ' active' : '')}
                  onClick={() => setSelectedRitualId(item.id)} aria-pressed={selectedRitual?.id === item.id}>
                  <span className="resource-card-top"><small>{String(index + 1).padStart(2, '0')}</small><i>{item.status === '未载' ? '未载' : item.status === '局部祠礼' ? '局部' : '篇末祠礼'}</i></span>
                  <strong>{item.sectionName}</strong>
                  <span className="ritual-card-deity">{item.deityDescription}</span>
                  <span className="resource-card-origin">{item.chapterName}</span>
                </button>
              ))}
              {filteredRituals.length === 0 && <div className="bestiary-no-results">没有匹配的祀典记录。可以更换关键词或经卷。</div>}
            </div>

            {selectedRitual && (
              <aside className="resource-detail ritual-detail">
                <div className="bestiary-detail-kicker">{selectedRitual.chapterName} / {selectedRitual.status}</div>
                <h3>{selectedRitual.sectionName}</h3>
                <div className="bestiary-origin">{selectedRitual.deityDescription}</div>
                <p>{selectedRitual.ritualText}</p>
                <div className="ritual-facets"><small>祀典要素拆分（基于摘要，不等同逐字原文）</small><div>{getRitualFacets(selectedRitual).map((facet, index) => <section key={facet.kind + index}><b>{facet.kind}</b><span>{facet.text}</span></section>)}</div></div>
                {selectedRitual.note && <p className="bestiary-note">{selectedRitual.note}</p>}
                <a href={selectedRitual.sourceUrl} target="_blank" rel="noreferrer">查阅篇末祠礼原文 ↗</a>
              </aside>
            )}
          </div>
          <p className="route-method-note">祀典内容为古籍历史记载的结构化摘要，不构成现实祭祀建议。原文中的牲礼、玉帛、糈米及特殊仪式分别保留；未载者不补造。</p>
        </>
      )}
    </div>
  );
}
