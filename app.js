
let movies=[],current=null,rank="A";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let watched=JSON.parse(localStorage.getItem("movie.v3.watched")||"[]");
let wish=JSON.parse(localStorage.getItem("movie.v3.wish")||"[]");

fetch("movies.json").then(r=>r.json()).then(d=>{movies=d;init()}).catch(()=>alert("movies.jsonを読み込めません。GitHub Pages上で開いてください。"));

function fill(el,a){el.innerHTML=a.map(x=>`<option value="${x}">${x}</option>`).join("")}
function init(){
  fill($("#category"),["すべて","ハリウッド映画","邦画","アニメ映画"]);
  fill($("#genre"),["すべて",...[...new Set(movies.flatMap(x=>x.genres))].sort()]);
  fill($("#service"),["すべて","Netflix","Disney+","Hulu","配信確認済み"]);
  render()
}
function filtered(){
  const c=$("#category").value,g=$("#genre").value,s=$("#service").value;
  return movies.filter(m =>
    (c==="すべて"||m.category===c) &&
    (g==="すべて"||m.genres.includes(g)) &&
    (s==="すべて"||(s==="配信確認済み"?m.verified:m.services.includes(s)))
  )
}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function spriteFor(m){
  const g=m.genres;
  if(g.includes("カー"))return "🏎️";
  if(g.includes("SF"))return "🚀";
  if(g.includes("ホラー"))return "👁️";
  if(g.includes("恋愛"))return "💌";
  if(g.includes("ファンタジー"))return "🔮";
  if(g.includes("戦争"))return "⚔️";
  if(g.includes("スポーツ"))return "🏆";
  if(g.includes("音楽"))return "🎵";
  if(g.includes("怪獣"))return "🦖";
  if(g.includes("ヒーロー"))return "⚡";
  if(g.includes("ミステリー"))return "🔍";
  if(g.includes("コメディ"))return "🍿";
  return m.category==="アニメ映画"?"✨":m.category==="邦画"?"🎬":"🎞️";
}
function reelText(el,m,mode){
  el.className="reel "+mode;
  el.querySelector(".strip").innerHTML=`<span class="slot-sprite">${spriteFor(m)}</span><b>${m.title}</b>`
}
function spin(){
  const p=filtered();
  if(!p.length)return alert("この条件に合う登録作品がありません。");
  $("#result").classList.add("hidden");
  const reels=[$("#r1"),$("#r2"),$("#r3")];
  let n=0;
  reels.forEach(r=>r.className="reel spinfast");
  const timer=setInterval(()=>{
    reels.forEach(r=>reelText(r,rnd(p),n<12?"spinfast":n<20?"spinmed":"spinslow"));
    n++;
    if(n>25){
      clearInterval(timer);
      current=rnd(p);
      [0,1,2].forEach((i)=>setTimeout(()=>{
        reelText(reels[i],current,"");
        reels[i].animate(
          [{transform:"translateY(-10px)",filter:"brightness(1.45)"},{transform:"translateY(0)",filter:"brightness(1)"}],
          {duration:180,easing:"steps(4)"}
        );
        if(i===2)show(current);
      },140+i*230))
    }
  },62)
}
function show(m){
  $("#title").textContent=m.title;
  $("#categoryTag").textContent=m.category;
  $("#hook").textContent=m.hook;
  $("#tags").innerHTML=m.genres.map(x=>`<span class="tag">${x}</span>`).join("");
  $("#services").innerHTML=m.services.length
    ?m.services.map(x=>`<span class="service">${x} ✓ 2026-09-06確認</span>`).join("")
    :`<span class="tag">配信先：未確認</span>`;
  $("#wish").textContent=wish.some(x=>x.title===m.title)?"★ 観たい済み":"☆ 観たい";
  $("#flavor").textContent=flavorText(m);
  drawPoster(m);
  $("#result").classList.remove("hidden")
}
function flavorText(m){
  if(m.genres.includes("アクション"))return "💥 派手にいきたい夜。今日はこれ。";
  if(m.genres.includes("恋愛"))return "💌 少し感情に浸りたい夜。";
  if(m.genres.includes("ホラー"))return "👁 部屋を暗くしてからどうぞ。";
  if(m.genres.includes("コメディ"))return "🍿 気軽に笑いたいならこれ。";
  if(m.genres.includes("感動"))return "🎞 エンドロールまで余韻を残す一本。";
  return "🎬 今夜は映画館モード。";
}

/* Original low-res canvas poster generator.
   It creates abstract genre/title motifs and does not copy official poster artwork. */
function drawPoster(m){
  const host=$("#pixelPoster");
  host.innerHTML="";
  const c=document.createElement("canvas");
  c.width=80;c.height=112;
  host.appendChild(c);
  const x=c.getContext("2d"); x.imageSmoothingEnabled=false;
  const p=m.poster||{kind:"drama",sky:"#182231",mid:"#774552",road:"#15131a",accent:"#e9c56b"};
  x.fillStyle=p.sky;x.fillRect(0,0,80,112);
  // pixel sunset / horizon
  x.fillStyle=p.mid;x.fillRect(0,45,80,67);
  x.fillStyle=p.road;x.fillRect(0,76,80,36);
  // skyline
  x.fillStyle="#15131a";
  for(let i=0;i<13;i++){let w=3+(i%4),h=7+((i*7)%24);x.fillRect(i*7,76-h,w,h)}
  // stars / lights
  x.fillStyle=p.accent;
  for(let i=0;i<18;i++){let px=(i*17+m.id*3)%78,py=(i*11+m.id)%42;x.fillRect(px,py,1+(i%2),1+(i%2))}
  // motif
  drawMotif(x,p.kind,p.accent,m.id);
  // title plaque
  x.fillStyle="rgba(8,7,10,.86)";x.fillRect(5,7,70,18);
  x.strokeStyle=p.accent;x.lineWidth=1;x.strokeRect(6,8,68,16);
  x.fillStyle="#fff0c9";x.font="bold 5px monospace";x.textAlign="center";
  let title=m.title.length>13?m.title.slice(0,13)+"…":m.title;
  x.fillText(title,40,18);
  x.fillStyle=p.accent;x.font="bold 4px monospace";x.fillText(m.genres[0],40,23);
  // film perforations
  x.fillStyle="#0a0808";
  for(let yy=4;yy<108;yy+=9){x.fillRect(1,yy,3,5);x.fillRect(76,yy,3,5)}
}
function drawMotif(x,k,a,id){
  x.fillStyle=a;
  if(k==="car"){
    x.fillRect(18,66,42,8);x.fillRect(26,60,26,7);x.fillStyle="#0b0b10";x.fillRect(22,72,8,8);x.fillRect(51,72,8,8);
    x.fillStyle="#f2d75d";x.fillRect(17,68,3,2);x.fillRect(60,68,3,2)
  }else if(k==="space"){
    x.fillStyle="#d9eefc";x.fillRect(34,51,12,19);x.fillRect(31,57,18,7);x.fillStyle=a;x.fillRect(37,70,6,9);
    x.fillStyle="#fff";x.fillRect(10,35,2,2);x.fillRect(62,29,2,2)
  }else if(k==="horror"){
    x.fillStyle="#050507";x.fillRect(23,52,34,27);x.fillStyle=a;x.fillRect(31,60,6,4);x.fillRect(44,60,6,4);x.fillRect(38,70,5,3)
  }else if(k==="romance"){
    x.fillRect(24,57,13,13);x.fillRect(43,57,13,13);x.fillRect(30,66,20,17);x.fillStyle="#fff0d0";x.fillRect(38,62,4,4)
  }else if(k==="fantasy"){
    x.fillRect(38,48,4,32);x.fillRect(28,61,24,4);x.fillStyle="#fff2bf";x.fillRect(39,46,2,3)
  }else if(k==="history"){
    x.fillRect(39,46,3,34);x.fillRect(30,50,22,3);x.fillStyle="#17120b";x.fillRect(20,74,40,5)
  }else if(k==="sports"){
    x.fillRect(24,55,32,18);x.fillStyle="#101218";x.fillRect(30,60,20,8);x.fillStyle=a;x.fillRect(37,48,6,8)
  }else if(k==="music"){
    x.fillRect(38,48,4,28);x.fillRect(42,48,15,4);x.fillRect(53,52,4,19);x.fillRect(30,72,12,8);x.fillRect(48,67,12,8)
  }else if(k==="monster"){
    x.fillStyle="#101315";x.fillRect(28,48,24,34);x.fillRect(22,60,10,17);x.fillRect(50,58,11,19);x.fillStyle=a;x.fillRect(34,55,3,3);x.fillRect(44,55,3,3)
  }else if(k==="hero"){
    x.fillRect(36,46,8,34);x.fillRect(28,58,24,5);x.fillStyle="#fff0c6";x.fillRect(39,51,2,9)
  }else if(k==="mystery"){
    x.strokeStyle=a;x.lineWidth=3;x.strokeRect(24,51,25,25);x.beginPath();x.moveTo(48,73);x.lineTo(61,85);x.stroke()
  }else if(k==="comedy"){
    x.fillRect(25,57,30,22);x.fillStyle="#121018";x.fillRect(31,63,4,4);x.fillRect(45,63,4,4);x.fillRect(33,72,15,3)
  }else{
    x.fillRect(20,61,40,15);x.fillStyle="#151219";x.fillRect(28,54,24,8)
  }
}
function saveAll(){
  localStorage.setItem("movie.v3.watched",JSON.stringify(watched));
  localStorage.setItem("movie.v3.wish",JSON.stringify(wish));render()
}
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){
  $("#stats").textContent=`${movies.length||300} TITLES / ${watched.length} WATCHED`;
  $("#watchList").innerHTML=wish.length?wish.map((m,i)=>`<div class="card"><b>${esc(m.title)}</b><br><small>${m.category} / ${m.genres.join("・")}</small><div class="actions"><button onclick="reviewWish(${i})">観た</button><button onclick="removeWish(${i})">削除</button></div></div>`).join(""):"<p>まだありません。</p>";
  $("#historyList").innerHTML=watched.length?watched.map(m=>`<div class="card"><b>${esc(m.title)}</b> <span class="tag">${m.rank}</span><br><small>${esc(m.category)} / ${esc(m.date)}</small>${m.memo?`<p>${esc(m.memo)}</p>`:""}</div>`).join(""):"<p>まだありません。</p>"
}
$("#spin").onclick=spin;$("#again").onclick=spin;
$("#wish").onclick=()=>{if(!current)return;wish.some(x=>x.title===current.title)?wish=wish.filter(x=>x.title!==current.title):wish.unshift(current);saveAll();show(current)};
$("#watched").onclick=()=>openReview(current);
function openReview(m){if(!m)return;current=m;rank="A";$("#reviewTitle").textContent=`「${m.title}」の評価`;$("#memo").value="";$$(".ranks button").forEach(b=>b.classList.toggle("active",b.textContent==="A"));$("#modal").classList.remove("hidden")}
window.reviewWish=i=>openReview(wish[i]);window.removeWish=i=>{wish.splice(i,1);saveAll()};
$$(".ranks button").forEach(b=>b.onclick=()=>{rank=b.textContent;$$(".ranks button").forEach(x=>x.classList.toggle("active",x===b))});
$("#cancel").onclick=()=>$("#modal").classList.add("hidden");
$("#save").onclick=()=>{watched=watched.filter(x=>x.title!==current.title);watched.unshift({...current,rank,memo:$("#memo").value.trim(),date:new Date().toLocaleDateString("ja-JP")});wish=wish.filter(x=>x.title!==current.title);$("#modal").classList.add("hidden");saveAll()};
$$("nav button").forEach(b=>b.onclick=()=>{$$("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".screen").forEach(x=>x.classList.remove("active"));$("#"+b.dataset.tab).classList.add("active")});
