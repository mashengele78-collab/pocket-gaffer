const S={screen:"home",tab:"home",career:null,quick:null,match:null,lab:null};
const load=()=>{try{return JSON.parse(localStorage.getItem(SAVE))}catch(e){return null}};
const persist=()=>{if(S.career) localStorage.setItem(SAVE,JSON.stringify(S.career))};
const club=id=>CLUBS.find(c=>c.id===id);
const rng=s=>{let a=s>>>0;return()=>{a=a*1664525+1013904223>>>0;return a/4294967296}};
const pick=(r,a)=>a[Math.floor(r()*a.length)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function squadFor(id){
  const named=NAMES[id]||[];
  const pos=["GK","GK","CB","CB","CB","FB","FB","FB","CM","CM","CM","CM","AM","WG","WG","ST","ST","UT"];
  return pos.map((p,i)=>{
    const base=club(id);
    const o=p==="GK"?base.def:(p==="CB"||p==="FB")?base.def:(p==="ST"||p==="WG")?base.atk:base.mid;
    const name=named[i]||(pick(Math.random,FIRST)+" "+pick(Math.random,LAST));
    return {id:id+"-"+i,name,pos,oa:clamp(Math.round(o-8+Math.random()*14),58,94),fit:86+Math.floor(Math.random()*12),mor:70+Math.floor(Math.random()*25)};
  });
}
function emptyTable(){const t={};CLUBS.forEach(c=>t[c.id]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0});return t;}
function makeFixtures(){
  let teams=CLUBS.map(c=>c.id), rounds=[];
  const n=teams.length, half=n/2;
  for(let rd=0;rd<n-1;rd++){
    const games=[];
    for(let i=0;i<half;i++){
      const h=teams[i], a=teams[n-1-i];
      if(h&&a) games.push(rd%2?{h:a,a:h}:{h,a});
    }
    teams.splice(1,0,teams.pop());
    rounds.push(games);
  }
  const all=rounds.concat(rounds.map(g=>g.map(x=>({h:x.a,a:x.h}))));
  return all.map((games,i)=>({md:i+1,games:games.map((g,j)=>({...g,played:false,hg:null,ag:null,id:i+"-"+j}))}));
}
function newCareer(clubId,name){
  return {version:VERSION,manager:name||"Gaffer",clubId,week:1,mentality:"balanced",form:"4-3-3",squad:squadFor(clubId),table:emptyTable(),fixtures:makeFixtures(),inbox:[{t:"Board",b:"Welcome to "+club(clubId).name+". Season 2026/27. Get us up the table. Europe is the brief."}],results:[],highlights:[]};
}
function standings(table){
  return CLUBS.map(c=>({...c,...table[c.id],gd:table[c.id].gf-table[c.id].ga})).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||a.name.localeCompare(b.name));
}
function applyResult(table,h,a,hg,ag){
  const H=table[h],A=table[a];
  H.p++;A.p++;H.gf+=hg;H.ga+=ag;A.gf+=ag;A.ga+=hg;
  if(hg>ag){H.w++;H.pts+=3;A.l++} else if(ag>hg){A.w++;A.pts+=3;H.l++} else {H.d++;A.d++;H.pts++;A.pts++}
}
function xi(squad,form){
  const need=form==="3-5-2"?[["GK",1],["CB",3],["FB",2],["CM",3],["ST",2]]:form==="4-2-3-1"?[["GK",1],["CB",2],["FB",2],["CM",2],["AM",1],["WG",2],["ST",1]]:[["GK",1],["CB",2],["FB",2],["CM",3],["WG",2],["ST",1]];
  const used=new Set(), out=[];
  need.forEach(([p,n])=>{
    squad.filter(s=>!used.has(s.id)).sort((a,b)=>((a.pos===p)-(b.pos===p))*2+(b.oa-a.oa)).slice(0,n).forEach(s=>{used.add(s.id);out.push(s)});
  });
  squad.filter(s=>!used.has(s.id)).sort((a,b)=>b.oa-a.oa).slice(0,11-out.length).forEach(s=>out.push(s));
  return out.slice(0,11);
}
function teamStr(c,ment,form,home){
  let s=(c.atk+c.mid+c.def)/3;
  if(ment==="attacking") s+=3;
  if(ment==="defensive") s-=1;
  if(form==="3-5-2") s+=1;
  if(home) s+=2;
  return s;
}
function simMatch(home,away,opts){
  opts=opts||{};
  const seed=opts.seed||(Date.now()%1e9);
  const r=rng(seed);
  const hs=teamStr(home,opts.hMent||"balanced",opts.hForm||"4-3-3",true);
  const as_=teamStr(away,opts.aMent||"balanced",opts.aForm||"4-3-3",false);
  const events=[], highlights=[];
  let hg=0,ag=0;
  const hxg=(hs-as_)*0.04+1.45, axg=(as_-hs)*0.04+1.15;
  function line(min,side,kind,outcome,att,def){
    const a=att.short, d=def.short;
    if(kind==="goal") return min+"' GOAL "+a+". Cut through "+d+" and the net bulges.";
    if(kind==="save") return min+"' Huge save. "+d+" stay in it.";
    if(outcome==="post") return min+"' Off the woodwork for "+a+".";
    if(kind==="card") return min+"' "+(outcome==="red"?"RED":"Yellow")+" card. Tempers.";
    return min+"' Half-chance for "+a+", gathered.";
  }
  function chance(min,side){
    const att=side==="H"?home:away, def=side==="H"?away:home;
    const x=side==="H"?hxg/12:axg/12;
    const roll=r();
    let kind="shot", outcome="off";
    if(roll<x*0.38){kind="goal";outcome="goal"; if(side==="H")hg++;else ag++;}
    else if(roll<x*0.38+0.12){kind="save";outcome="save"}
    else if(roll<x*0.38+0.16){kind="shot";outcome="post"}
    else if(r()<0.08){kind="card";outcome=r()<0.08?"red":"yellow"}
    const ev={min,side,kind,outcome,txt:line(min,side,kind,outcome,att,def)};
    events.push(ev);
    if(kind==="goal"||kind==="save"||outcome==="post"||kind==="card") highlights.push(ev);
  }
  for(let m=1;m<=90;m++){
    if(r()<0.13) chance(m, r()<hs/(hs+as_)?"H":"A");
    if(m===45) events.push({min:45,kind:"ht",txt:"Half-time."});
  }
  events.push({min:90,kind:"ft",txt:"Full-time "+home.short+" "+hg+"-"+ag+" "+away.short});
  return {hg,ag,events,highlights,hxg:+hxg.toFixed(2),axg:+axg.toFixed(2),seed,home:home.id,away:away.id};
}
function nextUnplayed(car){
  for(const md of car.fixtures){
    const mine=md.games.find(g=>(g.h===car.clubId||g.a===car.clubId)&&!g.played);
    if(mine) return {md:md.md,game:mine};
  }
  return null;
}
function simulateRestOfWeek(car,mdObj,exceptId){
  mdObj.games.forEach(g=>{
    if(g.played||g.id===exceptId) return;
    const res=simMatch(club(g.h),club(g.a),{seed:(mdObj.md*100+g.id.length)*13});
    g.played=true;g.hg=res.hg;g.ag=res.ag;
    applyResult(car.table,g.h,g.a,res.hg,res.ag);
  });
}
function go(screen,extra){Object.assign(S,extra||{},{screen});render()}
function shell(inner,topRight){
  return '<div class="top"><span>Pocket Gaffer · '+VERSION+'</span><span>'+(topRight||"Works offline")+'</span></div>'+inner;
}
function ord(n){const s=["th","st","nd","rd"], v=n%100;return s[(v-20)%10]||s[v]||s[0]}
