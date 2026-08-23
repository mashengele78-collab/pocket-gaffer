function finishMatch(){
  const m=S.match;
  if(m.career){
    const g=m.game;
    g.played=true;g.hg=m.res.hg;g.ag=m.res.ag;
    applyResult(S.career.table,g.h,g.a,m.res.hg,m.res.ag);
    const mdObj=S.career.fixtures.find(x=>x.md===m.md);
    simulateRestOfWeek(S.career,mdObj,g.id);
    const you=S.career.clubId===g.h?m.res.hg-m.res.ag:m.res.ag-m.res.hg;
    const note=you>0?"Win":you<0?"Loss":"Draw";
    S.career.results.push({h:g.h,a:g.a,hg:m.res.hg,ag:m.res.ag,note});
    S.career.highlights=m.res.highlights;
    S.career.inbox.push({t:"After match",b:club(g.h).short+" "+m.res.hg+"-"+m.res.ag+" "+club(g.a).short+". "+note+". xG "+m.res.hxg+"-"+m.res.axg+"."});
    const pos=standings(S.career.table).findIndex(x=>x.id===S.career.clubId)+1;
    S.career.inbox.push({t:"League desk",b:"You sit "+pos+ord(pos)+" after matchday "+m.md+"."});
    S.career.week=Math.min(38,m.md+1);
    persist();
    S.tab="home"; go("hub");
  } else go("home");
}
function startLive(mode){
  const m=S.match;
  const h=club(m.game.h), a=club(m.game.a);
  const opts=m.career?{hMent:S.career.mentality,hForm:S.career.form,seed:202600+m.md*17+h.atk}:{seed:Date.now()%1e9};
  m.res=simMatch(h,a,opts);
  m.hg=0;m.ag=0;m.min=0;m.paused=false;m.line="Kick-off.";
  if(mode==="skip"||mode==="hls"){ go("highlights"); return; }
  go("match"); tickMatch();
}
let raf=0, acc=0, last=0;
function tickMatch(){
  cancelAnimationFrame(raf);
  const loop=ts=>{
    const m=S.match; if(!m||S.screen!=="match") return;
    if(!m.paused){
      if(!last) last=ts;
      acc+=ts-last; last=ts;
      while(acc>90 && m.min<90){
        acc-=90; m.min++;
        m.res.events.filter(e=>e.min===m.min).forEach(e=>{
          if(e.kind==="goal"){ if(e.side==="H") m.hg++; else m.ag++; }
          if(e.txt) m.line=e.txt;
        });
        const hs=document.getElementById("hs");
        if(hs){ hs.textContent=m.hg; document.getElementById("as").textContent=m.ag; document.getElementById("clock").textContent=m.min+"'"; document.getElementById("line").textContent=m.line; }
        drawPitch(m);
      }
      if(m.min>=90){ go("highlights"); return; }
    } else last=ts;
    drawPitch(m);
    raf=requestAnimationFrame(loop);
  };
  last=0; acc=0; raf=requestAnimationFrame(loop);
}
function drawPitch(m){
  const c=document.getElementById("pitch"); if(!c) return;
  const ctx=c.getContext("2d"), w=c.width, h=c.height;
  ctx.fillStyle="#163024"; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(198,215,196,.35)"; ctx.lineWidth=2;
  ctx.strokeRect(16,16,w-32,h-32);
  ctx.beginPath(); ctx.moveTo(w/2,16); ctx.lineTo(w/2,h-16); ctx.stroke();
  ctx.beginPath(); ctx.arc(w/2,h/2,40,0,6.28); ctx.stroke();
  const t=m?m.min:0;
  function dots(col,left){
    const spots=left?[[0.08,.5],[0.22,.22],[0.22,.78],[0.28,.4],[0.28,.6],[0.42,.18],[0.42,.5],[0.42,.82],[0.58,.32],[0.58,.68],[0.7,.5]]:[[0.92,.5],[0.78,.22],[0.78,.78],[0.72,.4],[0.72,.6],[0.58,.18],[0.58,.5],[0.58,.82],[0.42,.32],[0.42,.68],[0.3,.5]];
    ctx.fillStyle=col;
    spots.forEach((p,i)=>{ const j=Math.sin(t*0.35+i)*8, k=Math.cos(t*0.28+i*1.3)*6; ctx.beginPath(); ctx.arc(p[0]*w+j,p[1]*h+k,6,0,6.28); ctx.fill(); });
  }
  const H=m?club(m.res.home):club("TOT"), A=m?club(m.res.away):club("ARS");
  dots(H.col==="#ffffff"?"#ddd":H.col,true);
  dots(A.col==="#ffffff"?"#ddd":A.col,false);
}
function bindHome(root){
  root.querySelector("#newc").onclick=()=>go("pick");
  root.querySelector("#cont").onclick=()=>{const s=load(); if(s){S.career=s;S.tab="home";go("hub")}};
  root.querySelector("#qm").onclick=()=>go("quick");
  root.querySelector("#lab").onclick=()=>go("lab");
}
function bindPick(root){
  root.querySelector("#back").onclick=()=>go("home");
  const box=root.querySelector("#clubs");
  CLUBS.forEach(c=>{
    const b=document.createElement("button");
    b.className="btn"; b.innerHTML='<div class="row"><span>'+c.name+'</span><span class="muted tiny">'+c.atk+'/'+c.mid+'/'+c.def+'</span></div>';
    b.onclick=()=>{S.career=newCareer(c.id,"Gaffer"); persist(); S.tab="home"; go("hub")};
    box.appendChild(b);
  });
}
function bindHub(root){
  root.querySelector("#home").onclick=()=>go("home");
  root.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{S.tab=b.dataset.t;render()});
  const play=root.querySelector("#play");
  if(play) play.onclick=()=>{ const n=nextUnplayed(S.career); S.match={career:true,md:n.md,game:n.game}; go("pre"); };
  if(S.tab==="tactics"){
    root.querySelector("#form").onchange=e=>{S.career.form=e.target.value;persist()};
    root.querySelector("#ment").onchange=e=>{S.career.mentality=e.target.value;persist()};
  }
}
function bindPre(root){
  root.querySelector("#back").onclick=()=>S.match.career?go("hub"):go("home");
  root.querySelector("#watch").onclick=()=>startLive("watch");
  root.querySelector("#hls").onclick=()=>startLive("hls");
  root.querySelector("#skip").onclick=()=>startLive("skip");
}
function bindMatch(root){
  root.querySelector("#pause").onclick=()=>{S.match.paused=!S.match.paused;render(); if(S.screen==="match") tickMatch()};
  root.querySelector("#tohl").onclick=()=>{S.match.min=90; go("highlights")};
}
function bindHL(root){ drawPitch(S.match); root.querySelector("#done").onclick=finishMatch; }
function bindQuick(root){
  root.querySelector("#back").onclick=()=>go("home");
  root.querySelector("#go").onclick=()=>{ S.match={career:false,md:0,game:{h:root.querySelector("#h").value,a:root.querySelector("#a").value,id:"q"}}; go("pre"); };
}
function bindLab(root){
  root.querySelector("#back").onclick=()=>go("home");
  root.querySelector("#run").onclick=()=>{
    const h=club(root.querySelector("#h").value), a=club(root.querySelector("#a").value), n=+root.querySelector("#n").value;
    let hw=0,d=0,aw=0,hgf=0,agf=0;
    for(let i=0;i<n;i++){ const res=simMatch(h,a,{seed:1000+i*97}); hgf+=res.hg; agf+=res.ag; if(res.hg>res.ag) hw++; else if(res.ag>res.hg) aw++; else d++; }
    S.lab={n,h:h.id,a:a.id,out:'<div class="card"><b>'+h.short+' '+hw+'W '+d+'D '+aw+'L</b><p class="tiny muted">Avg score '+(hgf/n).toFixed(2)+'-'+(agf/n).toFixed(2)+' over '+n+' games.</p></div>'};
    render();
  };
}
function render(){
  const root=document.getElementById("app");
  if(S.screen==="home") root.innerHTML=viewHome();
  else if(S.screen==="pick") root.innerHTML=viewPick();
  else if(S.screen==="hub"){ root.innerHTML=viewHub(); root.querySelector("#panel").innerHTML=S.tab==="squad"?panelSquad():S.tab==="tactics"?panelTactics():S.tab==="fixtures"?panelFix():S.tab==="table"?panelTable():S.tab==="inbox"?panelInbox():panelHome(); }
  else if(S.screen==="pre") root.innerHTML=viewPre();
  else if(S.screen==="match") root.innerHTML=viewMatch();
  else if(S.screen==="highlights") root.innerHTML=viewHL();
  else if(S.screen==="quick") root.innerHTML=viewQuickPick();
  else if(S.screen==="lab") root.innerHTML=viewLab();
  if(S.screen==="home") bindHome(root);
  if(S.screen==="pick") bindPick(root);
  if(S.screen==="hub") bindHub(root);
  if(S.screen==="pre") bindPre(root);
  if(S.screen==="match") bindMatch(root);
  if(S.screen==="highlights") bindHL(root);
  if(S.screen==="quick") bindQuick(root);
  if(S.screen==="lab") bindLab(root);
}
if("serviceWorker" in navigator){ navigator.serviceWorker.register("./sw.js",{updateViaCache:"none"}).then(r=>r.update()); }
render();
