
let movies=[],current=null,rank="A";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let watched=JSON.parse(localStorage.getItem("movie.v4.watched")||"[]");
let wish=JSON.parse(localStorage.getItem("movie.v4.wish")||"[]");

const slotSets = [
 ["🍿","🎥","🎬"],["⭐","7","🎟️"],["🥤","👓","🎞️"],
 ["🎬","🍿","⭐"],["🎟️","🎞️","🎥"],["👓","7","🥤"],
 ["🎥","⭐","🍿"],["🎞️","🎬","🎟️"],["7","🥤","👓"]
];

fetch("movies.json")
 .then(r=>r.json())
 .then(d=>{movies=d;init()})
 .catch(()=>alert("movies.jsonを読み込めません。GitHub Pages上で開いてください。"));

function fill(el,a){el.innerHTML=a.map(x=>`<option value="${x}">${x}</option>`).join("")}
function init(){
 fill($("#category"),["すべて","ハリウッド映画","邦画","アニメ映画"]);
 fill($("#genre"),["すべて",...[...new Set(movies.flatMap(x=>x.genres))].sort()]);
 fill($("#service"),["すべて","Netflix","Disney+","Hulu","配信確認済み"]);
 render();
}
function filtered(){
 const c=$("#category").value,g=$("#genre").value,s=$("#service").value;
 return movies.filter(m =>
   (c==="すべて"||m.category===c) &&
   (g==="すべて"||m.genres.includes(g)) &&
   (s==="すべて"||(s==="配信確認済み"?m.verified:m.services.includes(s)))
 );
}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function setReel(el,set,mode=""){
 el.className="reel "+mode;
 el.querySelector(".reel-stack").innerHTML=
   `<div class="symbol">${set[0]}</div><div class="symbol main">${set[1]}</div><div class="symbol">${set[2]}</div>`;
}
function spin(){
 const pool=filtered();
 if(!pool.length){alert("この条件に合う作品がありません。条件を少し広げてください。");return}
 $("#result").classList.add("hidden");
 const reels=[$("#r1"),$("#r2"),$("#r3")];
 reels.forEach(r=>r.className="reel spinfast");
 let n=0;
 const timer=setInterval(()=>{
   reels.forEach((r,i)=>setReel(r,rnd(slotSets),n<10?"spinfast":n<18?"spinmed":"spinslow"));
   n++;
   if(n>23){
     clearInterval(timer);
     current=rnd(pool);
     const finals=[rnd(slotSets),rnd(slotSets),rnd(slotSets)];
     reels.forEach((r,i)=>setTimeout(()=>{
       setReel(r,finals[i],"");
       r.animate(
         [{transform:"translateY(-12px)",filter:"brightness(1.6)"},{transform:"translateY(3px)"},{transform:"translateY(0)",filter:"brightness(1)"}],
         {duration:240,easing:"steps(5)"}
       );
       if(i===2)setTimeout(()=>show(current),130);
     },120+i*250));
   }
 },60);
}
function show(m){
 $("#title").textContent=m.title;
 $("#categoryTag").textContent=m.category;
 $("#yearText").textContent=m.year ? `(${m.year})` : "";
 $("#tags").innerHTML=m.genres.map(x=>`<span class="tag">${x}</span>`).join("");
 $("#hook").textContent=makeSynopsis(m);
 $("#services").innerHTML=m.services.length
   ?m.services.map(x=>`<span class="service">${x} 配信確認</span>`).join("")
   :`<span class="unknown-service">配信先：未確認</span>`;
 $("#wish").textContent=wish.some(x=>x.title===m.title)?"★ 観たい済み":"☆ 観たい";
 $("#flavor").textContent=flavorText(m);
 drawPoster(m);
 $("#result").classList.remove("hidden");
 setTimeout(()=>$("#result").scrollIntoView({behavior:"smooth",block:"start"}),100);
}
function makeSynopsis(m){
 const g=m.genres;
 if(m.title.includes("ワイルド・スピード")) return "ストリートの速度と危険な駆け引き。車と仲間、犯罪が交差するハイスピード・アクション。";
 if(m.title.includes("シティーハンター")) return "都会の夜を舞台に、腕利きの始末屋が依頼と事件に挑む。軽快さと銃撃戦が同居するアクション。";
 if(m.title.includes("タイタニック")) return "巨大客船で出会った二人の恋と、歴史に残る運命の夜。壮大なスケールで描くラブストーリー。";
 if(g.includes("アクション")) return `勢いのあるアクションを軸に楽しめる『${m.title}』。テンポよく一本観たい夜の候補。`;
 if(g.includes("恋愛")) return `人と人の距離や気持ちの揺れを楽しみたい夜に。『${m.title}』で少し感情に浸る。`;
 if(g.includes("ホラー")) return `不穏な空気と緊張感を味わう一本。部屋を暗くして『${m.title}』の世界へ。`;
 if(g.includes("コメディ")) return `難しいことは抜きにして、気軽に楽しみたい夜向け。『${m.title}』でひと休み。`;
 if(g.includes("感動")) return `観終わったあとに余韻が残るタイプの一本。『${m.title}』をじっくり楽しむ夜に。`;
 return `${g[0]}を軸に楽しめる『${m.title}』。今日の気分に合えば、そのまま一本決めたい候補。`;
}
function flavorText(m){
 if(m.genres.includes("カー"))return "スピードが、夜を映画に変える——！";
 if(m.genres.includes("アクション"))return "今日は派手にいこう。ポップコーンを忘れずに。";
 if(m.genres.includes("恋愛"))return "エンドロールまで、少しだけ余韻に浸ろう。";
 if(m.genres.includes("ホラー"))return "電気を消すかどうかは、あなた次第。";
 if(m.genres.includes("コメディ"))return "難しいことは考えず、今日は笑おう。";
 if(m.genres.includes("感動"))return "いい映画の夜は、少しだけ長く残る。";
 return "映画は、選ぶ時間からもう始まってる。";
}

/* Original low-res pixel poster generator.
   No official poster assets are copied. */
function drawPoster(m){
 const host=$("#pixelPoster");host.innerHTML="";
 const c=document.createElement("canvas");c.width=92;c.height=132;host.appendChild(c);
 const x=c.getContext("2d");x.imageSmoothingEnabled=false;
 const p=m.poster||{kind:"drama",sky:"#182231",mid:"#774552",road:"#15131a",accent:"#e9c56b"};
 // base
 x.fillStyle=p.sky;x.fillRect(0,0,92,132);
 x.fillStyle=p.mid;x.fillRect(0,48,92,84);
 x.fillStyle=p.road;x.fillRect(0,91,92,41);

 // horizon glow
 x.fillStyle=p.accent;x.fillRect(0,69,92,2);
 x.globalAlpha=.45;x.fillRect(0,65,92,2);x.globalAlpha=1;

 // stars/lights
 for(let i=0;i<22;i++){
   const px=(i*19+m.id*5)%89,py=(i*13+m.id*3)%46;
   x.fillStyle=i%3===0?"#fff0a6":p.accent;x.fillRect(px,py,1+(i%2),1+(i%2));
 }

 // skyline
 x.fillStyle="#10131c";
 for(let i=0;i<15;i++){
   const bx=i*7-2,w=4+(i%3),h=8+((i*11+m.id)%31);
   x.fillRect(bx,92-h,w,h);
   x.fillStyle=p.accent;
   for(let yy=96-h;yy<89;yy+=7)x.fillRect(bx+1,yy,1,2);
   x.fillStyle="#10131c";
 }

 drawTitleMotif(x,m,p);

 // title banner
 x.fillStyle="#080912e8";x.fillRect(7,8,78,24);
 x.strokeStyle=p.accent;x.lineWidth=1;x.strokeRect(8,9,76,22);
 x.fillStyle="#fff0c9";x.textAlign="center";x.font="bold 5px monospace";
 const chunks=fitTitle(m.title,14);
 x.fillText(chunks[0],46,19);
 if(chunks[1])x.fillText(chunks[1],46,25);
 x.fillStyle=p.accent;x.font="bold 4px monospace";x.fillText(m.genres[0],46,30);

 // perforations
 x.fillStyle="#09080a";
 for(let yy=5;yy<128;yy+=10){x.fillRect(1,yy,3,5);x.fillRect(88,yy,3,5)}
}
function fitTitle(t,n){
 if(t.length<=n)return[t];
 let a=t.slice(0,n),b=t.slice(n,n*2);
 return[a,b.length?b+"":""];
}
function drawTitleMotif(x,m,p){
 const t=m.title,g=m.genres;
 // recognizable but generic silhouettes/motifs
 if(t.includes("シティーハンター")){
   x.fillStyle="#171219";x.fillRect(39,71,14,30);x.fillRect(34,80,24,7);
   x.fillStyle=p.accent;x.fillRect(43,66,6,6);
   x.fillStyle="#222";x.fillRect(54,80,18,3);x.fillRect(70,79,8,5);
   return;
 }
 if(t.includes("タイタニック")){
   x.fillStyle="#e7d8b2";x.fillRect(12,83,67,8);x.fillRect(26,72,39,12);
   x.fillStyle="#16161c";x.fillRect(37,61,4,14);x.fillRect(49,61,4,14);
   x.fillStyle="#7c1521";x.fillRect(37,58,4,5);x.fillRect(49,58,4,5);
   return;
 }
 if(t.includes("ハリー・ポッター")){
   x.fillStyle="#15121a";x.fillRect(42,62,8,35);x.fillRect(31,74,30,5);
   x.fillStyle=p.accent;x.fillRect(45,56,2,7);x.fillRect(47,53,2,5);x.fillRect(49,50,2,4);
   return;
 }
 if(g.includes("カー")){
   x.fillStyle="#181820";x.fillRect(12,82,68,10);x.fillRect(23,74,45,10);
   x.fillStyle=p.accent;x.fillRect(17,83,6,3);x.fillRect(69,83,6,3);
   x.fillStyle="#06070a";x.fillRect(20,89,11,9);x.fillRect(62,89,11,9);
   x.fillStyle="#69a7d4";x.fillRect(30,76,13,5);x.fillRect(48,76,13,5);
   return;
 }
 if(g.includes("怪獣")){
   x.fillStyle="#12151a";x.fillRect(31,57,30,46);x.fillRect(22,71,13,25);x.fillRect(58,68,14,28);
   x.fillStyle=p.accent;x.fillRect(39,65,4,3);x.fillRect(51,65,4,3);
   for(let i=0;i<5;i++)x.fillRect(30+i*7,54-i%2*5,5,8);
   return;
 }
 if(g.includes("ヒーロー")){
   x.fillStyle="#14151d";x.fillRect(38,57,16,42);x.fillRect(27,72,38,8);
   x.fillStyle=p.accent;x.fillRect(43,63,6,16);x.fillRect(40,72,12,4);
   return;
 }
 if(g.includes("宇宙")||g.includes("SF")){
   x.fillStyle="#dbe8ef";x.fillRect(41,59,10,26);x.fillRect(35,68,22,7);
   x.fillStyle=p.accent;x.fillRect(44,85,4,12);
   x.fillStyle="#11131b";x.fillRect(15,80,13,3);x.fillRect(65,72,10,3);
   return;
 }
 if(g.includes("恋愛")){
   x.fillStyle="#1d1720";x.fillRect(29,72,11,27);x.fillRect(53,72,11,27);
   x.fillStyle=p.accent;x.fillRect(37,65,8,8);x.fillRect(46,65,8,8);x.fillRect(40,72,11,9);
   return;
 }
 if(g.includes("戦争")||g.includes("歴史")){
   x.fillStyle="#151310";x.fillRect(43,55,5,46);x.fillRect(27,62,37,4);
   x.fillStyle=p.accent;x.fillRect(24,96,45,4);
   return;
 }
 if(g.includes("スポーツ")){
   x.fillStyle="#10141a";x.fillRect(23,73,46,22);x.fillStyle=p.accent;x.fillRect(31,79,30,10);
   x.fillStyle="#f0e0b7";x.fillRect(42,59,8,12);
   return;
 }
 if(g.includes("ホラー")){
   x.fillStyle="#08070a";x.fillRect(27,60,38,39);x.fillStyle=p.accent;x.fillRect(35,71,6,4);x.fillRect(51,71,6,4);
   x.fillRect(43,84,6,3);return;
 }
 if(g.includes("音楽")){
   x.fillStyle=p.accent;x.fillRect(45,57,5,37);x.fillRect(50,57,19,5);x.fillRect(64,61,5,27);
   x.fillRect(34,89,12,8);x.fillRect(59,84,12,8);return;
 }
 // generic cinema silhouette
 x.fillStyle="#14131a";x.fillRect(20,76,52,21);x.fillRect(30,67,32,10);
 x.fillStyle=p.accent;x.fillRect(38,73,16,4);
}

function saveAll(){
 localStorage.setItem("movie.v4.watched",JSON.stringify(watched));
 localStorage.setItem("movie.v4.wish",JSON.stringify(wish));
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

function openReview(m){
 if(!m)return;current=m;rank="A";$("#reviewTitle").textContent=`「${m.title}」の評価`;$("#memo").value="";
 $$(".ranks button").forEach(b=>b.classList.toggle("active",b.textContent==="A"));
 $("#modal").classList.remove("hidden")
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

function switchTab(id,btn){
 $$(".screen").forEach(x=>x.classList.remove("active"));
 $("#"+id).classList.add("active");
 $$(".nav-btn").forEach(x=>x.classList.remove("active"));
 if(btn)btn.classList.add("active");
 window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-btn").forEach(b=>b.onclick=()=>{
 if(b.id==="genreNav"){
   switchTab("home",b);
   setTimeout(()=>$("#filterArea").scrollIntoView({behavior:"smooth",block:"center"}),80);
 }else switchTab(b.dataset.tab,b);
});
$("#clearData").onclick=()=>{
 if(confirm("視聴履歴と観たいリストをすべて削除しますか？")){
   watched=[];wish=[];saveAll();
 }
};
