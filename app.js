(function () {
  var KEY = "pg-live-20260823";
  var CLUBS = [
    ["ARS", "Arsenal", "Arsenal", 90, 88, 87, "#ef0107"],
    ["MCI", "Manchester City", "Man City", 88, 90, 84, "#6cabdd"],
    ["LIV", "Liverpool", "Liverpool", 86, 84, 82, "#c8102e"],
    ["MUN", "Manchester United", "Man United", 83, 81, 78, "#da291c"],
    ["CHE", "Chelsea", "Chelsea", 82, 81, 80, "#034694"],
    ["AVL", "Aston Villa", "Aston Villa", 80, 79, 78, "#95bfe5"],
    ["NEW", "Newcastle United", "Newcastle", 80, 78, 79, "#241f20"],
    ["BHA", "Brighton", "Brighton", 79, 80, 76, "#0057b8"],
    ["BRE", "Brentford", "Brentford", 78, 76, 74, "#e30613"],
    ["BOU", "Bournemouth", "Bournemouth", 76, 75, 73, "#da291c"],
    ["FUL", "Fulham", "Fulham", 75, 74, 74, "#cccccc"],
    ["EVE", "Everton", "Everton", 74, 73, 75, "#003399"],
    ["CRY", "Crystal Palace", "Palace", 73, 74, 73, "#1b458f"],
    ["LEE", "Leeds United", "Leeds", 74, 72, 71, "#ffcd00"],
    ["NFO", "Nott'm Forest", "Forest", 72, 71, 72, "#dd0000"],
    ["TOT", "Tottenham", "Spurs", 76, 74, 70, "#132257"],
    ["SUN", "Sunderland", "Sunderland", 70, 70, 71, "#eb172b"],
    ["IPS", "Ipswich Town", "Ipswich", 70, 69, 69, "#0044aa"],
    ["HUL", "Hull City", "Hull", 68, 67, 68, "#f5a12d"],
    ["COV", "Coventry City", "Coventry", 67, 66, 66, "#77b3e4"]
  ].map(function (a) {
    return { id: a[0], name: a[1], short: a[2], atk: a[3], mid: a[4], def: a[5], col: a[6] };
  });
  var STARS = {
    TOT: ["Vicario", "Romero", "Van de Ven", "Porro", "Udogie", "Bentancur", "Bergvall", "Maddison", "Kulusevski", "Johnson", "Solanke", "Gray", "Spence", "Richarlison", "Odobert", "Danso", "Tel", "Kinsky"],
    ARS: ["Raya", "Saliba", "Gabriel", "Timber", "Calafiori", "Rice", "Zubimendi", "Odegaard", "Saka", "Martinelli", "Havertz", "Trossard", "White", "Merino", "Nwaneri", "Lewis-Skelly", "Kiwior", "Jesus"],
    MCI: ["Donnarumma", "Dias", "Gvardiol", "Walker", "Ake", "Rodri", "Silva", "Foden", "Doku", "Haaland", "Marmoush", "Akanji", "Nunes", "Savinho", "Reijnders", "Gonzalez", "Khusanov", "Grealish"],
    LIV: ["Alisson", "Van Dijk", "Konate", "TAA", "Robertson", "Gravenberch", "Mac Allister", "Szoboszlai", "Salah", "Gakpo", "Isak", "Jones", "Endo", "Diaz", "Bradley", "Chiesa", "Quansah", "Mamardashvili"],
    CHE: ["Sanchez", "Colwill", "Fofana", "James", "Cucurella", "Caicedo", "Enzo", "Palmer", "Neto", "Jackson", "Nkunku", "Madueke", "Chalobah", "Lavia", "Gittens", "Dewsbury-Hall", "Essugo", "Jorgensen"]
  };
  var FN = ["Noah", "Leo", "Kai", "Omar", "Reece", "Andre", "Malik", "Tyler", "Hugo", "Callum", "Mateo", "Jonas", "Aaron", "Ellis", "Owen", "Luca"];
  var LN = ["Hart", "Ndiaye", "Clarke", "Bennett", "Owens", "Grant", "Iversen", "Kone", "Fraser", "Yates", "Duffy", "Peters", "Brooks", "Varga", "Quinn", "Shah"];
  var ST = { view: "home", tab: "home", career: null, match: null, lab: null };
  function club(id) { for (var i = 0; i < CLUBS.length; i++) if (CLUBS[i].id === id) return CLUBS[i]; return CLUBS[0]; }
  function rng(seed) { var a = seed >>> 0; return function () { a = (Math.imul(a, 1664525) + 1013904223) >>> 0; return a / 4294967296; }; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function ord(n) { var v = n % 100; if (v > 10 && v < 14) return "th"; var d = n % 10; return d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th"; }
  function load() { try { var x = JSON.parse(localStorage.getItem(KEY)); return x && x.clubId ? x : null; } catch (e) { return null; } }
  function persist() { try { if (ST.career) localStorage.setItem(KEY, JSON.stringify(ST.career)); } catch (e) {} }
  function squadFor(id) {
    var names = (STARS[id] || []).slice();
    var pos = ["GK", "CB", "CB", "FB", "FB", "CM", "CM", "CM", "WG", "WG", "ST", "GK", "CB", "CM", "WG", "ST", "FB", "UT"];
    var c = club(id);
    return pos.map(function (p, i) {
      var base = p === "GK" || p === "CB" || p === "FB" ? c.def : (p === "ST" || p === "WG" ? c.atk : c.mid);
      var name = names[i] || (FN[(i * 3) % FN.length] + " " + LN[(i * 5) % LN.length]);
      return { id: id + "-" + i, name: name, pos: p, oa: clamp(Math.round(base - 7 + ((i * 17) % 13)), 60, 93) };
    });
  }
  function emptyTable() { var t = {}; CLUBS.forEach(function (c) { t[c.id] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }; }); return t; }
  function makeFixtures() {
    var teams = CLUBS.map(function (c) { return c.id; });
    var rounds = [], n = teams.length, half = n / 2, arr = teams.slice(), rd, i, games, h, a;
    for (rd = 0; rd < n - 1; rd++) {
      games = [];
      for (i = 0; i < half; i++) { h = arr[i]; a = arr[n - 1 - i]; games.push(rd % 2 ? { h: a, a: h } : { h: h, a: a }); }
      arr.splice(1, 0, arr.pop());
      rounds.push(games);
    }
    var all = rounds.concat(rounds.map(function (gs) { return gs.map(function (g) { return { h: g.a, a: g.h }; }); }));
    return all.map(function (gs, idx) {
      return { md: idx + 1, games: gs.map(function (g, j) { return { h: g.h, a: g.a, played: false, hg: null, ag: null, id: idx + "-" + j }; }) };
    });
  }
  function newCareer(id) {
    return { clubId: id, week: 1, form: "4-3-3", ment: "balanced", squad: squadFor(id), table: emptyTable(), fixtures: makeFixtures(), inbox: [{ t: "Board", b: "Season 2026/27. Take " + club(id).name + " up the table. Europe is the brief." }], results: [] };
  }
  function tableRows(t) {
    return CLUBS.map(function (c) { var x = t[c.id]; return { id: c.id, short: c.short, p: x.p, w: x.w, d: x.d, l: x.l, gf: x.gf, ga: x.ga, gd: x.gf - x.ga, pts: x.pts }; }).sort(function (a, b) { return b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.short.localeCompare(b.short); });
  }
  function applyRes(t, h, a, hg, ag) {
    var H = t[h], A = t[a]; H.p++; A.p++; H.gf += hg; H.ga += ag; A.gf += ag; A.ga += hg;
    if (hg > ag) { H.w++; H.pts += 3; A.l++; } else if (ag > hg) { A.w++; A.pts += 3; H.l++; } else { H.d++; A.d++; H.pts++; A.pts++; }
  }
  function strength(c, ment, home) {
    var s = (c.atk + c.mid + c.def) / 3;
    if (ment === "attacking") s += 2.5; if (ment === "defensive") s -= 1.2; if (home) s += 1.8; return s;
  }
  function simMatch(home, away, opt) {
    opt = opt || {};
    var r = rng(opt.seed || (Date.now() % 1e9));
    var hs = strength(home, opt.hMent || "balanced", true);
    var as_ = strength(away, opt.aMent || "balanced", false);
    var hxg = Math.max(0.3, (hs - as_) * 0.045 + 1.42);
    var axg = Math.max(0.3, (as_ - hs) * 0.045 + 1.12);
    var events = [], clips = [], hg = 0, ag = 0, m, side, x, roll;
    function add(min, side, kind, extra) {
      var att = side === "H" ? home : away, def = side === "H" ? away : home, txt;
      if (kind === "goal") txt = min + "' GOAL - " + att.short + " cut through " + def.short + ".";
      else if (kind === "save") txt = min + "' Huge save. " + def.short + " stay in it.";
      else if (kind === "wood") txt = min + "' Off the woodwork for " + att.short + ".";
      else if (kind === "card") txt = min + "' " + (extra === "red" ? "RED card." : "Yellow card.");
      else txt = min + "' Half-chance for " + att.short + ".";
      var ev = { min: min, side: side, kind: kind, txt: txt };
      events.push(ev);
      if (kind === "goal" || kind === "save" || kind === "wood" || kind === "card") clips.push(ev);
    }
    for (m = 1; m <= 90; m++) {
      if (r() < 0.12) {
        side = r() < hs / (hs + as_) ? "H" : "A";
        x = side === "H" ? hxg / 11 : axg / 11;
        roll = r();
        if (roll < x * 0.36) { if (side === "H") hg++; else ag++; add(m, side, "goal"); }
        else if (roll < x * 0.36 + 0.11) add(m, side, "save");
        else if (roll < x * 0.36 + 0.16) add(m, side, "wood");
        else if (r() < 0.07) add(m, side, "card", r() < 0.1 ? "red" : "yel");
        else add(m, side, "shot");
      }
      if (m === 45) events.push({ min: 45, kind: "ht", txt: "Half-time." });
    }
    events.push({ min: 90, kind: "ft", txt: "FT " + home.short + " " + hg + "-" + ag + " " + away.short });
    return { hg: hg, ag: ag, events: events, clips: clips, hxg: +hxg.toFixed(2), axg: +axg.toFixed(2), home: home.id, away: away.id };
  }
  function nextGame(car) {
    var i, j, md, g;
    for (i = 0; i < car.fixtures.length; i++) {
      md = car.fixtures[i];
      for (j = 0; j < md.games.length; j++) {
        g = md.games[j];
        if (!g.played && (g.h === car.clubId || g.a === car.clubId)) return { md: md.md, game: g, pack: md };
      }
    }
    return null;
  }
  function simOthers(car, pack, skipId) {
    pack.games.forEach(function (g) {
      if (g.played || g.id === skipId) return;
      var res = simMatch(club(g.h), club(g.a), { seed: pack.md * 97 + g.id.length * 13 });
      g.played = true; g.hg = res.hg; g.ag = res.ag;
      applyRes(car.table, g.h, g.a, res.hg, res.ag);
    });
  }
  function shell(inner, right) { return '<div class="bar"><span>Pocket Gaffer \u00b7 26/27</span><span>' + (right || "Works offline") + "</span></div>" + inner; }
  function go(v) { ST.view = v; draw(); }
  function viewHome() {
    var s = load();
    return shell('<div class="hero"><div class="k">Football manager</div><h1>Pocket Gaffer</h1><p class="lead">2026/27 career. Watch the 2D match, jump to highlights, or skip. Saves stay on this phone.</p><div class="col"><button class="btn on" id="newc">New career</button><button class="btn" id="cont"' + (s ? "" : " disabled") + '>' + (s ? ("Continue \u00b7 " + club(s.clubId).short + " \u00b7 MD " + s.week) : "Continue") + '</button><button class="btn" id="qm">Quick match</button><button class="btn ghost" id="lab">Engine lab</button></div></div>');
  }
  function viewPick() {
    var list = CLUBS.map(function (c) { return '<button class="btn pick" data-id="' + c.id + '"><div class="row"><span>' + c.name + '</span><span class="mute s">' + c.atk + ' / ' + c.mid + ' / ' + c.def + '</span></div></button>'; }).join("");
    return shell('<button class="btn ghost" id="back">Back</button><h2 class="h">Choose your club</h2><p class="mute s">Premier League 2026/27 \u00b7 20 clubs</p><div class="col list">' + list + '</div>');
  }
  function viewHub() {
    var c = ST.career, me = club(c.clubId), nxt = nextGame(c), rows = tableRows(c.table), pos = 1, i;
    for (i = 0; i < rows.length; i++) if (rows[i].id === c.clubId) pos = i + 1;
    var rec = c.table[c.clubId];
    var tabs = ["home", "squad", "tactics", "fixtures", "table", "inbox"].map(function (t) { return '<button class="btn' + (ST.tab === t ? " on" : "") + '" data-t="' + t + '">' + t + '</button>'; }).join("");
    var play = nxt ? '<button class="btn on" id="play">Play next \u00b7 ' + club(nxt.game.h).short + ' vs ' + club(nxt.game.a).short + '</button>' : '<p class="mute">Season complete.</p>';
    return shell('<div class="row"><div><div class="k">' + me.name + '</div><h2>Gaffer</h2></div><button class="btn ghost" id="exit">Exit</button></div><div class="card pad"><div class="row"><span>League</span><b>' + pos + ord(pos) + ' \u00b7 ' + rec.pts + ' pts</b></div><div class="mute s sub">' + c.form + ' \u00b7 ' + c.ment + ' \u00b7 matchday ' + c.week + '</div></div><div class="tabs">' + tabs + '</div><div id="panel"></div><div class="play">' + play + '</div>', "Saved here");
  }
  function panel() {
    var c = ST.career;
    if (ST.tab === "squad") return '<div class="card">' + c.squad.map(function (p) { return '<div class="row s line"><span>' + p.name + ' <span class="mute">' + p.pos + '</span></span><b>' + p.oa + '</b></div>'; }).join("") + '</div>';
    if (ST.tab === "tactics") return '<div class="card col"><label class="mute s">Formation</label><select id="form">' + ["4-3-3", "4-2-3-1", "3-5-2"].map(function (f) { return '<option' + (c.form === f ? ' selected' : '') + '>' + f + '</option>'; }).join('') + '</select><label class="mute s">Mentality</label><select id="ment">' + ["defensive", "balanced", "attacking"].map(function (f) { return '<option' + (c.ment === f ? ' selected' : '') + '>' + f + '</option>'; }).join('') + '</select><p class="mute s">Attacking creates more chances and more chaos at both ends.</p></div>';
    if (ST.tab === "fixtures") {
      var md = c.fixtures[c.week - 1] || c.fixtures[0];
      return '<div class="card"><div class="k">Matchday ' + md.md + '</div>' + md.games.map(function (g) { var mine = g.h === c.clubId || g.a === c.clubId; var sc = g.played ? (g.hg + '-' + g.ag) : 'vs'; return '<div class="row s line' + (mine ? ' you' : '') + '"><span>' + club(g.h).short + '</span><b>' + sc + '</b><span>' + club(g.a).short + '</span></div>'; }).join('') + '</div>';
    }
    if (ST.tab === "table") {
      var rows = tableRows(c.table);
      return '<div class="card"><table><thead><tr><th>#</th><th>Club</th><th>P</th><th>GD</th><th>Pts</th></tr></thead><tbody>' + rows.map(function (r, i) { return '<tr class="' + (r.id === c.clubId ? 'you' : '') + '"><td>' + (i + 1) + '</td><td>' + r.short + '</td><td>' + r.p + '</td><td>' + r.gd + '</td><td>' + r.pts + '</td></tr>'; }).join('') + '</tbody></table><p class="mute s sub">1-4 CL \u00b7 5 EL \u00b7 6 Conference \u00b7 18-20 down.</p></div>';
    }
    if (ST.tab === "inbox") return c.inbox.slice().reverse().map(function (m) { return '<div class="card mail"><div class="k">' + m.t + '</div><p class="s body">' + m.b + '</p></div>'; }).join('');
    var nxt = nextGame(c), last = c.results.slice(-3).reverse();
    return '<div class="card"><div class="k">Next</div><h3 class="nx">' + (nxt ? club(nxt.game.h).name + ' vs ' + club(nxt.game.a).name : 'Free week') + '</h3><p class="mute s">' + (nxt ? ('Matchday ' + nxt.md) : 'Season done.') + '</p></div><div class="card later"><div class="k">Recent</div>' + (last.length ? last.map(function (r) { return '<div class="row s line"><span>' + club(r.h).short + ' ' + r.hg + '-' + r.ag + ' ' + club(r.a).short + '</span><span class="mute">' + r.note + '</span></div>'; }).join('') : '<p class="mute s">No matches yet.</p>') + '</div>';
  }
  function viewPre() {
    var g = ST.match.game, h = club(g.h), a = club(g.a);
    return shell('<button class="btn ghost" id="back">Back</button><div class="hero"><div class="k">Matchday ' + (ST.match.md || '-') + '</div><h2>' + h.short + ' vs ' + a.short + '</h2><p class="lead">Watch the pitch, jump to highlights, or take the instant result.</p><div class="col"><button class="btn on" id="watch">Watch match</button><button class="btn" id="hls">Highlights only</button><button class="btn" id="skip">Instant result</button></div></div>');
  }
  function viewMatch() {
    var m = ST.match, h = club(m.res.home), a = club(m.res.away);
    return shell('<div class="score"><div><div class="mute s">' + h.short + '</div><b id="hs">' + m.hg + '</b></div><div class="mute s" id="clock">' + m.min + ' min</div><div class="r"><div class="mute s">' + a.short + '</div><b id="as">' + m.ag + '</b></div></div><canvas id="pitch" width="720" height="400"></canvas><p class="s linebox" id="line">' + (m.line || 'Kick-off.') + '</p><div class="row"><button class="btn half" id="pause">' + (m.paused ? 'Resume' : 'Pause') + '</button><button class="btn half" id="tohl">Skip to highlights</button></div>');
  }
  function viewHL() {
    var m = ST.match, h = club(m.res.home), a = club(m.res.away);
    var clips = m.res.clips.length ? m.res.clips : [{ txt: 'A grim, eventless night. One for the purists.' }];
    return shell('<div class="k">Highlights</div><h2 class="h">' + h.short + ' ' + m.res.hg + '-' + m.res.ag + ' ' + a.short + '</h2><canvas id="pitch" width="720" height="260"></canvas><div class="clips">' + clips.map(function (c) { return '<div class="hl">' + c.txt + '</div>'; }).join('') + '</div><p class="mute s">xG ' + m.res.hxg + ' - ' + m.res.axg + '</p><button class="btn on" id="done">Continue</button>');
  }
  function viewQuick() {
    var opts = CLUBS.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('');
    return shell('<button class="btn ghost" id="back">Back</button><h2>Quick match</h2><p class="mute s">Home and away.</p><div class="col gap"><select id="h">' + opts.replace('value="TOT"', 'value="TOT" selected') + '</select><select id="a">' + opts.replace('value="ARS"', 'value="ARS" selected') + '</select><button class="btn on" id="go">Kick off</button></div>');
  }
  function viewLab() {
    var lab = ST.lab || { n: 200, h: 'TOT', a: 'ARS', out: '' }; ST.lab = lab;
    var oh = CLUBS.map(function (c) { return '<option value="' + c.id + '"' + (c.id === lab.h ? ' selected' : '') + '>' + c.short + '</option>'; }).join('');
    var oa = CLUBS.map(function (c) { return '<option value="' + c.id + '"' + (c.id === lab.a ? ' selected' : '') + '>' + c.short + '</option>'; }).join('');
    return shell('<button class="btn ghost" id="back">Back</button><h2>Engine lab</h2><p class="lead left">Same seeded match engine as career, run in a batch.</p><div class="col"><select id="h">' + oh + '</select><select id="a">' + oa + '</select><select id="n">' + [100, 200, 500, 1000].map(function (n) { return '<option' + (n === lab.n ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select><button class="btn on" id="run">Run batch</button></div><div id="out" class="out">' + (lab.out || '') + '</div>');
  }
  function paintPitch(m) {
    var c = document.getElementById('pitch'); if (!c) return;
    var ctx = c.getContext('2d'), w = c.width, h = c.height, t = m && m.min ? m.min : 0;
    ctx.fillStyle = '#1a3a2c'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(200,215,197,.38)'; ctx.lineWidth = 2;
    ctx.strokeRect(14, 14, w - 28, h - 28);
    ctx.beginPath(); ctx.moveTo(w / 2, 14); ctx.lineTo(w / 2, h - 14); ctx.stroke();
    ctx.beginPath(); ctx.arc(w / 2, h / 2, 36, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeRect(14, h * 0.28, 70, h * 0.44);
    ctx.strokeRect(w - 84, h * 0.28, 70, h * 0.44);
    function dots(col, left) {
      var spots = left ? [[0.08, 0.5], [0.22, 0.22], [0.22, 0.78], [0.28, 0.4], [0.28, 0.6], [0.42, 0.18], [0.42, 0.5], [0.42, 0.82], [0.56, 0.34], [0.56, 0.66], [0.68, 0.5]] : [[0.92, 0.5], [0.78, 0.22], [0.78, 0.78], [0.72, 0.4], [0.72, 0.6], [0.58, 0.18], [0.58, 0.5], [0.58, 0.82], [0.44, 0.34], [0.44, 0.66], [0.32, 0.5]];
      ctx.fillStyle = (col === '#ffffff' || col === '#cccccc') ? '#d8d8d8' : col;
      spots.forEach(function (p, i) { ctx.beginPath(); ctx.arc(p[0] * w + Math.sin(t * 0.34 + i) * 7, p[1] * h + Math.cos(t * 0.27 + i * 1.2) * 5, 6, 0, Math.PI * 2); ctx.fill(); });
    }
    var H = m && m.res ? club(m.res.home) : club('TOT');
    var A = m && m.res ? club(m.res.away) : club('ARS');
    dots(H.col, true); dots(A.col, false);
  }
  var raf = 0, acc = 0, last = 0;
  function tick() {
    cancelAnimationFrame(raf); last = 0; acc = 0;
    function loop(ts) {
      var m = ST.match; if (!m || ST.view !== 'match') return;
      if (!m.paused) {
        if (!last) last = ts; acc += ts - last; last = ts;
        while (acc > 85 && m.min < 90) {
          acc -= 85; m.min += 1;
          m.res.events.forEach(function (e) {
            if (e.min === m.min) { if (e.kind === 'goal') { if (e.side === 'H') m.hg += 1; else m.ag += 1; } if (e.txt) m.line = e.txt; }
          });
          var hs = document.getElementById('hs');
          if (hs) { hs.textContent = m.hg; document.getElementById('as').textContent = m.ag; document.getElementById('clock').textContent = m.min + ' min'; document.getElementById('line').textContent = m.line; }
          paintPitch(m);
        }
        if (m.min >= 90) { go('hl'); return; }
      } else last = ts;
      paintPitch(m); raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }
  function kick(mode) {
    var m = ST.match, h = club(m.game.h), a = club(m.game.a);
    var opts = m.career ? { hMent: ST.career.ment, seed: 202627 + m.md * 19 + h.atk } : { seed: Date.now() % 1e9 };
    m.res = simMatch(h, a, opts); m.hg = 0; m.ag = 0; m.min = 0; m.paused = false; m.line = 'Kick-off.';
    if (mode === 'watch') { go('match'); tick(); } else go('hl');
  }
  function finish() {
    var m = ST.match;
    if (m && m.career && ST.career) {
      var g = m.game; g.played = true; g.hg = m.res.hg; g.ag = m.res.ag;
      applyRes(ST.career.table, g.h, g.a, m.res.hg, m.res.ag); simOthers(ST.career, m.pack, g.id);
      var you = ST.career.clubId === g.h ? m.res.hg - m.res.ag : m.res.ag - m.res.hg;
      var note = you > 0 ? 'Win' : you < 0 ? 'Loss' : 'Draw';
      ST.career.results.push({ h: g.h, a: g.a, hg: m.res.hg, ag: m.res.ag, note: note });
      ST.career.inbox.push({ t: 'After match', b: club(g.h).short + ' ' + m.res.hg + '-' + m.res.ag + ' ' + club(g.a).short + '. ' + note + '. xG ' + m.res.hxg + '-' + m.res.axg + '.' });
      var rows = tableRows(ST.career.table), pos = 1, i;
      for (i = 0; i < rows.length; i++) if (rows[i].id === ST.career.clubId) pos = i + 1;
      var euro = pos <= 4 ? 'Champions League places.' : pos === 5 ? 'Europa League place.' : pos === 6 ? 'Conference League place.' : pos >= 18 ? 'Relegation heat.' : 'Mid-table grind.';
      ST.career.inbox.push({ t: 'League desk', b: 'You sit ' + pos + ord(pos) + ' after matchday ' + m.md + '. ' + euro });
      ST.career.week = Math.min(38, m.md + 1); persist(); ST.tab = 'home'; go('hub');
    } else go('home');
  }
  function bind(root) {
    function on(id, fn) { var n = root.querySelector(id); if (n) n.onclick = fn; }
    if (ST.view === 'home') { on('#newc', function () { go('pick'); }); on('#cont', function () { var s = load(); if (s) { ST.career = s; ST.tab = 'home'; go('hub'); } }); on('#qm', function () { go('quick'); }); on('#lab', function () { go('lab'); }); }
    if (ST.view === 'pick') { on('#back', function () { go('home'); }); root.querySelectorAll('.pick').forEach(function (b) { b.onclick = function () { ST.career = newCareer(b.getAttribute('data-id')); persist(); ST.tab = 'home'; go('hub'); }; }); }
    if (ST.view === 'hub') {
      on('#exit', function () { go('home'); });
      root.querySelectorAll('.tabs .btn').forEach(function (b) { b.onclick = function () { ST.tab = b.getAttribute('data-t'); draw(); }; });
      on('#play', function () { var n = nextGame(ST.career); ST.match = { career: true, md: n.md, game: n.game, pack: n.pack }; go('pre'); });
      if (ST.tab === 'tactics') { var f = root.querySelector('#form'), ment = root.querySelector('#ment'); if (f) f.onchange = function (e) { ST.career.form = e.target.value; persist(); }; if (ment) ment.onchange = function (e) { ST.career.ment = e.target.value; persist(); }; }
    }
    if (ST.view === 'pre') { on('#back', function () { ST.match && ST.match.career ? go('hub') : go('home'); }); on('#watch', function () { kick('watch'); }); on('#hls', function () { kick('hls'); }); on('#skip', function () { kick('skip'); }); }
    if (ST.view === 'match') { on('#pause', function () { ST.match.paused = !ST.match.paused; draw(); if (ST.view === 'match') tick(); }); on('#tohl', function () { ST.match.min = 90; go('hl'); }); }
    if (ST.view === 'hl') { paintPitch(ST.match); on('#done', finish); }
    if (ST.view === 'quick') { on('#back', function () { go('home'); }); on('#go', function () { ST.match = { career: false, md: 0, game: { h: root.querySelector('#h').value, a: root.querySelector('#a').value, id: 'q' } }; go('pre'); }); }
    if (ST.view === 'lab') {
      on('#back', function () { go('home'); });
      on('#run', function () {
        var h = club(root.querySelector('#h').value), a = club(root.querySelector('#a').value), n = +root.querySelector('#n').value;
        var hw = 0, d = 0, aw = 0, hgf = 0, agf = 0, i, res;
        for (i = 0; i < n; i++) { res = simMatch(h, a, { seed: 1100 + i * 97 }); hgf += res.hg; agf += res.ag; if (res.hg > res.ag) hw++; else if (res.ag > res.hg) aw++; else d++; }
        ST.lab = { n: n, h: h.id, a: a.id, out: '<div class="card"><b>' + h.short + ' ' + hw + 'W ' + d + 'D ' + aw + 'L</b><p class="mute s">Avg ' + (hgf / n).toFixed(2) + '-' + (agf / n).toFixed(2) + ' over ' + n + ' games.</p></div>' };
        draw();
      });
    }
  }
  function draw() {
    var root = document.getElementById('root');
    try {
      if (ST.view === 'home') root.innerHTML = viewHome();
      else if (ST.view === 'pick') root.innerHTML = viewPick();
      else if (ST.view === 'hub') { root.innerHTML = viewHub(); document.getElementById('panel').innerHTML = panel(); }
      else if (ST.view === 'pre') root.innerHTML = viewPre();
      else if (ST.view === 'match') root.innerHTML = viewMatch();
      else if (ST.view === 'hl') root.innerHTML = viewHL();
      else if (ST.view === 'quick') root.innerHTML = viewQuick();
      else if (ST.view === 'lab') root.innerHTML = viewLab();
      bind(root);
    } catch (err) { root.innerHTML = '<p class="err">Reload the page. ' + err.message + '</p>'; }
  }
  if ('serviceWorker' in navigator) { navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).then(function (r) { r.update(); }); }
  draw();
})();
