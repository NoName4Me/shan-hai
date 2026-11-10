import { locations } from '../atlas';
import { useAppStore } from '../store';

export default function Atlas() {
  const enter = useAppStore((s) => s.enterQingqiu);
  return (
    <section className="atlas-section" aria-label="山海经神话概念舆图">
      <div className="atlas-topline"><span>天地有尽 · 山海无垠</span><span>THE ATLAS OF MYTHS / 001</span></div>
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
        {locations.map((item) => (
          <button key={item.id} className={'map-point '+(item.available?'available':'locked')}
            style={{left: item.x+'%', top:item.y+'%'}}
            disabled={!item.available} onClick={enter}
            title={item.available?'进入青丘':'后续开放：'+item.name}
            aria-label={item.available?'进入'+item.name:item.name+'，后续开放'}>
            <span className="map-pin"><span/></span>
            <span className="map-point-label"><b>{item.name}</b><small>{item.english}</small></span>
          </button>
        ))}
      </div>
      <div className="map-legend"><span className="tiny-star">✧</span> 地点位置为艺术性示意，不等于历史地理坐标</div>
    </section>
  );
}
