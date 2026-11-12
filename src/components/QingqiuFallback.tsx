import { useAppStore } from '../store';

type FailureReason = 'unavailable' | 'context-lost' | 'renderer-error';

const descriptions: Record<FailureReason, string> = {
  unavailable: '当前浏览器未能创建 WebGL 上下文。浏览器的图形渲染功能可能被禁用，或受远程桌面、沙箱预览环境限制。',
  'context-lost': '三维图形上下文已中断，可能是显卡驱动、资源限制或浏览器重置导致。',
  'renderer-error': '当前环境虽然报告支持 WebGL，但 Three.js 渲染器仍然无法启动。'
};

export default function QingqiuFallback({reason,onRetry}:{reason:FailureReason;onRetry:()=>void}) {
  const returnToAtlas = useAppStore((s)=>s.returnToAtlas);
  return <div className="qingqiu-fallback">
    <svg className="fallback-landscape" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" role="img" aria-label="青丘之山二维意境图：远山、云海与九尾狐">
      <defs>
        <linearGradient id="fallback-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#11152b"/>
          <stop offset=".44" stopColor="#33283f"/>
          <stop offset=".76" stopColor="#8b503b"/>
          <stop offset="1" stopColor="#d08247"/>
        </linearGradient>
        <linearGradient id="fallback-hills" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4652"/>
          <stop offset="1" stopColor="#252b34"/>
        </linearGradient>
        <linearGradient id="fallback-lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b46c48"/>
          <stop offset=".28" stopColor="#4c4a54"/>
          <stop offset="1" stopColor="#17232f"/>
        </linearGradient>
        <radialGradient id="fallback-halo">
          <stop stopColor="#ffd18b" stopOpacity=".66"/>
          <stop offset=".42" stopColor="#e9955b" stopOpacity=".25"/>
          <stop offset="1" stopColor="#e9955b" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="fallback-light" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#ffd99a" stopOpacity=".24"/>
          <stop offset="1" stopColor="#ffd99a" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="760" fill="url(#fallback-sky)"/>
      <ellipse cx="640" cy="265" rx="260" ry="210" fill="url(#fallback-halo)"/>
      <circle cx="650" cy="260" r="72" fill="#ffd18b" opacity=".72"/>
      <path d="M0 445L100 365L190 396L310 270L415 365L555 243L680 381L806 249L911 359L1004 310L1200 440V760H0Z" fill="#39343f"/>
      <path d="M0 502L134 387L275 465L442 340L562 427L695 316L830 448L955 345L1100 438L1200 395V760H0Z" fill="url(#fallback-hills)"/>
      <path d="M0 508Q201 486 400 505T797 496T1200 512V760H0Z" fill="#5b5349" opacity=".36"/>
      <path d="M0 585Q255 538 508 571T1200 552V760H0Z" fill="url(#fallback-lake)"/>
      <path d="M0 626Q280 586 610 617T1200 602" fill="none" stroke="#f0b878" strokeWidth="2" opacity=".42"/>
      <path d="M0 662Q330 645 663 660T1200 639" fill="none" stroke="#d8a478" strokeWidth="1" opacity=".24"/>
      <path d="M0 570Q255 526 508 559T1200 540V760H0Z" fill="url(#fallback-light)" opacity=".28"/>
      <g opacity=".7" fill="#1a222b">
        <path d="M132 579l23-89 23 89h-12l21 23h-65l21-23z"/>
        <path d="M230 580l18-70 18 70h-10l16 21h-49l15-21z"/>
        <path d="M1006 579l26-106 26 106h-14l22 27h-70l22-27z"/>
        <path d="M1096 584l18-74 19 74h-10l16 20h-51l18-20z"/>
      </g>
      <g transform="translate(670 530)">
        <ellipse cx="0" cy="62" rx="118" ry="18" fill="#101a24" opacity=".55"/>
        {Array.from({length:9},(_,i)=>{
          const dx=(i-4)*21;
          return <path key={i} d={`M0 22Q${dx*.8} -80 ${dx*1.2} -127T${dx*1.55} -170`}
            fill="none" stroke={i%2?'#f7e9d2':'#ddc9ae'} strokeWidth="16" strokeLinecap="round" opacity=".92"/>;
        })}
        <ellipse cx="0" cy="9" rx="42" ry="58" fill="#f3ead9"/>
        <path d="M-28-20Q-49-63-31-80L-16-58L16-58L31-80Q49-63 28-20Z" fill="#f5eadb"/>
        <path d="M-28-80l7 23-13-9zM28-80l-7 23 13-9z" fill="#bf9d92"/>
        <circle cx="-14" cy="-39" r="2.3" fill="#344a4a"/>
        <circle cx="14" cy="-39" r="2.3" fill="#344a4a"/>
        <path d="M-18 55l-11 38M18 55l11 38" stroke="#f3ead9" strokeWidth="14" strokeLinecap="round"/>
      </g>
      <g fill="#ffd18b" opacity=".72">
        <circle cx="394" cy="350" r="2"/><circle cx="458" cy="438" r="1.3"/>
        <circle cx="733" cy="390" r="2"/><circle cx="919" cy="450" r="1.5"/>
      </g>
    </svg>
    <section className="webgl-fallback-panel" role="alert">
      <div className="webgl-fallback-kicker">3D RENDERING UNAVAILABLE</div>
      <h2>三维场景暂不可用</h2>
      <p>{descriptions[reason]}</p>
      <p className="webgl-fallback-detail">可以先浏览青丘的二维概念场景。要体验 3D，请使用独立的 Chrome / Edge 标签页打开网站，并在 <code>chrome://gpu</code> 中确认 WebGL 已启用；必要时检查浏览器图形加速设置后重启。</p>
      <div className="webgl-fallback-actions">
        <button type="button" onClick={onRetry}>重新检测 3D</button>
        <button type="button" className="secondary" onClick={returnToAtlas}>返回山海舆图</button>
      </div>
    </section>
  </div>;
}
