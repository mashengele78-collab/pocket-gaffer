const SAVE="pg-now-2026";
const VERSION="26/27 · 23 Aug 2026";
const CLUBS=[
  {id:"ARS",name:"Arsenal",short:"Arsenal",atk:90,mid:88,def:87,col:"#ef0107"},
  {id:"MCI",name:"Manchester City",short:"Man City",atk:88,mid:90,def:84,col:"#6cabdd"},
  {id:"LIV",name:"Liverpool",short:"Liverpool",atk:86,mid:84,def:82,col:"#c8102e"},
  {id:"MUN",name:"Manchester United",short:"Man United",atk:83,mid:81,def:78,col:"#da291c"},
  {id:"CHE",name:"Chelsea",short:"Chelsea",atk:82,mid:81,def:80,col:"#034694"},
  {id:"AVL",name:"Aston Villa",short:"Aston Villa",atk:80,mid:79,def:78,col:"#670e36"},
  {id:"NEW",name:"Newcastle United",short:"Newcastle",atk:80,mid:78,def:79,col:"#241f20"},
  {id:"BHA",name:"Brighton",short:"Brighton",atk:79,mid:80,def:76,col:"#0057b8"},
  {id:"BRE",name:"Brentford",short:"Brentford",atk:78,mid:76,def:74,col:"#e30613"},
  {id:"BOU",name:"Bournemouth",short:"Bournemouth",atk:76,mid:75,def:73,col:"#da291c"},
  {id:"FUL",name:"Fulham",short:"Fulham",atk:75,mid:74,def:74,col:"#ffffff"},
  {id:"EVE",name:"Everton",short:"Everton",atk:74,mid:73,def:75,col:"#003399"},
  {id:"CRY",name:"Crystal Palace",short:"Palace",atk:73,mid:74,def:73,col:"#1b458f"},
  {id:"LEE",name:"Leeds United",short:"Leeds",atk:74,mid:72,def:71,col:"#ffcd00"},
  {id:"NFO",name:"Nottingham Forest",short:"Forest",atk:72,mid:71,def:72,col:"#dd0000"},
  {id:"TOT",name:"Tottenham Hotspur",short:"Spurs",atk:76,mid:74,def:70,col:"#132257"},
  {id:"SUN",name:"Sunderland",short:"Sunderland",atk:70,mid:70,def:71,col:"#eb172b"},
  {id:"IPS",name:"Ipswich Town",short:"Ipswich",atk:70,mid:69,def:69,col:"#0044aa"},
  {id:"HUL",name:"Hull City",short:"Hull",atk:68,mid:67,def:68,col:"#f5a12d"},
  {id:"COV",name:"Coventry City",short:"Coventry",atk:67,mid:66,def:66,col:"#77b3e4"}
];
const NAMES={
  TOT:["Vicario","Romero","Van de Ven","Pedro Porro","Udogie","Bentancur","Bergvall","Maddison","Kulusevski","Johnson","Solanke","Gray","Spence","Richarlison","Odobert","Danso","Tel","Kinsky"],
  ARS:["Raya","Saliba","Gabriel","Timber","Calafiori","Rice","Zubimendi","Odegaard","Saka","Martinelli","Havertz","Trossard","White","Merino","Nwaneri","Lewis-Skelly","Kiwior","Jesus"],
  MCI:["Donnarumma","Dias","Gvardiol","Walker","Ake","Rodri","Silva","Foden","Doku","Haaland","Grealish","Akanji","Nunes","Savinho","Gonzalez","Khusanov","Reijnders","Marmoush"],
  LIV:["Alisson","Van Dijk","Konate","Alexander-Arnold","Robertson","Gravenberch","Mac Allister","Szoboszlai","Salah","Gakpo","Isak","Jones","Endo","Diaz","Quansah","Chiesa","Bradley","Mamardashvili"],
  CHE:["Sanchez","Colwill","Fofana","James","Cucurella","Caicedo","Fernandez","Palmer","Neto","Jackson","Nkunku","Madueke","Chalobah","Lavia","Dewsbury-Hall","Gittens","Essugo","Jorgensen"]
};
const FIRST=["Noah","Leo","Kai","Omar","Reece","Andre","Malik","Tyler","Hugo","Ibrahim","Callum","Mateo","Jonas","Aaron","Ellis","Samir","Owen","Luca"];
const LAST=["Hart","Ndiaye","Clarke","Bennett","Owens","Silva","Grant","Iversen","Kone","Fraser","Yates","Duffy","Moreau","Peters","Shah","Brooks","Varga","Quinn"];
