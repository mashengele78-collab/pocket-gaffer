function viewHome(){
  var s=load();
  return shell(
    '<div class="hero"><div class="k">Football manager</div><h1 style="font-size:40px;margin-top:8px">Pocket Gaffer</h1>'+
    '<p class="lead">Pick a club. Play the match. Watch it, jump to highlights, or skip. Saves stay on this phone.</p>'+
    '<div class="col">'+
    '<button class="btn on" id="newc">New career</button>'+
    '<button class="btn" id="cont"'+(s?"":" disabled")+'>'+(s?("Continue \u00b7 "+club(s.clubId).short+" \u00b7 MD "+s.week):"Continue")+'</button>'+
    '<button class="btn" id="qm">Quick match</button>'+
    '<button class="btn ghost" id="lab">Engine lab</button>'+
    '</div></div>'
  );
}
function viewPick(){
  var list=CLUBS.map(function(c){
    return '<button class="btn pick" data-id="'+c.id+'"><div class="row"><span>'+c.name+'</span><span class="mute s">'+c.atk+' / '+c.mid+' / '+c.def+'</span></div></button>';
  }).join("");
  return shell('<button class="btn ghost" id="back">Back</button><h2 style="margin:8px 0 6px">Choose your club</h2><p class="mute s">Premier League 2026/27</p><div class="col" style="margin-top:12px">'+list+'</div>');
}
function viewHub(){
  var c=ST.career, me=club(c.clubId), nxt=nextGame(c);
  var rows=tableRows(c.table);
  var pos=1; for(var i=0;i<rows.length;i++) if(rows[i].id===c.clubId) pos=i+1;
  var rec=c.table[c.clubId];
  var tabs=["home","squad","tactics","fixtures","table","inbox"].map(function(t){
    return '<button class="btn'+(ST.tab===t?" on":"")+'" data-t="'+t+'">'+t+'</button>';
  }).join("");
  var play=nxt
    ? '<button class="btn on" id="play">Play next \u00b7 '+club(nxt.game.h).short+' vs '+club(nxt.game.a).short+'</button>'
    : '<p class="mute">Season complete.</p>';
  return shell(
    '<div class="row"><div><div class="k">'+me.name+'</div><h2>Gaffer</h2></div><button class="btn ghost" id="exit">Exit</button></div>'+
    '<div class="card" style="margin:12px 0"><div class="row"><span>League</span><b>'+pos+ord(pos)+' \u00b7 '+rec.pts+' pts</b></div>'+
    '<div class="mute s" style="margin-top:6px">'+c.form+' \u00b7 '+c.ment+' \u00b7 matchday '+c.week+'</div></div>'+
    '<div class="tabs">'+tabs+'</div><div id="panel"></div><div style="margin-top:14px">'+play+'</div>',
    "Saved here"
  );
}
function panel(){
  var c=ST.career;
  if(ST.tab==="squad"){
    return '<div class="card">'+c.squad.map(function(p){
      return '<div class="row s" style="margin-top:7px"><span>'+p.name+' <span class="mute">'+p.pos+'</span></span><b>'+p.oa+'</b></div>';
    }).join("")+'</div>';
  }
  if(ST.tab==="tactics"){
    return '<div class="card col"><label class="mute s">Formation</label><select id="form">'+
      ["4-3-3","4-2-3-1","3-5-2"].map(function(f){return '<option'+(c.form===f?" selected":"")+'>'+f+'</option>';}).join("")+
      '</select><label class="mute s">Mentality</label><select id="ment">'+
      ["defensive","balanced","attacking"].map(function(f){return '<option'+(c.ment===f?" selected":"")+'>'+f+'</option>';}).join("")+
      '</select><p class="mute s">Attacking creates more chances and more chaos.</p></div>';
  }
  if(ST.tab==="fixtures"){
    var md=c.fixtures[c.week-1]||c.fixtures[0];
    return '<div class="card"><div class="k">Matchday '+md.md+'</div>'+md.games.map(function(g){
      var mine=g.h===c.clubId||g.a===c.clubId;
      var sc=g.played?(g.hg+'-'+g.ag):"vs";
      return '<div class="row s'+(mine?" you":"")+'" style="margin-top:8px"><span>'+club(g.h).short+'</span><b>'+sc+'</b><span>'+club(g.a).short+'</span></div>';
    }).join("")+'</div>';
  }
  if(ST.tab==="table"){
    var rows=tableRows(c.table);
    return '<div class="card"><table><thead><tr><th>#</th><th>Club</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>'+
      rows.map(function(r,i){return '<tr class="'+(r.id===c.clubId?"you":"")+'"><td>'+(i+1)+'</td><td>'+r.short+'</td><td>'+r.p+'</td><td>'+r.gd+'</td><td>'+r.pts+'</td></tr>';}).join("")+
      '</tbody></table><p class="mute s" style="margin-top:8px">1-4 CL · 5 EL · 6 Conference · 18-20 down.</p></div>';
  }
  if(ST.tab==="inbox"){
    return c.inbox.slice().reverse().map(function(m){
      return '<div class="card" style="margin-bottom:8px"><div class="k">'+m.t+'</div><p class="s" style="margin:8px 0 0">'+m.b+'</p></div>';
    }).join("");
  }
  var nxt=nextGame(c);
  var last=c.results.slice(-3).reverse();
  return '<div class="card"><div class="k">Next</div><h3 style="margin-top:6px">'+(nxt?club(nxt.game.h).name+' vs '+club(nxt.game.a).name:"Free week")+'</h3>'+
    '<p class="mute s">'+(nxt?("Matchday "+nxt.md):"Season done.")+'</p></div>'+
    '<div class="card" style="margin-top:8px"><div class="k">Recent</div>'+
    (last.length?last.map(function(r){return '<div class="row s" style="margin-top:8px"><span>'+club(r.h).short+' '+r.hg+'-'+r.ag+' '+club(r.a).short+'</span><span class="mute">'+r.note+'</span></div>';}).join(""):'<p class="mute s">No matches yet.</p>')+
    '</div>';
}
function viewPre(){
  var g=ST.match.game, h=club(g.h), a=club(g.a);
  return shell(
    '<button class="btn ghost" id="back">Back</button><div class="hero"><div class="k">Matchday '+(ST.match.md||'-')+'</div>'+
    '<h2 style="margin-top:8px">'+h.short+' vs '+a.short+'</h2>'+
    '<p class="lead">Watch the pitch, jump to highlights, or take the instant result.</p>'+
    '<div class="col"><button class="btn on" id="watch">Watch match</button>'+
    '<button class="btn" id="hls">Highlights only</button>'+
    '<button class="btn" id="skip">Instant result</button></div></div>'
  );
}
function viewMatch(){
  var m=ST.match, h=club(m.res.home), a=club(m.res.away);
  return shell(
    '<div class="score"><div><div class="mute s">'+h.short+'</div><b id="hs">'+m.hg+'</b></div>'+
    '<div class="mute s" id="clock">'+m.min+' min</div>'+
    '<div style="text-align:right"><div class="mute s">'+a.short+'</div><b id="as">'+m.ag+'</b></div></div>'+
    '<canvas id="pitch" width="720" height="400"></canvas>'+
    '<p class="s" id="line" style="min-height:2.6em;margin:10px 0">'+(m.line||"Kick-off.")+'</p>'+
    '<div class="row"><button class="btn" id="pause" style="width:48%">'+(m.paused?"Resume":"Pause")+'</button>'+
    '<button class="btn" id="tohl" style="width:48%">Skip to highlights</button></div>'
  );
}
function viewHL(){
  var m=ST.match, h=club(m.res.home), a=club(m.res.away);
  var clips=m.res.clips.length?m.res.clips:[{txt:"A grim, eventless night. One for the purists."}];
  return shell(
    '<div class="k">Highlights</div><h2 style="margin:6px 0 10px">'+h.short+' '+m.res.hg+'-'+m.res.ag+' '+a.short+'</h2>'+
    '<canvas id="pitch" width="720" height="260"></canvas>'+
    '<div style="margin-top:10px">'+clips.map(function(c){return '<div class="hl">'+c.txt+'</div>';}).join("")+'</div>'+
    '<p class="mute s">xG '+m.res.hxg+' - '+m.res.axg+'</p>'+
    '<button class="btn on" id="done" style="margin-top:12px">Continue</button>'
  );
}
function viewQuick(){
  var opts=CLUBS.map(function(c){return '<option value="'+c.id+'">'+c.name+'</option>';}).join("");
  return shell(
    '<button class="btn ghost" id="back">Back</button><h2>Quick match</h2><p class="mute s">Home and away.</p>'+
    '<div class="col" style="margin-top:12px"><select id="h">'+opts.replace('value="TOT"','value="TOT" selected')+'</select>'+
    '<select id="a">'+opts.replace('value="ARS"','value="ARS" selected')+'</select>'+
    '<button class="btn on" id="go">Kick off</button></div>'
  );
}
function viewLab(){
  var lab=ST.lab||{n:200,h:"TOT",a:"ARS",out:""};
  ST.lab=lab;
  var oh=CLUBS.map(function(c){return '<option value="'+c.id+'"'+(c.id===lab.h?" selected":"")+'>'+c.short+'</option>';}).join("");
  var oa=CLUBS.map(function(c){return '<option value="'+c.id+'"'+(c.id===lab.a?" selected":"")+'>'+c.short+'</option>';}).join("");
  return shell(
    '<button class="btn ghost" id="back">Back</button><h2>Engine lab</h2>'+
    '<p class="lead" style="text-align:left">Same match engine, run in a batch.</p>'+
    '<div class="col"><select id="h">'+oh+'</select><select id="a">'+oa+'</select>'+
    '<select id="n">'+[100,200,500,1000].map(function(n){return '<option'+(n===lab.n?" selected":"")+'>'+n+'</option>';}).join("")+'</select>'+
    '<button class="btn on" id="run">Run batch</button></div><div id="out" style="margin-top:12px">'+(lab.out||"")+'</div>'
  );
}
