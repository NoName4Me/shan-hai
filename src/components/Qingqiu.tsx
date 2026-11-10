import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, Float } from '@react-three/drei';
import { useMemo, useLayoutEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store';

const clamp = (x:number,a:number,b:number) => Math.max(a,Math.min(b,x));
function heightAt(x:number,z:number) {
  const r=Math.hypot(x,z);
  const peripheral=Math.pow(clamp((r-10)/47,0,1),1.5);
  const hill=(cx:number,cz:number,h:number,s:number)=>h*Math.exp(-((x-cx)**2+(z-cz)**2)/s);
  return 0.42+0.19*Math.sin(x*.29)*Math.cos(z*.31)+peripheral*(4.3+1.25*Math.sin(x*.20+z*.15))
    +hill(-30,-23,14,285)+hill(27,-30,18,260)+hill(-5,-47,22,400)
    +hill(-41,16,14,280)+hill(36,22,12,290);
}
function Terrain() {
  const geometry=useMemo(()=>{
    const geo=new THREE.PlaneGeometry(146,146,190,190);
    geo.rotateX(-Math.PI/2);
    const pos=geo.attributes.position as THREE.BufferAttribute;
    const color=new THREE.Color();
    const colors:number[]=[];
    const low=new THREE.Color('#41675b'), high=new THREE.Color('#bcc2aa'), ridge=new THREE.Color('#526869');
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),z=pos.getZ(i),h=heightAt(x,z);
      pos.setY(i,h);
      const k=clamp((h-1)/18,0,1);
      color.copy(low).lerp(ridge,k*.73).lerp(high,clamp((h-16)/15,0,.65));
      const modulation=Math.sin(x*1.47+z*.37)*Math.cos(z*1.77-x*.41)*.024;
      colors.push(clamp(color.r+modulation,0,1),clamp(color.g+modulation,0,1),clamp(color.b+modulation,0,1));
    }
    geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
    geo.computeVertexNormals();
    return geo;
  },[]);
  return <mesh geometry={geometry} receiveShadow><meshStandardMaterial vertexColors roughness={.93} metalness={0} /></mesh>;
}
function Forest() {
  const trunks=useRef<THREE.InstancedMesh>(null);
  const crowns=useRef<THREE.InstancedMesh>(null);
  const trees=useMemo(()=>{
    let seed=294517;
    const rng=()=>((seed=(1664525*seed+1013904223)>>>0)/4294967296);
    const arr:{x:number;y:number;z:number;h:number;r:number}[]=[];
    for(let i=0;i<480;i++){
      const a=rng()*Math.PI*2,r=11+Math.sqrt(rng())*61;
      const x=Math.cos(a)*r,z=Math.sin(a)*r;
      if(Math.abs(x)<6&&z>-15&&z<13)continue;
      const y=heightAt(x,z);
      if(y<0.35)continue;
      arr.push({x,y,z,h:1.3+rng()*3.8,r:.5+rng()*.55});
    }
    return arr;
  },[]);
  useLayoutEffect(()=>{
    const dummy=new THREE.Object3D();
    for(let i=0;i<trees.length;i++){
      const t=trees[i];
      dummy.position.set(t.x,t.y+t.h*.28,t.z);dummy.scale.set(t.r*.14,t.h*.56,t.r*.14);dummy.updateMatrix();
      trunks.current?.setMatrixAt(i,dummy.matrix);
      dummy.position.set(t.x,t.y+t.h*.75,t.z);
      dummy.rotation.y=(i%9)*.72;
      dummy.scale.set(t.h*.28*t.r,t.h*.9,t.h*.28*t.r);dummy.updateMatrix();
      crowns.current?.setMatrixAt(i,dummy.matrix);
    }
    if(trunks.current)trunks.current.instanceMatrix.needsUpdate=true;
    if(crowns.current)crowns.current.instanceMatrix.needsUpdate=true;
  },[trees]);
  return <group>
    <instancedMesh ref={trunks} args={[undefined,undefined,trees.length]} castShadow>
      <cylinderGeometry args={[.72,1,1,5]}/><meshStandardMaterial color="#3c4b43" roughness={1}/>
    </instancedMesh>
    <instancedMesh ref={crowns} args={[undefined,undefined,trees.length]} castShadow>
      <coneGeometry args={[1,1,6]}/><meshStandardMaterial color="#244c46" roughness={.95} flatShading/>
    </instancedMesh>
  </group>;
}
function NineTails() {
  const tails=useMemo(()=>Array.from({length:9},(_,index)=>{
    const n=index-4,spread=n/4;
    const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(spread*.20,1.50,-1.1),
      new THREE.Vector3(spread*1.35,2.55,-2.10),
      new THREE.Vector3(spread*2.30,3.7+Math.abs(spread)*.85,-3.28),
      new THREE.Vector3(spread*2.68,4.18+Math.abs(spread)*.64,-4.5)
    ]);
    return {geometry:new THREE.TubeGeometry(curve,28,.105,8,false),end:curve.getPoint(1)};
  }),[]);
  return <group>
    {tails.map((tail,i)=><group key={i}>
      <mesh geometry={tail.geometry} castShadow><meshStandardMaterial color={i%2?'#dcd9c7':'#f1e7d5'} roughness={.72}/></mesh>
      <mesh position={tail.end.toArray()}><sphereGeometry args={[.15,9,8]}/><meshStandardMaterial color="#f7eee2" roughness={.8}/></mesh>
    </group>)}
  </group>;
}
function Fox({onSelect}:{onSelect:()=>void}) {
  const fox=useRef<THREE.Group>(null);
  const [hovered,setHovered]=useState(false);
  useFrame((state)=>{
    if(fox.current) fox.current.rotation.y=.055*Math.sin(state.clock.elapsedTime*.42);
  });
  return <group ref={fox} position={[0,heightAt(0,0),0]}
    onClick={(e)=>{e.stopPropagation();onSelect()}}
    onPointerOver={(e)=>{e.stopPropagation();setHovered(true);document.body.style.cursor='pointer'}}
    onPointerOut={()=>{setHovered(false);document.body.style.cursor='auto'}}>
    <NineTails/>
    <mesh position={[0,1.53,0]} castShadow>
      <sphereGeometry args={[1,24,20]}/><meshStandardMaterial color={hovered?'#fff4e2':'#e6e0cd'} roughness={.85}/>
      <group scale={[.69,.70,1.48]}/>
    </mesh>
    <mesh position={[0,1.55,-.45]} scale={[.7,.67,1.5]} castShadow><sphereGeometry args={[1,22,16]}/><meshStandardMaterial color="#f3e8d7" roughness={.85}/></mesh>
    <mesh position={[0,2.55,.89]} scale={[.58,.65,.64]} castShadow><sphereGeometry args={[1,24,16]}/><meshStandardMaterial color="#f3ecdd" roughness={.88}/></mesh>
    <mesh position={[0,2.33,1.48]} scale={[.3,.25,.42]} castShadow><sphereGeometry args={[1,18,14]}/><meshStandardMaterial color="#e9ddd0" roughness={.85}/></mesh>
    {[-.36,.36].map((x)=><mesh key={x} position={[x,3.25,.79]} rotation={[.13,0,-x*.45]} castShadow>
      <coneGeometry args={[.22,.66,8]}/><meshStandardMaterial color="#f2e4d3" roughness={.8}/>
    </mesh>)}
    {[-.25,.25].map((x)=><mesh key={x} position={[x,2.66,1.42]} scale={[.075,.065,.055]}>
      <sphereGeometry args={[1,10,10]}/><meshStandardMaterial color="#263f40" roughness={.2}/>
    </mesh>)}
    <mesh position={[0,2.26,1.87]} scale={[.1,.075,.08]}>
      <sphereGeometry args={[1,12,10]}/><meshStandardMaterial color="#544e4c" roughness={.55}/>
    </mesh>
    {[-.48,.48].map((x)=>[-.9,.85].map((z)=><mesh key={x+'-'+z} position={[x,.71,z]} scale={[.23,.68,.28]} castShadow>
      <sphereGeometry args={[1,12,12]}/><meshStandardMaterial color="#f1e6d6" roughness={.9}/>
    </mesh>))}
  </group>;
}
function FloatingIsles() {
  return <group>
    {[[24,8,-35,1.8],[-28,12,-31,2.8],[39,13,10,2.1]].map(([x,y,z,s],i)=><Float key={i} speed={.5+i*.1} floatIntensity={.35}>
      <mesh position={[x,y,z]} rotation={[.17,i*.9,.3]} scale={[s,s*1.2,s]} castShadow>
        <dodecahedronGeometry args={[1,1]}/><meshStandardMaterial color="#748f85" roughness={.87} flatShading/>
      </mesh>
    </Float>)}
  </group>;
}
function Water() {
  const ref=useRef<THREE.Mesh>(null);
  useFrame((state)=>{if(ref.current)ref.current.rotation.z=Math.sin(state.clock.elapsedTime*.17)*.018});
  return <mesh ref={ref} position={[21,.50,6]} rotation={[-Math.PI/2,0,.3]} receiveShadow>
    <circleGeometry args={[12,80]}/>
    <meshPhysicalMaterial color="#4b9795" transparent opacity={.71} roughness={.19} metalness={.1} clearcoat={.9}/>
  </mesh>;
}
export default function Qingqiu() {
  const toggleInfo=useAppStore((s)=>s.toggleInfo);
  return <Canvas shadows dpr={[1,1.7]} camera={{position:[19,12,25],fov:44,near:.1,far:260}}
    gl={{antialias:true,alpha:true,powerPreference:'high-performance'}}>
    <color attach="background" args={['#96b8b5']}/>
    <fog attach="fog" args={['#96b8b5',35,116]}/>
    <ambientLight intensity={1.35} color="#e5eee2"/>
    <hemisphereLight intensity={1.1} color="#d5eee7" groundColor="#4d5342"/>
    <directionalLight castShadow position={[-24,36,16]} color="#fff4da" intensity={2.45}
      shadow-mapSize={[1024,1024]} shadow-camera-left={-44} shadow-camera-right={44}
      shadow-camera-top={44} shadow-camera-bottom={-44} shadow-bias={-.00018}/>
    <Terrain/>
    <Water/>
    <Forest/>
    <FloatingIsles/>
    <Fox onSelect={toggleInfo}/>
    <Sparkles count={110} speed={.24} size={1.8} opacity={.47} scale={[52,18,52]} position={[0,8,0]} color="#f4e0a5"/>
    <OrbitControls makeDefault target={[0,1.9,0]} enablePan={false} enableDamping dampingFactor={.06}
      autoRotate autoRotateSpeed={.32} minDistance={8} maxDistance={62}
      minPolarAngle={.16} maxPolarAngle={Math.PI/2.10}/>
  </Canvas>;
}
