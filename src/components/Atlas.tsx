import { useMemo, useState } from 'react';
import { chapterGroups, chapters, locations } from '../atlas';
import Bestiary from './Bestiary';
import MountainRoutes from './MountainRoutes';
import Waterways from './Waterways';
import MountainResources from './MountainResources';
import { useAppStore } from '../store';

export default function Atlas() {
  const [atlasMode, setAtlasMode] = useState<'map' | 'routes' | 'bestiary' | 'waterways' | 'resources'>('map');
  const enter = useAppStore((s) => s.enterQingqiu);
  const [selectedChapterId, setSelectedChapterId] = useState('nanshan-jing');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const selectedChapter = chapters.find((chapter) => chapter.id === selectedChapterId) ?? chapters[0];
  const selectedPlace = locations.find((place) => place.id === selectedPlaceId) ?? null;
  const selectedGroup = chapterGroups.find((group) => group.id === selectedChapter.group) ?? chapterGroups[0];
  const visibleChapters = chapters.filter((chapter) => chapter.group === selectedGroup.id);
  const routePoints = useMemo(
    () => locations
      .filter((place) => place.routeId === 'que-shan-first')
      .sort((a, b) => (a.routeOrder ?? 0) - (b.routeOrder ?? 0))
      .map((place) => (place.x * 10) + ',' + (place.y * 6.4))
      .join(' '),
    []
  );

  const chooseChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSelectedPlaceId(null);
  };

  const choosePlace = (placeId: string) => {
    const place = locations.find((item) => item.id === placeId);
    if (!place) return;
    setSelectedChapterId(place.chapterId);
    setSelectedPlaceId(place.id);
  };

  return (
    <section className={"atlas-section atlas-mode-" + atlasMode} aria-label="山海经神话概念舆图">
      <div className="atlas-topline"><span>天地有尽 · 山海无垠</span><span>THE ATLAS OF MYTHS / 018 VOLUMES</span></div>
      <div className="atlas-mode-switch" role="tablist" aria-label="探索内容">
        <button role="tab" aria-selected={atlasMode === 'map'} className={atlasMode === 'map' ? 'active' : ''} onClick={() => setAtlasMode('map')}>神话舆图</button>
        <button role="tab" aria-selected={atlasMode === 'routes'} className={atlasMode === 'routes' ? 'active' : ''} onClick={() => setAtlasMode('routes')}>山经路线</button>
        <button role="tab" aria-selected={atlasMode === 'bestiary'} className={atlasMode === 'bestiary' ? 'active' : ''} onClick={() => setAtlasMode('bestiary')}>异兽图鉴</button>
        <button role="tab" aria-selected={atlasMode === 'waterways'} className={atlasMode === 'waterways' ? 'active' : ''} onClick={() => setAtlasMode('waterways')}>山川水系</button>
        <button role="tab" aria-selected={atlasMode === 'resources'} className={atlasMode === 'resources' ? 'active' : ''} onClick={() => setAtlasMode('resources')}>山产志</button>
      </div>
      <svg className="world-map" viewBox="0 0 1000 640" role="img" aria-label="山海世界艺术概念底图，非精确历史地理图" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#0c3037" /><stop offset=".5" stopColor="#15484c" /><stop offset="1" stopColor="#05242c" />
          </linearGradient>
          <linearGradient id="terrain" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#9fae8e"/><stop offset=".27" stopColor="#426d62"/><stop offset=".62" stopColor="#30544d"/><stop offset="1" stopColor="#a9a486"/>
          </linearGradient>
          <radialGradient id="island"><stop stopColor="#b8b694"/><stop offset=".6" stopColor="#578176"/><stop offset="1" stopColor="#1c4c4e"/></radialGradient>
          <filter id="soft"><feGaussianBlur stdDeviation="20"/></filter>
          <pattern id="contour" width="76" height="58" patternUnits="userSpaceOnUse">
            <path d="M-10 32 Q22 2 54 32 T130 32M-10 42 Q22 12 54 42 T130 42" fill="none" stroke="#c7d1ad" strokeWidth=".7" opacity=".12"/>
          </pattern>
        </defs>
        <rect width="1000" height="640" fill="url(#sea)"/>
        <path d="M-10 40L80 5 130 53 192 18 243 73 319 51 350 116 417 118 469 175 538 160 615 199 698 198 740 246 787 277 730 334 751 401 694 469 604 510 529 526 493 583 394 572 343 626 250 594 204 551 148 564 113 492 54 484 33 395-20 324Z" fill="#c4dcc0" opacity=".12" filter="url(#soft)"/>
        <path d="M-10 40L80 5 130 53 192 18 243 73 319 51 350 116 417 118 469 175 538 160 615 199 698 198 740 246 787 277 730 334 751 401 694 469 604 510 529 526 493 583 394 572 343 626 250 594 204 551 148 564 113 492 54 484 33 395-20 324Z" fill="url(#terrain)" opacity=".9" stroke="#c2c4a5" strokeWidth="2"/>
        <path d="M-20 325Q109 300 197 346T392 344Q504 295 596 356T763 328M50 103Q185 151 302 137T535 245Q632 285 705 254M146 520Q232 474 345 509T601 460" fill="none" stroke="#d0d2ad" strokeWidth="1.5" opacity=".34"/>
        <path d="M91 114L144 76 192 132 251 111 308 155 375 150 411 214 494 205 541 269 610 270 651 329 594 349 557 309 504 295 455 259 402 265 340 217 274 227 222 191 154 200Z" fill="#cad0b9" opacity=".18"/>
        <path d="M145 263l30-70 35 56 27-82 32 76 33-36 30 61 32-44 25 56 34-25 30 59M286 425l35-66 28 33 37-75 38 59 30-45 30 59 32-28 24 47M458 177l21-47 21 40 27-70 35 72 32-42 33 66" stroke="#ded8b9" strokeWidth="2" opacity=".65" fill="none"/>
        <path d="M145 263l30-70 35 56 27-82 32 76 33-36 30 61 32-44 25 56 34-25 30 59M286 425l35-66 28 33 37-75 38 59 30-45 30 59 32-28 24 47M458 177l21-47 21 40 27-70 35 72 32-42 33 66" fill="none" stroke="#08393f" strokeWidth="10" opacity=".21"/>
        <path d="M378 181Q328 277 425 333T392 458Q375 514 470 557M584 247Q541 302 602 370T638 447" fill="none" stroke="#a1c7b3" strokeWidth="6" opacity=".55"/>
        <path d="M378 181Q328 277 425 333T392 458Q375 514 470 557M584 247Q541 302 602 370T638 447" fill="none" stroke="#c9e7d0" strokeWidth="1.3" opacity=".65"/>
        <path d="M818 206l55-27 38 32 44-3 20 47-29 31-55 9-44-19zM848 393l38-35 65 17 30 54-29 35-55-12zM722 525l43-24 50 24 15 45-38 32-51-21z" fill="url(#island)" stroke="#93b4a3" opacity=".86"/>
        <rect width="1000" height="640" fill="url(#contour)"/>
        <g fill="none" stroke="#b9d5c4" opacity=".14">
          <circle cx="529" cy="343" r="175"/><circle cx="529" cy="343" r="265"/>
          <path d="M0 320H1000M500 0V640" strokeDasharray="2 10"/>
        </g>
        <g transform="translate(903 94)" fill="none" stroke="#ddc7a0" opacity=".7">
          <circle r="38"/><circle r="30"/><path d="M0-60V-16M0 16V60M-60 0H-16M16 0H60"/>
          <path d="M0-38l6 32-6 6-6-6z" fill="#dbc292"/><text y="-68" fontSize="13" textAnchor="middle" fill="#e6d5b4" stroke="none">北</text>
        </g>
        <g fontFamily="Georgia,serif" fill="#d2d2b3" opacity=".34">
          <text x="126" y="384" fontSize="26" letterSpacing="6">西山</text><text x="454" y="286" fontSize="27" letterSpacing="6">中山</text>
          <text x="541" y="524" fontSize="24" letterSpacing="5">南山</text>
          <text x="811" y="350" fontSize="16" letterSpacing="5">东海</text>
        </g>
      </svg>
      <div className="map-points">
        {selectedChapterId === 'nanshan-jing' && (
          <svg className="map-route" viewBox="0 0 1000 640" aria-hidden="true">
            <polyline points={routePoints} fill="none" stroke="#e8c995" strokeWidth="2.2" strokeDasharray="5 8" opacity=".85"/>
          </svg>
        )}
        {locations.map((item) => (
          <button
            key={item.id}
            className={'map-point ' + (item.chapterId === selectedChapterId ? 'in-chapter' : 'dimmed') + (item.id === selectedPlaceId ? ' selected' : '') + (item.sceneId ? ' scene-ready' : '')}
            style={{left: item.x + '%', top: item.y + '%'}}
            onClick={() => choosePlace(item.id)}
            title={item.name + ' · ' + item.evidenceLabel}
            aria-label={'查看' + item.name + '的原文依据'}
            aria-pressed={item.id === selectedPlaceId}
          >
            <span className="map-pin"><span/></span>
            <span className="map-point-label"><b>{item.name}</b><small>{item.english}</small></span>
          </button>
        ))}
      </div>
      <div className="map-legend" hidden={atlasMode !== "map"}><span className="tiny-star">✧</span> 金线：原文路线关系 · 地图点位：概念示意</div>

      {atlasMode === 'map' && selectedPlace && (
        <aside className="place-panel">
          <button className="close-place" onClick={() => setSelectedPlaceId(null)} aria-label="关闭地点详情">×</button>
          <div className="place-kicker">{selectedPlace.evidenceLabel} / VOL. {String(chapters.find((item) => item.id === selectedPlace.chapterId)?.volume ?? 0).padStart(2, '0')}</div>
          <h2>{selectedPlace.name}</h2>
          <div className="place-sub">{selectedPlace.sub}</div>
          <blockquote>{selectedPlace.quote}</blockquote>
          <p className="place-relation">{selectedPlace.relation}</p>
          <p className="place-note">{selectedPlace.note}</p>
          <a className="source-link" href={selectedPlace.sourceUrl} target="_blank" rel="noreferrer">查阅维基文库原文 ↗</a>
          {selectedPlace.sceneId === 'qingqiu' && (
            <button className="place-enter" onClick={enter}>进入青丘 3D 试境 <span>↗</span></button>
          )}
        </aside>
      )}

      <nav className="chapter-dock" aria-label="山海经十八卷导航" hidden={atlasMode !== "map"}>
        <div className="chapter-dock-heading">
          <span>十八卷 · 文本索引</span>
          <small>{selectedChapter.name} / {String(selectedChapter.volume).padStart(2, '0')}</small>
        </div>
        <div className="chapter-groups">
          {chapterGroups.map((group) => (
            <button
              key={group.id}
              className={group.id === selectedGroup.id ? 'active' : ''}
              onClick={() => chooseChapter(chapters.find((chapter) => chapter.group === group.id)!.id)}
              title={group.sublabel}
            >{group.label}</button>
          ))}
        </div>
        <div className="chapter-list">
          {visibleChapters.map((chapter) => (
            <button
              key={chapter.id}
              className={chapter.id === selectedChapterId ? 'active' : ''}
              onClick={() => chooseChapter(chapter.id)}
            ><span>{String(chapter.volume).padStart(2, '0')}</span>{chapter.name}</button>
          ))}
        </div>
        <p className="chapter-summary">{selectedChapter.summary}</p>
      </nav>
      {atlasMode !== 'map' && (
        <div className="atlas-knowledge-overlay">
          {atlasMode === 'routes'
            ? <MountainRoutes onOpenBestiary={() => setAtlasMode('bestiary')} />
            : atlasMode === 'bestiary' ? <Bestiary /> : atlasMode === 'waterways' ? <Waterways /> : <MountainResources />}
        </div>
      )}
    </section>
  );
}
