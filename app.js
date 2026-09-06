
let movies=[],current=null,rank="A";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let watched=JSON.parse(localStorage.getItem("movie.v6.watched")||"[]");
let wish=JSON.parse(localStorage.getItem("movie.v6.wish")||"[]");

const reelSymbols=["🍿","🎥","⭐","7","🎟️","🥤","👓","🎬","🎞️"];

fetch("movies.json").then(r=>r.json()).then(d=>{movies=d;init()}).catch(()=>alert("movies.jsonを読み込めません。GitHub Pages上で開いてください。"));

function fill(el,a){el.innerHTML=a.map(x=>`<option value="${x}">${x}</option>`).join("")}
function init(){
  fill($("#category"),["すべて","ハリウッド映画","邦画","アニメ映画"]);
  fill($("#genre"),["すべて",...[...new Set(movies.flatMap(x=>x.genres))].sort()]);
  fill($("#service"),["すべて","Netflix","Disney+","Hulu","配信確認済み"]);
  ["category","genre","service"].forEach(id=>$("#"+id).addEventListener("change",updateFilterSummary));
  updateFilterSummary();render();
}
function filtered(){
  const c=$("#category").value,g=$("#genre").value,s=$("#service").value;
  return movies.filter(m=>(c==="すべて"||m.category===c)&&(g==="すべて"||m.genres.includes(g))&&(s==="すべて"||(s==="配信確認済み"?m.verified:m.services.includes(s))));
}
function updateFilterSummary(){$("#filterSummary").textContent=`現在の条件：${$("#category").value} / ${$("#genre").value} / ${$("#service").value} → ${movies.length?filtered().length:0}作品`}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}

function spin(){
  const pool=filtered();
  if(!pool.length){alert("この条件に合う作品がありません。ジャンル選択で条件を広げてください。");return}
  $("#dynamicResult").classList.add("hidden");
  $("#spinOverlay").classList.remove("hidden");
  const reels=[$("#mr1"),$("#mr2"),$("#mr3")];
  let n=0;
  reels.forEach(r=>r.classList.add("spinning"));
  const timer=setInterval(()=>{
    reels.forEach(r=>r.textContent=rnd(reelSymbols));
    if(++n>23){
      clearInterval(timer);current=rnd(pool);
      reels.forEach((r,i)=>setTimeout(()=>{r.classList.remove("spinning");r.textContent=rnd(reelSymbols);if(i===2)setTimeout(()=>{$("#spinOverlay").classList.add("hidden");show(current)},180)},120+i*220));
    }
  },65);
}
function show(m){
  $("#title").textContent=m.title;$("#yearText").textContent=m.year?`(${m.year})`:"";
  $("#tags").innerHTML=[...m.genres,m.category].map(x=>`<span class="tag">${x}</span>`).join("");
  $("#hook").textContent=makeSynopsis(m);$("#services").innerHTML=serviceHtml(m);
  $("#wish").textContent=wish.some(x=>x.title===m.title)?"★ 観たい済み":"☆ 観たい";
  $("#flavor").textContent=flavorText(m);drawPoster(m);$("#dynamicResult").classList.remove("hidden");
}
function serviceHtml(m){
  if(!m.services.length)return `<span class="unknown-service">配信先：未確認</span>`;
  return m.services.map(s=>{const cls=s==="Netflix"?"netflix":s==="Disney+"?"disney":"hulu";const mark=s==="Netflix"?"N":s==="Disney+"?"Disney+":"hulu";return `<div class="service-card"><div class="service-logo ${cls}">${mark}</div><div class="service-text"><b>${s}</b><span>配信中</span></div></div>`}).join("");
}
function makeSynopsis(m){
  const t=m.title,g=m.genres;
  if(t.includes("ワイルド・スピード"))return "ストリートレースで出会った、正反対の二人。スピードで繋がった絆が、やがて大きな運命を動かしていく。";
  if(t.includes("タイタニック"))return "巨大客船で出会った二人。短くも鮮烈な恋と、歴史に残る夜を壮大なスケールで描く。";
  if(t.includes("ハリー・ポッター"))return "魔法と秘密に満ちた学園で、少年たちの冒険が始まる。幻想的な世界へ一気に浸りたい夜に。";
  if(g.includes("アクション"))return `勢いと緊張感を楽しめる『${t}』。今日は派手な一本を観たい夜に。`;
  if(g.includes("恋愛"))return `人と人の距離や気持ちの揺れを描く『${t}』。少し感情に浸りたい夜に。`;
  if(g.includes("ホラー"))return `不穏な空気と緊張感を味わう『${t}』。部屋を暗くして観る一本。`;
  if(g.includes("コメディ"))return `気軽に笑って楽しめる『${t}』。難しいことは考えずに観たい日に。`;
  if(g.includes("感動"))return `観終わったあとまで余韻が残る『${t}』。じっくり一本観たい夜に。`;
  return `${g[0]}を軸に楽しめる『${t}』。今日の気分に合えば、そのまま一本決めたい候補。`;
}
function flavorText(m){
  if(m.genres.includes("カー"))return "スピードが、すべてを変えていく——！";
  if(m.genres.includes("アクション"))return "今日は派手にいこう。ポップコーンを忘れずに。";
  if(m.genres.includes("恋愛"))return "エンドロールまで、少しだけ余韻に浸ろう。";
  if(m.genres.includes("ホラー"))return "電気を消すかどうかは、あなた次第。";
  return "映画は、選ぶ時間からもう始まってる。";
}

/* richer poster canvas */
function drawPoster(m){
  const host=$("#pixelPoster");host.innerHTML="";
  const c=document.createElement("canvas");c.width=120;c.height=176;host.appendChild(c);
  const x=c.getContext("2d");x.imageSmoothingEnabled=false;
  const kind=(m.poster&&m.poster.kind)||"drama";
  const pals={car:["#162743","#ef6a2f","#151824","#ffd45c","#4cb1e5"],space:["#111630","#49316d","#141525","#8de3ff","#f2d36c"],horror:["#120a13","#56162b","#07070b","#d84a5d","#d5b36c"],romance:["#401a31","#e67579","#271421","#ffd6a7","#ff9eb4"],fantasy:["#172640","#674282","#14202b","#ffd460","#8bd8e7"],history:["#584934","#b26c3a","#2c2419","#e8c878","#a63b2c"],monster:["#152331","#702e30","#11151c","#f0cf58","#62c48b"],hero:["#112945","#a52335","#151923","#ffd75d","#54b7e8"],drama:["#1a2a42","#8b4656","#13151c","#e6c16a","#8bb7d1"]};
  const p=pals[kind]||pals.drama;
  x.fillStyle=p[0];x.fillRect(0,0,120,176);x.fillStyle=p[1];x.fillRect(0,62,120,114);x.fillStyle=p[2];x.fillRect(0,112,120,64);
  x.fillStyle=p[3];for(let i=0;i<26;i++)x.fillRect((i*23+m.id*7)%116,8+((i*17+m.id)%48),1+(i%2),1+(i%2));
  x.fillStyle=p[2];for(let i=0;i<18;i++){let bx=i*7-2,h=12+((i*13+m.id)%37);x.fillRect(bx,111-h,4+(i%3),h)}
  drawMotif(x,m,p);
  x.fillStyle="#080912e8";x.fillRect(8,8,104,28);x.strokeStyle=p[3];x.strokeRect(9,9,102,26);x.textAlign="center";x.fillStyle="#fff0c7";x.font="bold 7px monospace";
  const lines=m.title.length>15?[m.title.slice(0,15),m.title.slice(15,30)]:[m.title];
  x.fillText(lines[0],60,20);if(lines[1])x.fillText(lines[1],60,29);x.fillStyle=p[3];x.font="bold 4px monospace";x.fillText(m.genres[0],60,34);
  x.fillStyle="#07070a";for(let yy=5;yy<171;yy+=10){x.fillRect(1,yy,3,5);x.fillRect(116,yy,3,5)}
}
function drawMotif(x,m,p){
  const t=m.title,g=m.genres,d=p[2],hi=p[3],cool=p[4];
  if(t.includes("ワイルド・スピード")||g.includes("カー")){car(x,15,116,43,hi,cool);car(x,61,122,43,"#d8dce1","#dd4a52");return}
  if(t.includes("タイタニック")){x.fillStyle="#e3d6b3";x.fillRect(10,118,100,9);x.fillRect(25,104,69,15);x.fillStyle="#11131a";[33,48,63,78].forEach(v=>x.fillRect(v,91,4,15));return}
  if(t.includes("ハリー・ポッター")){x.fillStyle="#11131a";x.fillRect(24,100,72,26);[29,41,55,70,84].forEach((v,i)=>x.fillRect(v,75-i%2*7,8,27+i%2*7));x.fillStyle=hi;x.fillRect(72,52,2,19);return}
  if(g.includes("怪獣")){x.fillStyle="#101419";x.fillRect(39,76,43,54);x.fillRect(27,91,18,34);x.fillRect(78,88,17,37);return}
  if(g.includes("SF")){x.fillStyle="#dde8ed";x.fillRect(52,77,16,35);x.fillRect(45,88,30,8);x.fillStyle=hi;x.fillRect(58,112,4,18);return}
  if(g.includes("恋愛")){x.fillStyle="#15131a";x.fillRect(35,94,13,35);x.fillRect(72,94,13,35);x.fillStyle=hi;x.fillRect(51,77,8,8);x.fillRect(61,77,8,8);x.fillRect(55,84,10,10);return}
  x.fillStyle="#15131a";x.fillRect(27,101,20,31);x.fillRect(74,98,20,34);x.fillStyle=hi;x.fillRect(50,89,20,4);
}
function car(x,x0,y0,w,body,glass){x.fillStyle=body;x.fillRect(x0,y0,w,11);x.fillRect(x0+10,y0-9,w-20,10);x.fillStyle=glass;x.fillRect(x0+14,y0-7,10,5);x.fillRect(x0+w-24,y0-7,10,5);x.fillStyle="#07080b";x.fillRect(x0+6,y0+8,10,8);x.fillRect(x0+w-16,y0+8,10,8)}

function saveAll(){localStorage.setItem("movie.v6.watched",JSON.stringify(watched));localStorage.setItem("movie.v6.wish",JSON.stringify(wish));render()}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
  $("#wishCount").textContent=wish.length;$("#watchedCount").textContent=watched.length;
  $("#watchList").innerHTML=wish.length?wish.map((m,i)=>`<div class="card"><b>${esc(m.title)}</b><br><small>${esc(m.category)} / ${m.genres.map(esc).join("・")}</small><div class="card-actions"><button onclick="reviewWish(${i})">✓ 観た</button><button onclick="removeWish(${i})">削除</button></div></div>`).join(""):"<div class='card'>まだありません。</div>";
  $("#historyList").innerHTML=watched.length?watched.map(m=>`<div class="card"><b>${esc(m.title)}</b> <span class="tag">${m.rank}</span><br><small>${esc(m.category)} / ${esc(m.date)}</small>${m.memo?`<p>${esc(m.memo)}</p>`:""}</div>`).join(""):"<div class='card'>まだありません。</div>";
}
$("#spin").onclick=spin;$("#again").onclick=spin;
$("#wish").onclick=()=>{if(!current)return;wish.some(x=>x.title===current.title)?wish=wish.filter(x=>x.title!==current.title):wish.unshift(current);saveAll();show(current)};
$("#watched").onclick=()=>openReview(current);$("#applyFilters").onclick=()=>switchTab("home");
function openReview(m){if(!m)return;current=m;rank="A";$("#reviewTitle").textContent=`「${m.title}」の評価`;$("#memo").value="";$$(".ranks button").forEach(b=>b.classList.toggle("active",b.textContent==="A"));$("#modal").classList.remove("hidden")}
window.reviewWish=i=>openReview(wish[i]);window.removeWish=i=>{wish.splice(i,1);saveAll()};
$$(".ranks button").forEach(b=>b.onclick=()=>{rank=b.textContent;$$(".ranks button").forEach(x=>x.classList.toggle("active",x===b))});
$("#cancel").onclick=()=>$("#modal").classList.add("hidden");$("#save").onclick=()=>{watched=watched.filter(x=>x.title!==current.title);watched.unshift({...current,rank,memo:$("#memo").value.trim(),date:new Date().toLocaleDateString("ja-JP")});wish=wish.filter(x=>x.title!==current.title);$("#modal").classList.add("hidden");saveAll()};
function switchTab(id){$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+id).classList.add("active");window.scrollTo({top:0,behavior:"smooth"})}
$$(".hotspot[data-tab]").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
$("#clearData").onclick=()=>{if(confirm("視聴履歴と観たいリストをすべて削除しますか？")){watched=[];wish=[];saveAll()}};
