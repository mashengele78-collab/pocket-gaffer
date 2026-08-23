const KEY="pg-fix-20260823";
const CLUBS=[
  ["ARS","Arsenal","Arsenal",90,88,87,"#ef0107"],
  ["MCI","Manchester City","Man City",88,90,84,"#6cabdd"],
  ["LIV","Liverpool","Liverpool",86,84,82,"#c8102e"],
  ["MUN","Manchester United","Man United",83,81,78,"#da291c"],
  ["CHE","Chelsea","Chelsea",82,81,80,"#034694"],
  ["AVL","Aston Villa","Aston Villa",80,79,78,"#95bfe5"],
  ["NEW","Newcastle United","Newcastle",80,78,79,"#241f20"],
  ["BHA","Brighton","Brighton",79,80,76,"#0057b8"],
  ["BRE","Brentford","Brentford",78,76,74,"#e30613"],
  ["BOU","Bournemouth","Bournemouth",76,75,73,"#da291c"],
  ["FUL","Fulham","Fulham",75,74,74,"#cccccc"],
  ["EVE","Everton","Everton",74,73,75,"#003399"],
  ["CRY","Crystal Palace","Palace",73,74,73,"#1b458f"],
  ["LEE","Leeds United","Leeds",74,72,71,"#ffcd00"],
  ["NFO","Nott'm Forest","Forest",72,71,72,"#dd0000"],
  ["TOT","Tottenham","Spurs",76,74,70,"#132257"],
  ["SUN","Sunderland","Sunderland",70,70,71,"#eb172b"],
  ["IPS","Ipswich Town","Ipswich",70,69,69,"#0044aa"],
  ["HUL","Hull City","Hull",68,67,68,"#f5a12d"],
  ["COV","Coventry City","Coventry",67,66,66,"#77b3e4"]
].map(function(a){return {id:a[0],name:a[1],short:a[2],atk:a[3],mid:a[4],def:a[5],col:a[6]};});
const STARS={
  TOT:["Vicario","Romero","Van de Ven","Porro","Udogie","Bentancur","Bergvall","Maddison","Kulusevski","Johnson","Solanke"],
  ARS:["Raya","Saliba","Gabriel","Timber","Calafiori","Rice","Zubimendi","Odegaard","Saka","Martinelli","Havertz"],
  MCI:["Donnarumma","Dias","Gvardiol","Walker","Ake","Rodri","Silva","Foden","Doku","Haaland","Marmoush"],
  LIV:["Alisson","Van Dijk","Konate","TAA","Robertson","Gravenberch","Mac Allister","Szoboszlai","Salah","Gakpo","Isak"],
  CHE:["Sanchez","Colwill","Fofana","James","Cucurella","Caicedo","Enzo","Palmer","Neto","Jackson","Nkunku"]
};
const FN=["Noah","Leo","Kai","Omar","Reece","Andre","Malik","Tyler","Hugo","Callum","Mateo","Jonas","Aaron","Ellis","Owen","Luca"];
const LN=["Hart","Ndiaye","Clarke","Bennett","Owens","Grant","Iversen","Kone","Fraser","Yates","Duffy","Peters","Brooks","Varga","Quinn"];
function club(id){for(var i=0;i<CLUBS.length;i++) if(CLUBS[i].id===id) return CLUBS[i]; return CLUBS[0];}
function rng(seed){var a=seed>>>0; return function(){a=Math.imul(a,1664525)+1013904223>>>0; return a/4294967296;};}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function ord(n){var v=n%100; if(v>10&&v<14) return "th"; var d=n%10; return d===1?"st":d===2?"nd":d===3?"rd":"th";}
var ST={view:"home", tab:"home", career:null, match:null};
function load(){try{var x=JSON.parse(localStorage.getItem(KEY)); return x&&x.clubId?x:null;}catch(e){return null;}}
function save(){try{if(ST.career) localStorage.setItem(KEY, JSON.stringify(ST.career));}catch(e){}}
function squadFor(id){
  var names=STARS[id]?STARS[id].slice():[];
  var pos=["GK","CB","CB","FB","FB","CM","CM","CM","WG","WG","ST","GK","CB","CM","WG","ST","FB","UT"];
  var c=club(id);
  return pos.map(function(p,i){
    var base=p==="GK"||p==="CB"||p==="FB"?c.def:(p==="ST"||p==="WG"?c.atk:c.mid);
    var name=names[i]||(FN[(i*3)%FN.length]+" "+LN[(i*5)%LN.length]);
    return {id:id+"-"+i, name:name, pos:p, oa:clamp(Math.round(base-7+((i*17)%13)),60,93)};
  });
}
function emptyTable(){var t={}; CLUBS.forEach(function(c){t[c.id]={p:0,w:0,d:0,l:0,gf:0,ga:0,pts:0};}); return t;}
function makeFixtures(){
  var teams=CLUBS.map(function(c){return c.id;});
  var rounds=[], n=teams.length, half=n/2, arr=teams.slice();
  for(var rd=0;rd<n-1;rd++){
    var games=[];
    for(var i=0;i<half;i++){
      var h=arr[i], a=arr[n-1-i];
      games.push(rd%2?{h:a,a:h}:{h:h,a:a});
    }
    arr.splice(1,0,arr.pop());
    rounds.push(games);
  }
  var all=rounds.concat(rounds.map(function(gs){return gs.map(function(g){return {h:g.a,a:g.h};});}));
  return all.map(function(gs,i){return {md:i+1, games:gs.map(function(g,j){return {h:g.h,a:g.a,played:false,hg:null,ag:null,id:i+"-"+j};})};});
}
function newCareer(id){
  return {clubId:id, week:1, form:"4-3-3", ment:"balanced", squad:squadFor(id), table:emptyTable(), fixtures:makeFixtures(), inbox:[{t:"Board", b:"Season 2026/27. Take "+club(id).name+" up the table. Europe is the brief."}], results:[]};
}
function tableRows(t){
  return CLUBS.map(function(c){var x=t[c.id]; return {id:c.id, short:c.short, p:x.p, w:x.w, d:x.d, l:x.l, gf:x.gf, ga:x.ga, gd:x.gf-x.ga, pts:x.pts};}).sort(function(a,b){return b.pts-a.pts || b.gd-a.gd || b.gf-a.gf || a.short.localeCompare(b.short);});
}
function applyRes(t,h,a,hg,ag){
  var H=t[h], A=t[a]; H.p++; A.p++; H.gf+=hg; H.ga+=ag; A.gf+=ag; A.ga+=hg;
  if(hg>ag){H.w++; H.pts+=3; A.l++;} else if(ag>hg){A.w++; A.pts+=3; H.l++;} else {H.d++; A.d++; H.pts++; A.pts++;}
}
function strength(c, ment, home){
  var s=(c.atk+c.mid+c.def)/3;
  if(ment==="attacking") s+=2.5; if(ment==="defensive") s-=1.2; if(home) s+=1.8; return s;
}
function simMatch(home, away, opt){
  opt=opt||{};
  var r=rng(opt.seed||(Date.now()%1e9));
  var hs=strength(home, opt.hMent||"balanced", true);
  var as_=strength(away, opt.aMent||"balanced", false);
  var hxg=Math.max(0.3,(hs-as_)*0.045+1.42);
  var axg=Math.max(0.3,(as_-hs)*0.045+1.12);
  var events=[], clips=[], hg=0, ag=0;
  function add(min, side, kind, extra){
    var att=side==="H"?home:away, def=side==="H"?away:home, txt;
    if(kind==="goal") txt=min+"' GOAL - "+att.short+" through "+def.short+".";
    else if(kind==="save") txt=min+"' Big save. "+def.short+" stay alive.";
    else if(kind==="wood") txt=min+"' Off the woodwork, "+att.short+".";
    else if(kind==="card") txt=min+"' "+(extra==="red"?"RED card.":"Yellow card.");
    else txt=min+"' Half-chance for "+att.short+".";
    var ev={min:min,side:side,kind:kind,txt:txt};
    events.push(ev);
    if(kind==="goal"||kind==="save"||kind==="wood"||kind==="card") clips.push(ev);
  }
  for(var m=1;m<=90;m++){
    if(r()<0.12){
      var side=r()<hs/(hs+as_)?"H":"A";
      var x=side==="H"?hxg/11:axg/11;
      var roll=r();
      if(roll<x*0.36){ if(side==="H") hg++; else ag++; add(m,side,"goal"); }
      else if(roll<x*0.36+0.11) add(m,side,"save");
      else if(roll<x*0.36+0.16) add(m,side,"wood");
      else if(r()<0.07) add(m,side,"card", r()<0.1?"red":"yel");
      else add(m,side,"shot");
    }
    if(m===45) events.push({min:45,kind:"ht",txt:"Half-time."});
  }
  events.push({min:90,kind:"ft",txt:"FT "+home.short+" "+hg+"-"+ag+" "+away.short});
  return {hg:hg,ag:ag,events:events,clips:clips,hxg:+hxg.toFixed(2),axg:+axg.toFixed(2),home:home.id,away:away.id};
}
function nextGame(car){
  for(var i=0;i<car.fixtures.length;i++){
    var md=car.fixtures[i];
    for(var j=0;j<md.games.length;j++){
      var g=md.games[j];
      if(!g.played && (g.h===car.clubId || g.a===car.clubId)) return {md:md.md, game:g, pack:md};
    }
  }
  return null;
}
function simOthers(car, pack, skipId){
  pack.games.forEach(function(g){
    if(g.played || g.id===skipId) return;
    var res=simMatch(club(g.h), club(g.a), {seed:pack.md*97+g.id.length*13});
    g.played=true; g.hg=res.hg; g.ag=res.ag;
    applyRes(car.table,g.h,g.a,res.hg,res.ag);
  });
}
function go(v){ST.view=v; draw();}
function shell(inner, right){
  return '<div class="bar"><span>Pocket Gaffer · 26/27</span><span>'+(right||"Works offline")+'</span></div>'+inner;
}
