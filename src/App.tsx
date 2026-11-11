import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Atlas from './components/Atlas';
import WebGLGuard from './components/WebGLGuard';
import { useAppStore } from './store';

function App() {
  const view=useAppStore((s)=>s.view);
  const infoOpen=useAppStore((s)=>s.infoOpen);
  const enterQingqiu=useAppStore((s)=>s.enterQingqiu);
  const returnToAtlas=useAppStore((s)=>s.returnToAtlas);
  const toggleInfo=useAppStore((s)=>s.toggleInfo);
  const page=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    if(page.current)gsap.fromTo(page.current,{opacity:0},{opacity:1,duration:.85,ease:'power2.out'});
  },[view]);
  return <main className={'app '+view}>
    <header className="site-header">
      <a className="brand" href="./" onClick={(e)=>{e.preventDefault();returnToAtlas()}} aria-label="返回山海世界舆图">
        <span className="brand-symbol">山</span><span className="brand-name">山海之间<small>SHAN HAI · AN IMMERSIVE ATLAS</small></span>
      </a>
      <div className="header-right">
        <span className="edition">山海经 · 神话地理实验</span>
        {view==='qingqiu'&&<button className="header-back" onClick={returnToAtlas}>← 返回舆图</button>}
        <span className="header-menu">卷 / 壹</span>
      </div>
    </header>
    <div ref={page} className="page">
      {view==='atlas' ? <>
        <div className="atlas-hero"><div className="eyebrow"><span className="eyebrow-line"/> THE WORLD BETWEEN MOUNTAINS AND SEAS</div>
          <h1>山海<span>之间</span></h1>
          <p>天地之初，万象有灵。循古籍所记，入无垠山海。</p>
          <div className="hero-cta"><button onClick={enterQingqiu}>进入青丘 <span>↗</span></button><span>首个开放试境 · 南山经</span></div>
        </div>
        <Atlas/>
        <footer className="site-footer"><span>卷帙十八 · 世界尚在生成</span><span>MYTHICAL RECONSTRUCTION / NOT A HISTORICAL MAP</span></footer>
      </> : <>
        <div className="world-canvas"><WebGLGuard/></div>
        <div className="world-vignette" aria-hidden="true"/>
        <div className="world-heading">
          <div className="eyebrow"><span className="eyebrow-line"/> THE FIRST REALM · SOUTHERN MOUNTAINS</div>
          <h1>青丘<span>之山</span></h1>
          <p>循山而行，遇九尾之狐。</p>
        </div>
        <div className="world-guide"><span className="guide-dot"/> 拖动环视 · 滚轮缩放 · 点击九尾狐查看原文</div>
        <button className="world-info-button" onClick={toggleInfo} aria-expanded={infoOpen}>文献记录 <span>{infoOpen?'−':'+'}</span></button>
        {infoOpen&&<aside className="info-panel">
          <button className="close-info" onClick={toggleInfo} aria-label="关闭">×</button>
          <p className="info-kicker">THE BOOK OF MOUNTAINS & SEAS</p>
          <h2>青丘之山</h2><span className="info-source">《山海经 · 南山经》</span>
          <blockquote>“有兽焉，其状如狐而九尾。”</blockquote>
          <p>原文记载青丘山有九尾狐。本场景是依据文本意象进行的艺术性空间重构，并非原书地理形貌的确定复原。</p>
          <div className="info-status">原文依据：青丘山、九尾狐 ｜ 视觉呈现：概念设计</div>
        </aside>}
      </>}
    </div>
  </main>;
}
export default App;
