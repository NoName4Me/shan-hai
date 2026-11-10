// 原生 WebGL 的青丘场景：没有运行时 CDN 或外部 3D 模型依赖。
export function createQingqiuWorld(canvas, onSelect) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' });
  if (!gl) return { supported: false, setActive() {}, reset() {}, dispose() {} };

  const vs = [
    'attribute vec3 aPosition;',
    'attribute vec3 aNormal;',
    'attribute vec3 aColor;',
    'uniform mat4 uMVP;',
    'uniform float uTime;',
    'uniform float uWater;',
    'varying vec3 vColor;',
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'void main() {',
    '  vec3 p = aPosition;',
    '  if (uWater > 0.5) p.y += sin(p.x*0.43 + uTime*0.46)*0.07 + cos(p.z*0.52 - uTime*0.36)*0.055;',
    '  vColor=aColor; vNormal=aNormal; vPosition=p;',
    '  gl_Position=uMVP*vec4(p,1.0);',
    '}'
  ].join('\n');
  const fs = [
    'precision mediump float;',
    'varying vec3 vColor;',
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'uniform vec3 uEye;',
    'uniform float uWater;',
    'void main() {',
    '  vec3 n=normalize(vNormal);',
    '  vec3 light=normalize(vec3(-0.56,0.9,0.55));',
    '  float shade=0.64+0.40*max(dot(n,light),0.0);',
    '  vec3 c=vColor*shade;',
    '  if(uWater>0.5) { c+=vec3(0.035,0.073,0.074)*pow(max(dot(reflect(-light,n),normalize(uEye-vPosition)),0.0),11.0); }',
    '  float d=distance(vPosition.xz,uEye.xz);',
    '  float fog=smoothstep(27.0,104.0,d)*0.76;',
    '  c=mix(c,vec3(0.64,0.75,0.71),fog);',
    '  gl_FragColor=vec4(c,1.0);',
    '}'
  ].join('\n');

  function shader(type, source) {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  const program=gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER,vs));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  const P=gl.getAttribLocation(program,'aPosition');
  const N=gl.getAttribLocation(program,'aNormal');
  const C=gl.getAttribLocation(program,'aColor');
  const U={mvp:gl.getUniformLocation(program,'uMVP'),eye:gl.getUniformLocation(program,'uEye'),time:gl.getUniformLocation(program,'uTime'),water:gl.getUniformLocation(program,'uWater')};
  const land=[], water=[];
  const rnd=(()=>{let s=872041;return ()=>((s=(s*1664525+1013904223)>>>0)/4294967296)})();
  const mix=(a,b,t)=>a+(b-a)*t;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const v3=(x,y,z)=>[x,y,z];
  const sub=(a,b)=>v3(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  const cross=(a,b)=>v3(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]);
  const norm=(a)=>{let len=Math.hypot(...a)||1;return a.map(v=>v/len)};
  const palette={
    floor:[0.23,0.42,0.36], moss:[0.29,0.49,0.38],
    rock:[0.29,0.41,0.42], high:[0.51,0.61,0.54],
    pine:[0.085,0.29,0.29], pine2:[0.15,0.37,0.34],
    trunk:[0.22,0.31,0.30], white:[0.91,0.88,0.78],
    ivory:[0.96,0.88,0.76], rose:[0.93,0.69,0.59]
  };
  function push(buff,p,n,c){buff.push(p[0],p[1],p[2],n[0],n[1],n[2],c[0],c[1],c[2])}
  function tri(buff,a,b,c,color) {
    const n=norm(cross(sub(b,a),sub(c,a)));
    push(buff,a,n,color);push(buff,b,n,color);push(buff,c,n,color);
  }
  function quad(buff,a,b,c,d,color){tri(buff,a,b,c,color);tri(buff,a,c,d,color)}
  function gradient(a,b,t){return a.map((v,i)=>mix(v,b[i],t))}
  function ground(x,z){
    const r=Math.hypot(x,z);
    const low=1.68+0.19*Math.sin(x*.32)*Math.cos(z*.37)+0.10*Math.sin(x*.82+z*.53);
    const shore=clamp((r-8)/19,0,1);
    let ridge=shore*shore*(2.9 + 1.7*Math.sin(x*.28+z*.11)*Math.sin(z*.23-x*.14));
    const peak=(px,pz,h,spread)=>h*Math.exp(-((x-px)**2+(z-pz)**2)/spread);
    ridge+=peak(-26,-11,15,165)+peak(28,-19,20,170)+peak(-8,-37,18,255)+peak(35,19,12,145)+peak(-37,18,10,140);
    ridge+=shore*0.65*(Math.sin(x*.8)*Math.cos(z*.7)+Math.cos(z*.36+x*.59));
    return low+ridge;
  }
  const grid=112, extent=66;
  for(let iz=0;iz<grid;iz++) for(let ix=0;ix<grid;ix++){
    const x0=-extent+2*extent*ix/grid, x1=-extent+2*extent*(ix+1)/grid;
    const z0=-extent+2*extent*iz/grid, z1=-extent+2*extent*(iz+1)/grid;
    const a=v3(x0,ground(x0,z0),z0),b=v3(x1,ground(x1,z0),z0);
    const c=v3(x1,ground(x1,z1),z1),d=v3(x0,ground(x0,z1),z1);
    const h=(a[1]+b[1]+c[1]+d[1])/4;
    const k=clamp((h-3)/16,0,1);
    const c0=gradient(palette.floor,palette.rock,k);
    const color=gradient(c0,palette.high,clamp((h-16)/12,0,.68));
    const jitter=(rnd()-.5)*.055;
    const shade=color.map(x=>clamp(x+jitter,0,1));
    quad(land,a,b,c,d,shade);
  }
  quad(water,v3(-80,1.44,-80),v3(80,1.44,-80),v3(80,1.44,80),v3(-80,1.44,80),[.22,.48,.47]);

  function ellipsoid(buff,cx,cy,cz,rx,ry,rz,color,lats=10,lons=14){
    for(let i=0;i<lats;i++){
      const p0=Math.PI*i/lats,p1=Math.PI*(i+1)/lats;
      for(let j=0;j<lons;j++){
        const t0=2*Math.PI*j/lons,t1=2*Math.PI*(j+1)/lons;
        const pt=(p,t)=>v3(cx+rx*Math.sin(p)*Math.cos(t),cy+ry*Math.cos(p),cz+rz*Math.sin(p)*Math.sin(t));
        quad(buff,pt(p0,t0),pt(p1,t0),pt(p1,t1),pt(p0,t1),color);
      }
    }
  }
  function cone(buff,x,y,z,r,h,color,sides=7){
    const tip=v3(x,y+h,z);
    for(let j=0;j<sides;j++) {
      const t=j*2*Math.PI/sides, u=(j+1)*2*Math.PI/sides;
      tri(buff,v3(x+r*Math.cos(t),y,z+r*Math.sin(t)),tip,v3(x+r*Math.cos(u),y,z+r*Math.sin(u)),color);
    }
  }
  function cylinder(buff,x,y,z,r,h,color,sides=6){
    for(let j=0;j<sides;j++) {
      const t=j*2*Math.PI/sides,u=(j+1)*2*Math.PI/sides;
      quad(buff,v3(x+r*Math.cos(t),y,z+r*Math.sin(t)),v3(x+r*Math.cos(u),y,z+r*Math.sin(u)),
        v3(x+r*Math.cos(u),y+h,z+r*Math.sin(u)),v3(x+r*Math.cos(t),y+h,z+r*Math.sin(t)),color);
    }
  }
  function tubular(buff, points, radius, color, sides=7){
    for(let j=0;j<points.length-1;j++){
      const a=points[j],b=points[j+1], tang=norm(sub(b,a));
      let axis=norm(cross(tang,[0,0,1]));
      if(Math.hypot(...axis)<.1)axis=[1,0,0];
      const axis2=norm(cross(tang,axis));
      const ring=(center,r,t)=>v3(
        center[0]+r*(axis[0]*Math.cos(t)+axis2[0]*Math.sin(t)),
        center[1]+r*(axis[1]*Math.cos(t)+axis2[1]*Math.sin(t)),
        center[2]+r*(axis[2]*Math.cos(t)+axis2[2]*Math.sin(t))
      );
      for(let k=0;k<sides;k++){
        const t=k*2*Math.PI/sides,u=(k+1)*2*Math.PI/sides;
        quad(buff,ring(a,radius(j/(points.length-1)),t),ring(a,radius(j/(points.length-1)),u),
        ring(b,radius((j+1)/(points.length-1)),u),ring(b,radius((j+1)/(points.length-1)),t),color);
      }
    }
  }

  // 树木成片而非均匀散布，中心视野保留完整的主体轮廓。
  for(let i=0;i<350;i++){
    const angle=rnd()*Math.PI*2, rad=14+Math.pow(rnd(),.85)*52;
    const x=Math.sin(angle)*rad,z=Math.cos(angle)*rad;
    if((x*x/130+z*z/210)<1 || Math.abs(x)<5&&z>-13&&z<7) continue;
    const y=ground(x,z), tall=1.4+rnd()*3.5;
    if(y<1.50)continue;
    cylinder(land,x,y,z,.09+tall*.026,tall*.35,palette.trunk,5);
    const leaf=(rnd()>.48)?palette.pine:palette.pine2;
    cone(land,x,y+tall*.25,z,tall*.27,tall*.85,leaf,6);
    cone(land,x,y+tall*.64,z,tall*.19,tall*.65,leaf,6);
  }

  // 山体周边少量白石，尽量保留大面积静谧色块。
  for(let i=0;i<65;i++){
    const a=rnd()*Math.PI*2,r=6+rnd()*46,x=Math.cos(a)*r,z=Math.sin(a)*r;
    const y=ground(x,z),w=.24+rnd()*.65;
    ellipsoid(land,x,y+.12*w,z,w,w*.33,w*.68,gradient(palette.rock,palette.high,rnd()),5,8);
  }
  // 灵狐：九条独立弧线，配比克制，避免拟人化和玩具感。
  const py=ground(0,0);
  ellipsoid(land,0,py+2.15,0,1.13,1.17,2.17,palette.white,13,18);
  ellipsoid(land,0,py+3.02,1.37,.68,1.17,.86,palette.ivory,12,16);
  ellipsoid(land,0,py+3.93,1.9,.78,.72,.81,palette.white,12,16);
  ellipsoid(land,0,py+3.68,2.58,.35,.28,.60,palette.white,10,12);
  cone(land,-.44,py+4.28,1.76,.25,.92,palette.ivory,8);
  cone(land, .44,py+4.28,1.76,.25,.92,palette.ivory,8);
  ellipsoid(land,-.27,py+4.02,2.51,.075,.075,.08,[.12,.25,.25],7,9);
  ellipsoid(land,.27,py+4.02,2.51,.075,.075,.08,[.12,.25,.25],7,9);
  for(let i=0;i<9;i++){
    const spread=i-4, outer=Math.abs(spread)/4, path=[];
    const sway=spread*.79;
    for(let k=0;k<=22;k++){
      const t=k/22;
      const x=sway*(.10+1.0*t)+Math.sin(t*Math.PI)*Math.sign(spread || 1)*outer*.35;
      const y=py+1.8+Math.sin(t*Math.PI*.84)*(2.9+outer*1.0)+t*(1.2+outer*1.3);
      const z=-1.65-t*(3.0+outer*1.15)+1.25*Math.sin(t*Math.PI);
      path.push(v3(x,y,z));
    }
    tubular(land,path,t=>.33*Math.pow(1-t,.64)+.012,
      gradient(palette.white,palette.rose,outer*.24),9);
  }
  // 环境中的纤细草穗与灵光。
  for(let i=0;i<150;i++){
    const theta=rnd()*6.283,r=3+rnd()*15,x=Math.sin(theta)*r,z=Math.cos(theta)*r;
    if(r<4.2)continue;
    const y=ground(x,z),s=.18+rnd()*.55;
    cylinder(land,x,y,z,.017,s,[.62,.67,.46],4);
    ellipsoid(land,x,y+s+.08,z,.07,.11,.07,[.84,.78,.59],4,5);
  }

  function makeBuffer(data){
    const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    return {buffer:b,count:data.length/9};
  }
  const groundBuf=makeBuffer(land),waterBuf=makeBuffer(water);
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
  gl.disable(gl.CULL_FACE);
  let width=0,height=0,active=false,disposed=false,raf=0;
  let yaw=.57,pitch=.40,dist=30.5;
  let dragging=false,lastX=0,lastY=0,moved=0;
  function perspective(fov,aspect,near,far){
    const f=1/Math.tan(fov/2);
    return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)/(near-far),-1, 0,0,(2*far*near)/(near-far),0];
  }
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  function lookAt(eye,target) {
    const f=norm(sub(target,eye)),r=norm(cross(f,[0,1,0])),u=cross(r,f);
    return [r[0],u[0],-f[0],0, r[1],u[1],-f[1],0, r[2],u[2],-f[2],0,
      -dot(r,eye),-dot(u,eye),dot(f,eye),1];
  }
  function multiply(a,b){
    const o=new Array(16).fill(0);
    for(let c=0;c<4;c++)for(let r=0;r<4;r++)for(let k=0;k<4;k++)o[c*4+r]+=a[k*4+r]*b[c*4+k];
    return o;
  }
  function paintBuffer(buf,water){
    gl.uniform1f(U.water,water?1:0);
    gl.bindBuffer(gl.ARRAY_BUFFER,buf.buffer);
    const stride=9*4;
    gl.enableVertexAttribArray(P);gl.vertexAttribPointer(P,3,gl.FLOAT,false,stride,0);
    gl.enableVertexAttribArray(N);gl.vertexAttribPointer(N,3,gl.FLOAT,false,stride,12);
    gl.enableVertexAttribArray(C);gl.vertexAttribPointer(C,3,gl.FLOAT,false,stride,24);
    gl.drawArrays(gl.TRIANGLES,0,buf.count);
  }
  let start=performance.now();
  function frame(now){
    if(!active||disposed)return;
    const w=canvas.clientWidth||1,h=canvas.clientHeight||1;
    const dpr=Math.min(window.devicePixelRatio||1,1.7);
    const nw=Math.round(w*dpr),nh=Math.round(h*dpr);
    if(nw!==width||nh!==height){width=nw;height=nh;canvas.width=nw;canvas.height=nh;gl.viewport(0,0,nw,nh)}
    if(!dragging)yaw+=.00023;
    const at=[0,py+2.7,0];
    const eye=[at[0]+dist*Math.sin(yaw)*Math.cos(pitch),
      at[1]+dist*Math.sin(pitch),at[2]+dist*Math.cos(yaw)*Math.cos(pitch)];
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    const vp=multiply(perspective(Math.PI/3.5,width/Math.max(height,1),.1,260),lookAt(eye,at));
    gl.uniformMatrix4fv(U.mvp,false,new Float32Array(vp));
    gl.uniform3fv(U.eye,new Float32Array(eye));
    gl.uniform1f(U.time,(now-start)*.001);
    paintBuffer(waterBuf,true);paintBuffer(groundBuf,false);
    raf=requestAnimationFrame(frame);
  }
  function setActive(next){if(disposed)return;if(next&&!active){active=true;start=performance.now();raf=requestAnimationFrame(frame)}else if(!next&&active){active=false;cancelAnimationFrame(raf)}}
  function reset(){yaw=.57;pitch=.40;dist=30.5}
  function down(e){dragging=true;moved=0;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)}
  function move(e){if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;
    moved+=Math.abs(dx)+Math.abs(dy);yaw-=dx*.006;pitch=clamp(pitch+dy*.004,-.03,1.20)}
  function up(){if(!dragging)return;dragging=false;if(moved<6&&typeof onSelect==='function')onSelect('fox')}
  function zoom(e){e.preventDefault();dist=clamp(dist+e.deltaY*.024,14,73)}
  canvas.addEventListener('pointerdown',down);
  canvas.addEventListener('pointermove',move);
  canvas.addEventListener('pointerup',up);
  canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('wheel',zoom,{passive:false});
  return {supported:true,setActive,reset,dispose(){
    setActive(false);disposed=true;canvas.removeEventListener('pointerdown',down);
    canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);
    canvas.removeEventListener('pointercancel',up);canvas.removeEventListener('wheel',zoom);
    gl.deleteBuffer(groundBuf.buffer);gl.deleteBuffer(waterBuf.buffer);gl.deleteProgram(program);
  }};
}
