function viewHome(){
  const saved=load();
  return shell('<div class="hero"><div class="kicker">Football manager</div><h1 style="font-size:42px">Pocket Gaffer</h1><p class="lead">2026/27 rebuild. Watch the match, skip to highlights, or run the lab. Career saves on this phone.</p><div class="stack"><button class="btn primary" id="newc">New career</button><button class="btn" id="cont" '+(saved?"":"disabled")+'>Continue'+(saved?(' · '+club(saved.clubId).short+' · MD '+saved.week):'')+'</button><button class="btn" id="qm">Quick match</button><button class="btn ghost" id="lab">Engine lab</button></div></div>');
}
function viewPick(){
  return shell('<button class="btn ghost" id="back">← Back</button><h2 style="margin:8px 0 6px">Choose your club</h2><p class="muted tiny">Premier League 2026/27 · 20 clubs</p><div class="stack list" style="margin-top:12px" id="clubs"></div>');
}
function viewHub(){
  const c=S.career, me=club(c.clubId), nxt=nextUnplayed(c);
  const pos=standings(c.table).findIndex(x=>x.id===c.clubId)+1;
  const rec=c.table[c.clubId];
  const tabs=["home","squad","tactics","fixtures","table","inbox"].map(t=>'<button data-t="'+t+'" class="'+(S.tab===t?"on":"")+'">'+t+'</button>').join("");
  const play=nxt?('<div style="margin-top:14px"><button class="btn primary" id="play">Play next · '+club(nxt.game.h).short+' vs '+club(nxt.game.a).short+'</button></div>'):'<p class="muted">Season complete.</p>';
  return shell('<div class="row"><div><div class="kicker">'+me.name+'</div><h2>'+c.manager+'</h2></div><button class="btn ghost" id="home">Exit</button></div><div class="card" style="margin:12px 0"><div class="row"><span>Table</span><b>'+pos+ord(pos)+' · '+rec.pts+' pts · '+rec.p+' played</b></div><div class="muted tiny" style="margin-top:6px">'+c.form+' · '+c.mentality+' · MD '+c.week+'</div></div><div class="tabs" id="tabs">'+tabs+'</div><div id="panel"></div>'+play, "Saved on device");
}
function panelHome(){
  const nxt=nextUnplayed(S.career);
  const last=S.career.results.slice(-3).reverse();
  const recent=last.length?last.map(r=>'<div class="row tiny" style="margin-top:8px"><span>'+club(r.h).short+' '+r.hg+'–'+r.ag+' '+club(r.a).short+'</span><span class="muted">'+(r.note||"")+'</span></div>').join(""):'<p class="muted tiny">No matches yet.</p>';
  return '<div class="card"><div class="kicker">Next</div><h3 style="margin-top:6px">'+(nxt?club(nxt.game.h).name+' vs '+club(nxt.game.a).name:"Free week")+'</h3><p class="muted tiny">'+(nxt?("Matchday "+nxt.md):"Trophy lift pending.")+'</p></div><div class="card" style="margin-top:8px"><div class="kicker">Recent</div>'+recent+'</div>';
}
function panelSquad(){
  const ids=new Set(xi(S.career.squad,S.career.form).map(p=>p.id));
  const rows=S.career.squad.slice().sort((a,b)=>b.oa-a.oa).map(p=>'<div class="row tiny" style="margin-top:7px"><span>'+(ids.has(p.id)?"●":"○")+' '+p.name+' <span class="muted">'+p.pos+'</span></span><b>'+p.oa+'</b></div>').join("");
  return '<div class="card"><div class="kicker">First XI · '+S.career.form+'</div>'+rows+'</div>';
}
function panelTactics(){
  const fo=["4-3-3","4-2-3-1","3-5-2"].map(f=>'<option '+(S.career.form===f?"selected":"")+'>'+f+'</option>').join("");
  const me=["defensive","balanced","attacking"].map(f=>'<option '+(S.career.mentality===f?"selected":"")+'>'+f+'</option>').join("");
  return '<div class="card stack"><label class="tiny muted">Formation</label><select id="form">'+fo+'</select><label class="tiny muted">Mentality</label><select id="ment">'+me+'</select><p class="muted tiny">Attacking creates more highlights and more chaos at both ends.</p></div>';
}
function panelFix(){
  const md=S.career.fixtures.find(x=>x.md===S.career.week)||S.career.fixtures[0];
  const rows=md.games.map(g=>{
    const mine=g.h===S.career.clubId||g.a===S.career.clubId;
    const sc=g.played?(g.hg+'–'+g.ag):"vs";
    return '<div class="row tiny '+(mine?"you":"")+'" style="margin-top:8px"><span>'+club(g.h).short+'</span><b>'+sc+'</b><span>'+club(g.a).short+'</span></div>';
  }).join("");
  return '<div class="card"><div class="kicker">Matchday '+md.md+'</div>'+rows+'</div>';
}
function panelTable(){
  const rows=standings(S.career.table).map((r,i)=>'<tr class="'+(r.id===S.career.clubId?"you":"")+'"><td>'+(i+1)+'</td><td>'+r.short+'</td><td>'+r.p+'</td><td>'+r.gd+'</td><td>'+r.pts+'</td></tr>').join("");
  return '<div class="card"><table><thead><tr><th>#</th><th>Club</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>'+rows+'</tbody></table><p class="muted tiny" style="margin-top:8px">1–4 CL · 5 EL · 6 ECL · 18–20 down.</p></div>';
}
function panelInbox(){
  return S.career.inbox.slice().reverse().map(m=>'<div class="card" style="margin-bottom:8px"><div class="kicker">'+m.t+'</div><p class="tiny" style="margin:8px 0 0">'+m.b+'</p></div>').join("");
}
function viewPre(){
  const g=S.match.game, h=club(g.h), a=club(g.a);
  return shell('<button class="btn ghost" id="back">← Hub</button><div class="hero"><div class="kicker">Matchday '+S.match.md+'</div><h2>'+h.short+' vs '+a.short+'</h2><p class="lead">Watch the 2D engine, jump to highlights only, or instant result.</p><div class="stack"><button class="btn primary" id="watch">Watch match</button><button class="btn" id="hls">Highlights only</button><button class="btn" id="skip">Instant result</button></div></div>');
}
function viewMatch(){
  const m=S.match, h=club(m.res.home), a=club(m.res.away);
  return shell('<div class="score"><div><div class="tiny muted">'+h.short+'</div><b id="hs">'+m.hg+'</b></div><div class="tiny muted" id="clock">'+m.min+'\'</div><div style="text-align:right"><div class="tiny muted">'+a.short+'</div><b id="as">'+m.ag+'</b></div></div><canvas id="pitch" width="720" height="420"></canvas><p class="tiny" id="line" style="min-height:2.4em;margin:10px 0">'+(m.line||"Kick-off.")+'</p><div class="row"><button class="btn" id="pause">'+(m.paused?"Resume":"Pause")+'</button><button class="btn" id="tohl">Skip to highlights</button></div>');
}
function viewHL(){
  const m=S.match, h=club(m.res.home), a=club(m.res.away);
  const clips=(m.res.highlights.length?m.res.highlights:[{txt:"A grim, eventless night. One for the purists."}]).map(c=>'<div class="hl tiny">'+c.txt+'</div>').join("");
  return shell('<div class="kicker">Highlights</div><h2 style="margin:6px 0 10px">'+h.short+' '+m.res.hg+'–'+m.res.ag+' '+a.short+'</h2><canvas id="pitch" width="720" height="280"></canvas><div id="clips" style="margin-top:12px">'+clips+'</div><p class="muted tiny">xG '+m.res.hxg+' – '+m.res.axg+'</p><button class="btn primary" id="done" style="margin-top:12px;width:100%">Continue</button>');
}
function viewQuickPick(){
  const opts=CLUBS.map(c=>'<option value="'+c.id+'" '+(c.id==="TOT"?"selected":"")+'>'+c.name+'</option>').join("");
  const optsA=CLUBS.map(c=>'<option value="'+c.id+'" '+(c.id==="ARS"?"selected":"")+'>'+c.name+'</option>').join("");
  return shell('<button class="btn ghost" id="back">← Back</button><h2>Quick match</h2><p class="muted tiny">Pick home and away.</p><div class="grid" style="margin-top:12px"><select id="h">'+opts+'</select><select id="a">'+optsA+'</select></div><button class="btn primary" id="go" style="margin-top:12px;width:100%">Kick off</button>');
}
function viewLab(){
  const lab=S.lab||{n:200,h:"TOT",a:"ARS",out:null}; S.lab=lab;
  const oh=CLUBS.map(c=>'<option value="'+c.id+'" '+(c.id===lab.h?"selected":"")+'>'+c.short+'</option>').join("");
  const oa=CLUBS.map(c=>'<option value="'+c.id+'" '+(c.id===lab.a?"selected":"")+'>'+c.short+'</option>').join("");
  const on=[100,200,500,1000].map(n=>'<option '+(n===lab.n?"selected":"")+'>'+n+'</option>').join("");
  return shell('<button class="btn ghost" id="back">← Back</button><h2>Engine lab</h2><p class="lead" style="text-align:left">Headless batch. Same seeded match engine as career.</p><div class="grid"><select id="h">'+oh+'</select><select id="a">'+oa+'</select></div><div class="row" style="margin:10px 0"><span class="tiny muted">Matches</span><select id="n">'+on+'</select></div><button class="btn primary" id="run">Run batch</button><div id="out" style="margin-top:12px">'+(lab.out||"")+'</div>');
}
