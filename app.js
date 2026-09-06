
let movies=[],current=null,rank="A";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let watched=JSON.parse(localStorage.getItem("movie.v5.watched")||"[]");
let wish=JSON.parse(localStorage.getItem("movie.v5.wish")||"[]");

const symbols=["popcorn","camera","clapper","star","seven","ticket","soda","glasses","chair","film"];

fetch("movies.json").then(r=>r.json()).then(d=>{movies=d;init()}).catch(()=>alert("movies.jsonを読み込めません。GitHub Pages上で開いてください。"));

function init(){
  fill($("#category"),["すべて","ハリウッド映画","邦画","アニメ映画"]);
  fill($("#genre"),["すべて",...[...new Set(movies.flatMap(x=>x.genres))].sort()]);
  fill($("#service"),["すべて","Netflix","Disney+","Hulu","配信確認済み"]);
  drawStaticSprites();
  drawIdleReels();
  updateFilterSummary();
  ["category","genre","service"].forEach(id=>$("#"+id).addEventListener("change",updateFilterSummary));
  render();
}
function fill(el,a){el.innerHTML=a.map(x=>`<option value="${x}">${x}</option>`).join("")}
function filtered(){
  const c=$("#category").value,g=$("#genre").value,s=$("#service").value;
  return movies.filter(m=>
    (c==="すべて"||m.category===c)&&
    (g==="すべて"||m.genres.includes(g))&&
    (s==="すべて"||(s==="配信確認済み"?m.verified:m.services.includes(s)))
  )
}
function updateFilterSummary(){
  const count=movies.length?filtered().length:0;
  $("#filterSummary").textContent=`現在の条件：${$("#category").value} / ${$("#genre").value} / ${$("#service").value}　→ ${count}作品`;
}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}

/* ---------- pixel sprites ---------- */
function px(ctx,x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function drawSprite(ctx,type,ox,oy,scale=1){
  ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
  const D="#18131b",K="#09070b",W="#f5e6bd",G="#f5c44f",R="#d22e43",R2="#8c1525",B="#3f9fd7",N="#dfe7e7",BR="#9c6321";
  if(type==="popcorn"){
    px(ctx,3,8,18,15,R);px(ctx,5,8,3,15,W);px(ctx,12,8,3,15,W);px(ctx,19,8,2,15,W);
    [[3,5],[7,3],[11,5],[15,3],[18,5],[6,7],[14,7]].forEach(([x,y])=>px(ctx,x,y,5,5,G));
  }else if(type==="camera"){
    px(ctx,2,9,18,12,D);px(ctx,5,5,11,5,D);px(ctx,20,11,7,8,D);px(ctx,7,11,7,7,"#242a35");
    px(ctx,5,1,7,7,"#343945");px(ctx,13,0,7,8,"#343945");px(ctx,7,3,2,2,N);px(ctx,15,2,2,2,N);
  }else if(type==="clapper"){
    px(ctx,3,10,22,13,D);px(ctx,2,5,24,6,W);
    for(let i=0;i<4;i++)px(ctx,3+i*6,5,3,6,D);
    px(ctx,6,14,15,2,"#343945");
  }else if(type==="star"){
    const pts=[[12,1],[15,8],[23,8],[17,13],[19,22],[12,17],[5,22],[7,13],[1,8],[9,8]];
    ctx.fillStyle=G;ctx.beginPath();ctx.moveTo(...pts[0]);pts.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.fill();
    ctx.strokeStyle=R2;ctx.lineWidth=2;ctx.stroke();
  }else if(type==="seven"){
    px(ctx,3,3,21,6,R);px(ctx,17,9,6,7,R);px(ctx,12,16,6,7,R);px(ctx,7,23,6,4,R);
    px(ctx,5,5,14,2,"#f05b67");
  }else if(type==="ticket"){
    px(ctx,2,6,25,14,"#d69a39");px(ctx,0,9,3,8,"#d69a39");px(ctx,26,9,3,8,"#d69a39");
    px(ctx,6,9,17,2,BR);px(ctx,6,16,17,2,BR);
  }else if(type==="soda"){
    px(ctx,6,7,14,17,R);px(ctx,8,7,3,17,W);px(ctx,15,7,3,17,W);px(ctx,5,5,16,4,W);
    px(ctx,16,0,3,8,R);px(ctx,18,0,6,3,R);
  }else if(type==="glasses"){
    px(ctx,2,8,11,8,W);px(ctx,16,8,11,8,W);px(ctx,13,10,3,3,W);px(ctx,4,10,7,4,B);px(ctx,18,10,7,4,R);
  }else if(type==="chair"){
    px(ctx,6,9,17,11,"#233448");px(ctx,8,4,13,7,"#2c4462");px(ctx,6,19,3,8,BR);px(ctx,20,19,3,8,BR);
  }else if(type==="film"){
    px(ctx,3,7,23,14,"#d5c39b");for(let i=0;i<5;i++){px(ctx,4+i*5,7,2,3,D);px(ctx,4+i*5,18,2,3,D)}
    px(ctx,8,10,14,8,"#efe0ba");
  }
  ctx.restore();
}
function drawReel(canvas,arr){
  const ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=false;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const ys=[8,62,116];
  arr.forEach((type,i)=>drawSprite(ctx,type,22,ys[i],1));
}
function drawIdleReels(){
  const sets=[["popcorn","camera","clapper"],["star","seven","ticket"],["soda","glasses","chair"]];
  $$(".reel-canvas").forEach((c,i)=>drawReel(c,sets[i]));
}
function randomSet(){return [rnd(symbols),rnd(symbols),rnd(symbols)]}
function drawStaticSprites(){
  const logo=$("#logoReel"),l=logo.getContext("2d");l.imageSmoothingEnabled=false;
  l.clearRect(0,0,26,26);px(l,2,2,22,22,"#d9d9cf");px(l,5,5,16,16,"#2a303b");
  [[7,7],[15,7],[7,15],[15,15]].forEach(([x,y])=>{l.beginPath();l.fillStyle="#08090c";l.arc(x,y,3,0,Math.PI*2);l.fill()});
  l.beginPath();l.fillStyle="#08090c";l.arc(13,13,2,0,Math.PI*2);l.fill();

  [$("#propPopcorn"),$("#mascotPop1"),$("#mascotPop2")].forEach(c=>{const x=c.getContext("2d");x.imageSmoothingEnabled=false;drawSprite(x,"popcorn",0,0,1)});
  const cc=$("#propClapper").getContext("2d");cc.imageSmoothingEnabled=false;drawSprite(cc,"clapper",2,2,1.1);
}

/* ---------- spin ---------- */
function spin(){
  const pool=filtered();
  if(!pool.length){alert("この条件に合う作品がありません。ジャンル選択から条件を少し広げてください。");return}
  $("#result").classList.add("hidden");
  const reels=[$("#r1"),$("#r2"),$("#r3")];
  let n=0;
  reels.forEach(r=>r.className="reel spinfast");
  const timer=setInterval(()=>{
    reels.forEach((r,i)=>{
      drawReel(r.querySelector("canvas"),randomSet());
      r.className="reel "+(n<11?"spinfast":n<18?"spinmed":"spinslow");
    });
    if(++n>24){
      clearInterval(timer);
      current=rnd(pool);
      const finals=[randomSet(),randomSet(),randomSet()];
      reels.forEach((r,i)=>setTimeout(()=>{
        r.className="reel";
        drawReel(r.querySelector("canvas"),finals[i]);
        r.animate(
          [{transform:"translateY(-9px)",filter:"brightness(1.55)"},{transform:"translateY(2px)"},{transform:"translateY(0)",filter:"brightness(1)"}],
          {duration:230,easing:"steps(5)"}
        );
        if(i===2)setTimeout(()=>show(current),120);
      },120+i*235));
    }
  },58);
}
function show(m){
  $("#title").textContent=m.title;
  $("#yearText").textContent=m.year?`(${m.year})`:"";
  $("#tags").innerHTML=[...m.genres,m.category].map(x=>`<span class="tag">${x}</span>`).join("");
  $("#hook").textContent=makeSynopsis(m);
  $("#services").innerHTML=serviceHtml(m);
  $("#wish").textContent=wish.some(x=>x.title===m.title)?"★ 観たい済み":"☆ 観たい";
  $("#flavor").textContent=flavorText(m);
  drawPoster(m);
  $("#result").classList.remove("hidden");
  setTimeout(()=>$("#result").scrollIntoView({behavior:"smooth",block:"start"}),80);
}
function serviceHtml(m){
  if(!m.services.length)return `<span class="unknown-service">配信先：未確認</span>`;
  return m.services.map(s=>{
    const cls=s==="Netflix"?"netflix":s==="Disney+"?"disney":"hulu";
    const mark=s==="Netflix"?"N":s==="Disney+"?"Disney+": "hulu";
    return `<div class="service-card"><div class="service-logo ${cls}">${mark}</div><div class="service-text"><b>${s}</b><span>配信中</span></div></div>`;
  }).join("");
}
function makeSynopsis(m){
  const t=m.title,g=m.genres;
  if(t.includes("ワイルド・スピード"))return "ストリートレースで出会った、正反対の二人。スピードで繋がった絆が、やがて大きな運命を動かしていく。";
  if(t.includes("タイタニック"))return "巨大客船で出会った二人。短くも鮮烈な恋と、歴史に残る夜を壮大なスケールで描く。";
  if(t.includes("ハリー・ポッター"))return "魔法と秘密に満ちた学園で、少年たちの冒険が始まる。幻想的な世界へ一気に浸りたい夜に。";
  if(t.includes("アベンジャーズ"))return "それぞれ違う力と信念を持つヒーローたちが、世界規模の危機を前に集結する。";
  if(t.includes("ファイト・クラブ"))return "眠れない日々を送る男が、危険な思想を持つ男との出会いをきっかけに日常を壊していく。";
  if(t.includes("シティーハンター"))return "都会の夜を舞台に、腕利きの始末屋が依頼と事件に挑む。軽快さと銃撃戦が同居するアクション。";
  if(g.includes("アクション"))return `勢いと緊張感を楽しめる『${t}』。今日は派手な一本を観たい、そんな夜の候補。`;
  if(g.includes("恋愛"))return `人と人の距離や気持ちの揺れを描く『${t}』。少し感情に浸りたい夜に。`;
  if(g.includes("ホラー"))return `不穏な空気と緊張感を味わう『${t}』。部屋を暗くして観る一本。`;
  if(g.includes("コメディ"))return `気軽に笑って楽しめる『${t}』。難しいことは考えずに映画を観たい日に。`;
  if(g.includes("感動"))return `観終わったあとまで余韻が残る『${t}』。じっくり一本観たい夜に。`;
  return `${g[0]}を軸に楽しめる『${t}』。今日の気分に合えば、そのまま一本決めたい候補。`;
}
function flavorText(m){
  if(m.genres.includes("カー"))return "スピードが、すべてを変えていく——！";
  if(m.genres.includes("アクション"))return "今日は派手にいこう。ポップコーンを忘れずに。";
  if(m.genres.includes("恋愛"))return "エンドロールまで、少しだけ余韻に浸ろう。";
  if(m.genres.includes("ホラー"))return "電気を消すかどうかは、あなた次第。";
  if(m.genres.includes("コメディ"))return "難しいことは考えず、今日は笑おう。";
  if(m.genres.includes("感動"))return "いい映画の夜は、少しだけ長く残る。";
  return "映画は、選ぶ時間からもう始まってる。";
}

/* ---------- richer poster generator ---------- */
function drawPoster(m){
  const host=$("#pixelPoster");host.innerHTML="";
  const c=document.createElement("canvas");c.width=120;c.height=176;host.appendChild(c);
  const x=c.getContext("2d");x.imageSmoothingEnabled=false;
  const p=m.poster||{kind:"drama",sky:"#1c2d48",mid:"#d7653b",road:"#121827",accent:"#ffd15b"};

  // richer palette
  const palettes={
    car:["#152443","#f16b32","#171828","#ffd45a","#43a3df"],
    space:["#10152e","#482c6b","#171426","#8ce4ff","#f3d56a"],
    horror:["#110a13","#53152a","#08070b","#d8495b","#d2b36b"],
    romance:["#3b1830","#e56f78","#271322","#ffd5a8","#ff9db0"],
    fantasy:["#172640","#674282","#14202b","#ffd460","#8bd8e7"],
    history:["#594a35","#b26a37","#2e2419","#e9c978","#a53c2b"],
    sports:["#122c3d","#3b8675","#172628","#f4da62","#7dd7ff"],
    music:["#29163c","#9b427c","#17101f","#ffd55e","#75cfff"],
    monster:["#152331","#702e30","#11151c","#f0cf58","#62c48b"],
    hero:["#112945","#a52335","#151923","#ffd75d","#54b7e8"],
    mystery:["#17222d","#536271","#10151a","#e7c66d","#82b2ce"],
    comedy:["#29434f","#e98a3c","#1c2d35","#ffe26a","#73cef0"],
    drama:["#1a2a42","#8b4656","#13151c","#e6c16a","#8bb7d1"]
  };
  const pal=palettes[p.kind]||palettes.drama;
  // sky blocks
  x.fillStyle=pal[0];x.fillRect(0,0,120,176);
  x.fillStyle=pal[1];x.fillRect(0,63,120,113);
  // sunset stripes
  x.fillStyle=shade(pal[1],20);x.fillRect(0,58,120,13);
  x.fillStyle=shade(pal[1],35);x.fillRect(0,68,120,8);
  // stars/lights
  for(let i=0;i<30;i++){
    x.fillStyle=i%4===0?"#fff4ba":pal[3];
    x.fillRect((i*23+m.id*7)%116,6+((i*17+m.id*3)%49),1+(i%2),1+(i%2));
  }
  // moon/sun
  x.fillStyle=pal[3];x.fillRect(87,24,14,14);x.fillStyle=pal[0];x.fillRect(91,24,10,10);

  // skyline
  x.fillStyle=pal[2];
  for(let i=0;i<18;i++){
    const bx=i*7-2,w=4+(i%4),h=12+((i*13+m.id)%38);
    x.fillRect(bx,110-h,w,h);
    x.fillStyle=i%2?pal[3]:"#f7d493";
    for(let yy=114-h;yy<108;yy+=7){if((yy+i)%2===0)x.fillRect(bx+1,yy,1,2)}
    x.fillStyle=pal[2];
  }
  // horizon
  x.fillStyle=pal[3];x.fillRect(0,110,120,2);
  x.fillStyle=pal[2];x.fillRect(0,112,120,64);

  drawSpecificPoster(x,m,pal);

  // poster title
  x.fillStyle="rgba(5,7,13,.90)";x.fillRect(8,8,104,29);
  x.strokeStyle=pal[3];x.lineWidth=1;x.strokeRect(9,9,102,27);
  x.textAlign="center";x.fillStyle="#fff0c7";
  x.font="bold 7px monospace";
  const lines=splitTitle(m.title,15);
  x.fillText(lines[0],60,20);
  if(lines[1])x.fillText(lines[1],60,29);
  x.fillStyle=pal[3];x.font="bold 4px monospace";x.fillText(m.genres[0].toUpperCase(),60,35);

  // bottom glow / road
  x.fillStyle=shade(pal[1],-28);x.fillRect(0,151,120,25);
  x.fillStyle=pal[3];x.fillRect(56,154,8,2);x.fillRect(52,160,16,2);x.fillRect(47,168,26,3);

  // film perforations
  x.fillStyle="#08070a";
  for(let yy=5;yy<171;yy+=10){x.fillRect(1,yy,3,5);x.fillRect(116,yy,3,5)}
}
function shade(hex,amt){
  const h=hex.replace("#",""),n=parseInt(h,16);
  let r=(n>>16)+amt,g=((n>>8)&255)+amt,b=(n&255)+amt;
  r=Math.max(0,Math.min(255,r));g=Math.max(0,Math.min(255,g));b=Math.max(0,Math.min(255,b));
  return `rgb(${r},${g},${b})`;
}
function splitTitle(t,n){
  if(t.length<=n)return[t];
  let cut=n;
  for(let i=n;i>Math.max(6,n-5);i--){if(" ／・-".includes(t[i])){cut=i+1;break}}
  return[t.slice(0,cut),t.slice(cut,cut+n)];
}
function drawSpecificPoster(x,m,pal){
  const t=m.title,g=m.genres;
  const dark=pal[2],hi=pal[3],cool=pal[4];

  if(t.includes("ワイルド・スピード")){
    // twin cars, sunset palms, wet road
    x.fillStyle="#0d1320";
    x.fillRect(11,86,3,24);x.fillRect(7,83,11,3);x.fillRect(14,79,3,9); // palm
    x.fillRect(101,87,3,23);x.fillRect(95,84,11,3);x.fillRect(99,80,3,8);
    car(x,18,116,42,hi,cool);car(x,59,121,42,"#d9dce2","#d94b4f");
    x.fillStyle=hi;x.fillRect(8,150,46,3);x.fillStyle=cool;x.fillRect(67,151,40,2);
    return;
  }
  if(t.includes("タイタニック")){
    x.fillStyle="#e3d6b3";x.fillRect(10,118,100,9);x.fillRect(25,104,69,15);
    x.fillStyle="#11131a";x.fillRect(33,91,4,15);x.fillRect(48,91,4,15);x.fillRect(63,91,4,15);x.fillRect(78,91,4,15);
    x.fillStyle="#a22830";[33,48,63,78].forEach(v=>x.fillRect(v,88,4,5));
    x.fillStyle="#f5e3b4";for(let i=0;i<10;i++)x.fillRect(20+i*8,111,2,2);
    return;
  }
  if(t.includes("ハリー・ポッター")){
    // castle + wand lightning
    x.fillStyle="#11131a";x.fillRect(24,100,72,26);
    [29,41,55,70,84].forEach((v,i)=>{x.fillRect(v,75-i%2*7,8,27+i%2*7);x.beginPath();x.moveTo(v-2,75-i%2*7);x.lineTo(v+4,64-i%2*7);x.lineTo(v+10,75-i%2*7);x.fill()});
    x.fillStyle=hi;x.fillRect(72,52,2,19);x.fillRect(69,69,3,3);x.fillRect(65,72,4,3);
    return;
  }
  if(t.includes("アベンジャーズ")){
    // four hero silhouettes against skyline
    const xs=[25,44,64,84], hs=[36,43,39,46];
    xs.forEach((v,i)=>{x.fillStyle=i%2?cool:hi;x.fillRect(v,119-hs[i],8,hs[i]);x.fillRect(v-4,92,16,6);x.fillStyle=dark;x.fillRect(v+2,88-hs[i]/4,4,4)});
    x.fillStyle="#f3d85a";x.fillRect(57,74,6,14);x.fillRect(52,79,16,4);
    return;
  }
  if(t.includes("ファイト・クラブ")){
    x.fillStyle="#111117";x.fillRect(22,93,28,37);x.fillRect(69,91,28,39);
    x.fillStyle="#d15d65";x.fillRect(30,86,11,10);x.fillRect(76,84,11,10);
    x.fillStyle=hi;x.fillRect(50,101,20,4);x.fillRect(55,96,4,14);
    return;
  }
  if(t.includes("シティーハンター")){
    x.fillStyle="#11131a";x.fillRect(48,82,18,46);x.fillRect(43,92,28,7);
    x.fillStyle=hi;x.fillRect(54,75,7,8);
    x.fillStyle="#1b1c22";x.fillRect(66,95,32,4);x.fillRect(96,93,12,7);
    x.fillStyle=cool;x.fillRect(27,118,14,4);
    return;
  }
  if(t.includes("ゴジラ") || g.includes("怪獣")){
    x.fillStyle="#101419";x.fillRect(39,76,43,54);x.fillRect(27,91,18,34);x.fillRect(78,88,17,37);
    for(let i=0;i<6;i++)x.fillRect(40+i*7,70-(i%2)*5,6,10);
    x.fillStyle=hi;x.fillRect(50,87,4,3);x.fillRect(67,87,4,3);
    x.fillStyle="#dcddd7";x.fillRect(72,98,22,2);x.fillRect(89,96,12,2);
    return;
  }
  if(g.includes("カー")){car(x,20,113,78,hi,cool);return}
  if(g.includes("SF")){
    x.fillStyle="#dde8ed";x.fillRect(52,77,16,35);x.fillRect(45,88,30,8);
    x.fillStyle=hi;x.fillRect(58,112,4,18);x.fillStyle=cool;x.fillRect(26,96,22,3);x.fillRect(78,89,17,3);
    return;
  }
  if(g.includes("恋愛")){
    x.fillStyle="#15131a";x.fillRect(35,94,13,35);x.fillRect(72,94,13,35);
    x.fillStyle="#d3a177";x.fillRect(37,84,9,11);x.fillRect(74,84,9,11);
    x.fillStyle=hi;x.fillRect(51,77,8,8);x.fillRect(61,77,8,8);x.fillRect(55,84,10,10);
    return;
  }
  if(g.includes("戦争")||g.includes("歴史")){
    x.fillStyle="#16130e";x.fillRect(57,70,5,60);x.fillRect(37,79,45,4);x.fillRect(31,124,58,5);
    x.fillStyle=hi;x.fillRect(44,114,32,3);
    return;
  }
  if(g.includes("スポーツ")){
    x.fillStyle="#10151b";x.fillRect(24,104,72,28);x.fillStyle=hi;x.fillRect(38,112,44,12);x.fillStyle="#ede5cc";x.fillRect(55,81,10,18);
    return;
  }
  if(g.includes("ホラー")){
    x.fillStyle="#06070a";x.fillRect(34,78,52,53);x.fillStyle=hi;x.fillRect(45,94,8,5);x.fillRect(68,94,8,5);x.fillRect(57,112,8,4);
    return;
  }
  if(g.includes("音楽")){
    x.fillStyle=hi;x.fillRect(58,75,6,45);x.fillRect(64,75,27,6);x.fillRect(85,81,6,32);x.fillRect(42,112,16,11);x.fillRect(78,105,16,11);
    return;
  }
  // generic cinematic silhouettes
  x.fillStyle="#15131a";x.fillRect(27,101,20,31);x.fillRect(74,98,20,34);
  x.fillStyle=hi;x.fillRect(50,89,20,4);
}
function car(x,x0,y0,w,body,glass){
  x.fillStyle=body;x.fillRect(x0,y0,w,11);x.fillRect(x0+10,y0-9,w-20,10);
  x.fillStyle=glass;x.fillRect(x0+14,y0-7,10,5);x.fillRect(x0+w-24,y0-7,10,5);
  x.fillStyle="#07080b";x.fillRect(x0+6,y0+8,10,8);x.fillRect(x0+w-16,y0+8,10,8);
  x.fillStyle="#ffe779";x.fillRect(x0+1,y0+2,5,3);x.fillRect(x0+w-6,y0+2,5,3);
}

/* ---------- data ---------- */
function saveAll(){
  localStorage.setItem("movie.v5.watched",JSON.stringify(watched));
  localStorage.setItem("movie.v5.wish",JSON.stringify(wish));
  render();
}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
  $("#wishBadge").textContent=wish.length;
  $("#wishCount").textContent=wish.length;
  $("#watchedCount").textContent=watched.length;
  $("#watchList").innerHTML=wish.length?wish.map((m,i)=>`
    <div class="card"><b>${esc(m.title)}</b><br><small>${esc(m.category)} / ${m.genres.map(esc).join("・")}</small>
    <div class="card-actions"><button onclick="reviewWish(${i})">✓ 観た</button><button onclick="removeWish(${i})">削除</button></div></div>`).join(""):"<div class='card'>まだありません。</div>";
  $("#historyList").innerHTML=watched.length?watched.map(m=>`
    <div class="card"><b>${esc(m.title)}</b> <span class="tag">${m.rank}</span><br><small>${esc(m.category)} / ${esc(m.date)}</small>${m.memo?`<p>${esc(m.memo)}</p>`:""}</div>`).join(""):"<div class='card'>まだありません。</div>";
}

$("#spin").onclick=spin;$("#again").onclick=spin;
$("#wish").onclick=()=>{if(!current)return;wish.some(x=>x.title===current.title)?wish=wish.filter(x=>x.title!==current.title):wish.unshift(current);saveAll();show(current)};
$("#watched").onclick=()=>openReview(current);
$("#applyFilters").onclick=()=>{switchTab("home");setTimeout(()=>$("#spin").scrollIntoView({behavior:"smooth",block:"center"}),80)};

function openReview(m){
  if(!m)return;current=m;rank="A";$("#reviewTitle").textContent=`「${m.title}」の評価`;$("#memo").value="";
  $$(".ranks button").forEach(b=>b.classList.toggle("active",b.textContent==="A"));$("#modal").classList.remove("hidden")
}
window.reviewWish=i=>openReview(wish[i]);
window.removeWish=i=>{wish.splice(i,1);saveAll()};
$$(".ranks button").forEach(b=>b.onclick=()=>{rank=b.textContent;$$(".ranks button").forEach(x=>x.classList.toggle("active",x===b))});
$("#cancel").onclick=()=>$("#modal").classList.add("hidden");
$("#save").onclick=()=>{
  watched=watched.filter(x=>x.title!==current.title);
  watched.unshift({...current,rank,memo:$("#memo").value.trim(),date:new Date().toLocaleDateString("ja-JP")});
  wish=wish.filter(x=>x.title!==current.title);
  $("#modal").classList.add("hidden");saveAll()
};

function switchTab(id,btn=null){
  $$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");
  $$(".nav-btn").forEach(x=>x.classList.toggle("active",x.dataset.tab===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-btn").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab,b));
$("#clearData").onclick=()=>{if(confirm("視聴履歴と観たいリストをすべて削除しますか？")){watched=[];wish=[];saveAll()}};
