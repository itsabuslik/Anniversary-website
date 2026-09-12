const conversation=[
  {opening:"🔥🔥 ja měl 6 bodu z use of english, myslel jsem že přece jsem znalec a dopadnu dobře B)", reply:"Odkud víš :0? Minulý rok jo, to bylo dobře :3"},
  {reply:"And that was only the beginning."}
];

const monthData={
  april:{index:"01",title:"APRIL",description:"This page is for April — the beginning. Replace this with the real story, the first moments, the first photos and whatever still feels unreal.",line:"The first month always looks smaller from far away."},
  may:{index:"02",title:"MAY",description:"Use May for photos, screenshots, one message you still remember, and one place that started meaning more because she was there.",line:"A memory becomes a place when you return to it enough."},
  june:{index:"03",title:"JUNE",description:"Use June for something more experimental — a looping video, a tiny letter, a photo sequence, or one detail nobody else would understand.",line:"Some things only make sense to two people."},
  july:{index:"04",title:"JULY",description:"July can hold a larger memory. A trip, an evening, a long conversation, or the moment the relationship began to feel permanent.",line:"The ordinary days are the ones that stay."},
  august:{index:"05",title:"AUGUST",description:"August is perfect for summer footage, nature, travel, water, late evenings and anything that feels warm and slightly unreal.",line:"Summer remembers differently."},
  september:{index:"06",title:"SEPTEMBER",description:"September closes the six-month orbit. Make this the most emotional page, or let it point forward instead of ending.",line:"Six months is not an ending. It is a coordinate."}
};

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const chatIntro=$("#chatIntro"), chatBody=$("#chatBody"), messages=$("#messages"), typing=$("#typing"), form=$("#messageForm"), input=$("#messageInput"), sendButton=$("#sendButton");
const orbitScreen=$("#orbitScreen"), monthPage=$("#monthPage");
let step=0,busy=false,finished=false;

function currentTime(){return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});}
function addMessage(text,side,showAvatar=false){
  const row=document.createElement('div'); row.className=`message-row ${side}`;
  if(side==='them'&&showAvatar){const av=document.createElement('div'); av.className='mini-avatar'; row.appendChild(av);} 
  const wrap=document.createElement('div'); wrap.className='message-wrap';
  const bubble=document.createElement('div'); bubble.className='bubble'; bubble.textContent=text;
  const meta=document.createElement('div'); meta.className='message-meta'; meta.textContent=currentTime();
  wrap.append(bubble,meta); row.appendChild(wrap); messages.appendChild(row);
  requestAnimationFrame(()=>chatBody.scrollTo({top:chatBody.scrollHeight,behavior:'smooth'}));
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function sendPremadeReply(text){
  if(!text) return; busy=true; input.disabled=true; sendButton.disabled=true; typing.classList.remove('hidden');
  await sleep(Math.min(1550,640+text.length*9));
  typing.classList.add('hidden'); addMessage(text,'me'); input.disabled=false; sendButton.disabled=false; busy=false; input.focus();
}
function finishConversation(){
  finished=true; form.style.display='none';
  const btn=document.createElement('button'); btn.className='continue'; btn.textContent='ENTER MEMORY WELL';
  btn.addEventListener('click', enterMemoryWell); messages.appendChild(btn);
  requestAnimationFrame(()=>chatBody.scrollTo({top:chatBody.scrollHeight,behavior:'smooth'}));
}
form.addEventListener('submit', async e=>{
  e.preventDefault(); if(busy||finished) return; const text=input.value.trim(); if(!text) return;
  input.value=''; addMessage(text,'them',true); const current=conversation[step]; if(current?.reply) await sendPremadeReply(current.reply); step++; if(step>=conversation.length){await sleep(250); finishConversation();}
});
window.addEventListener('DOMContentLoaded', async ()=>{await sleep(350); if(conversation[0]?.opening) addMessage(conversation[0].opening,'me'); input.focus(); syncSoundButtons();});

// AUDIO
const audioState={enabled:true, unlocked:false, ctx:null, dragOsc:null, dragGain:null};
const sounds={
  ambientMain:new Audio('audio/ambient_main.mp3'),
  ambientNature:new Audio('audio/ambient_nature.mp3'),
  orbClick:new Audio('audio/orb_click.mp3'),
  enterWell:new Audio('audio/enter_well.mp3')
};
for(const a of Object.values(sounds)){a.preload='auto';}
sounds.ambientMain.loop=true; sounds.ambientNature.loop=true;

async function unlockAudio(){
  if(audioState.unlocked) return;
  try{
    audioState.ctx=new (window.AudioContext||window.webkitAudioContext)();
    audioState.dragOsc=audioState.ctx.createOscillator();
    audioState.dragGain=audioState.ctx.createGain();
    audioState.dragOsc.type='triangle';
    audioState.dragOsc.frequency.value=180;
    audioState.dragGain.gain.value=0;
    audioState.dragOsc.connect(audioState.dragGain).connect(audioState.ctx.destination);
    audioState.dragOsc.start();
    await audioState.ctx.resume();
  }catch(err){}
  for(const a of [sounds.ambientMain, sounds.ambientNature, sounds.orbClick, sounds.enterWell]){
    a.muted=!audioState.enabled;
  }
  audioState.unlocked=true;
}
function playOne(audio, volume=.4, reset=true){
  if(!audioState.enabled||!audioState.unlocked) return;
  if(reset) audio.currentTime=0;
  audio.volume=volume;
  audio.play().catch(()=>{});
}
function fadeAudio(audio, target, duration=900){
  const start=audio.volume||0, delta=target-start, t0=performance.now();
  function frame(now){
    const p=Math.min(1,(now-t0)/duration); audio.volume=start+delta*p; if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
async function startAmbience(){
  if(!audioState.enabled||!audioState.unlocked) return;
  sounds.ambientMain.volume=0; sounds.ambientNature.volume=0;
  sounds.ambientMain.play().catch(()=>{}); sounds.ambientNature.play().catch(()=>{});
  fadeAudio(sounds.ambientMain,0.18,1600); fadeAudio(sounds.ambientNature,0.08,1800);
}
function stopAmbience(){
  for(const a of [sounds.ambientMain,sounds.ambientNature]) a.pause();
}
function setDragTone(active, speed=0){
  if(!audioState.enabled||!audioState.unlocked||!audioState.ctx||!audioState.dragOsc||!audioState.dragGain) return;
  const now=audioState.ctx.currentTime;
  if(active){
    const freq=Math.max(120, Math.min(340, 130 + speed*8));
    audioState.dragOsc.frequency.cancelScheduledValues(now);
    audioState.dragOsc.frequency.linearRampToValueAtTime(freq, now+.05);
    audioState.dragGain.gain.cancelScheduledValues(now);
    audioState.dragGain.gain.linearRampToValueAtTime(.012, now+.05);
  }else{
    audioState.dragGain.gain.cancelScheduledValues(now);
    audioState.dragGain.gain.linearRampToValueAtTime(0, now+.08);
  }
}
function toggleSound(force){
  audioState.enabled = typeof force==='boolean' ? force : !audioState.enabled;
  for(const a of Object.values(sounds)) a.muted=!audioState.enabled;
  if(!audioState.enabled) setDragTone(false);
  syncSoundButtons();
}
function syncSoundButtons(){
  $$('#soundToggle, #soundToggleMonth').forEach(btn=>btn.textContent=audioState.enabled?'SOUND ON':'SOUND OFF');
}
$('#soundToggle').addEventListener('click', async()=>{await unlockAudio(); toggleSound(); if(audioState.enabled && !sounds.ambientMain.paused) {fadeAudio(sounds.ambientMain,0.18,400); fadeAudio(sounds.ambientNature,0.08,500);} });
$('#soundToggleMonth').addEventListener('click', async()=>{await unlockAudio(); toggleSound();});

async function enterMemoryWell(){
  await unlockAudio();
  playOne(sounds.enterWell,.65,true);
  chatIntro.style.display='none';
  orbitScreen.classList.remove('hidden-screen');
  document.body.style.overflow='hidden';
  requestAnimationFrame(()=>{
    $('#orbitTitle').classList.add('show');
    initializeOrbit();
    startAtmosphere($('#wellCanvas'),'orbit');
    startTrailSystem();
    startAmbience();
  });
}

// ATMOSPHERE CANVAS
const atmosphereStates=new WeakMap();
function startAtmosphere(canvas, mode='orbit'){
  if(!canvas || atmosphereStates.has(canvas)) return;
  const ctx=canvas.getContext('2d',{alpha:true});
  const state={ctx,canvas,mode,t:0,motes:[],fog:[],w:0,h:0,raf:0};
  atmosphereStates.set(canvas,state);
  function resize(){
    const rect=canvas.getBoundingClientRect();
    const targetW=Math.max(180,Math.min(380,Math.floor(rect.width/3.2)));
    const targetH=Math.max(120,Math.floor(targetW*rect.height/Math.max(1,rect.width)));
    canvas.width=targetW; canvas.height=targetH; state.w=targetW; state.h=targetH;
    state.motes=Array.from({length: mode==='orbit'?78:56},()=>({x:Math.random()*state.w,y:Math.random()*state.h,vx:(Math.random()-.5)*.08,vy:-.02-Math.random()*.05,life:Math.random(),r:Math.random()<.8?1:2,c:Math.random()}));
    state.fog=Array.from({length:6},(_,i)=>({x:Math.random()*state.w,y:Math.random()*state.h,rx:24+Math.random()*56,ry:12+Math.random()*28,speed:.0008+Math.random()*.0016,phase:Math.random()*Math.PI*2,hue:i%3}));
  }
  resize(); window.addEventListener('resize', resize);
  function poster(alpha,h){ if(h===0) return `rgba(68,255,216,${alpha})`; if(h===1) return `rgba(77,106,255,${alpha})`; return `rgba(150,72,255,${alpha})`; }
  function draw(){
    state.t++; const {ctx,w,h}=state; ctx.clearRect(0,0,w,h); ctx.fillStyle='#020405'; ctx.fillRect(0,0,w,h);
    for(let y=0;y<h;y+=8){const a=0.008+((y/8)%2)*0.006; ctx.fillStyle=`rgba(100,255,225,${a})`; ctx.fillRect(0,y,w,1);}    
    ctx.globalCompositeOperation='screen';
    for(const f of state.fog){
      const x=f.x+Math.sin(state.t*f.speed*4+f.phase)*24; const y=f.y+Math.cos(state.t*f.speed*3+f.phase)*10;
      const grad=ctx.createRadialGradient(x,y,0,x,y,f.rx); grad.addColorStop(0,poster(.055,f.hue)); grad.addColorStop(.46,poster(.024,f.hue)); grad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save(); ctx.translate(x,y); ctx.scale(1,f.ry/f.rx); ctx.fillStyle=grad; ctx.beginPath(); ctx.arc(0,0,f.rx,0,Math.PI*2); ctx.fill(); ctx.restore();
    }
    for(const p of state.motes){
      p.x += p.vx + Math.sin((state.t+p.y)*.013)*.018; p.y += p.vy; p.life += .004; if(p.y<-3){p.y=h+3; p.x=Math.random()*w;} if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      const flick=.22+Math.max(0,Math.sin((state.t*.05)+(p.life*12)))*.58; if(p.c<.68) ctx.fillStyle=`rgba(145,255,221,${flick})`; else if(p.c<.87) ctx.fillStyle=`rgba(110,145,255,${flick*.8})`; else ctx.fillStyle=`rgba(255,115,205,${flick*.55})`; ctx.fillRect(Math.round(p.x),Math.round(p.y),p.r,p.r);
    }
    ctx.globalCompositeOperation='source-over'; ctx.lineWidth=1; ctx.strokeStyle='rgba(78,255,211,.07)';
    for(let row=0;row<4;row++){ ctx.beginPath(); const baseY=h*(.20 + row*.18); for(let x=0;x<=w;x+=5){ const y=baseY+Math.sin(x*.055+state.t*.006+row*1.7)*2.2+Math.sin(x*.017-state.t*.003)*1.1; if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.stroke(); }
    if(mode==='orbit'){ for(let i=0;i<9;i++){ const y=h-8-i*3; const off=Math.sin(state.t*.009+i)*6; ctx.fillStyle=`rgba(73,230,219,${.022 + i*.003})`; for(let x=0;x<w;x+=18){ const len=5+((x+i*7)%11); ctx.fillRect(Math.round(x+off),y,len,1);} } }
    if(state.t%167===0){ ctx.fillStyle='rgba(255,255,255,.12)'; const yy=Math.floor(Math.random()*h); ctx.fillRect(0,yy,w,1); }
    state.raf=requestAnimationFrame(draw);
  }
  draw();
}

// ORBIT + TRAILS
let orbitInitialized=false; const orbitObjects=[]; let trailStarted=false;
function initializeOrbit(){
  if(orbitInitialized) return; orbitInitialized=true;
  const stage=$('#orbitStage'); const cursorLight=$('#cursorLight'); const rectOf=()=>stage.getBoundingClientRect();
  orbitScreen.addEventListener('pointermove',e=>{const r=orbitScreen.getBoundingClientRect(); cursorLight.style.left=`${e.clientX-r.left}px`; cursorLight.style.top=`${e.clientY-r.top}px`;});
  const starts=[
    {x:.17,y:.34,s:.009,rx:36,ry:18,p:.1},{x:.38,y:.21,s:.0072,rx:54,ry:29,p:1.3},{x:.69,y:.28,s:.008,rx:45,ry:24,p:2.2},
    {x:.79,y:.60,s:.0065,rx:36,ry:19,p:3.4},{x:.49,y:.69,s:.0073,rx:60,ry:28,p:4.7},{x:.18,y:.66,s:.0062,rx:34,ry:22,p:5.7}
  ];
  $$('.sphere',stage).forEach((el,i)=>{
    const r=rectOf(); const rad=el.offsetWidth/2;
    const o={el,month:el.dataset.month,x:r.width*starts[i].x,y:r.height*starts[i].y,baseX:r.width*starts[i].x,baseY:r.height*starts[i].y,phase:starts[i].p,speed:starts[i].s,rx:starts[i].rx,ry:starts[i].ry,radius:rad,dragging:false,pointerId:null,offsetX:0,offsetY:0,moved:false,history:[],lastMove:null};
    function setPos(){ el.style.left=`${o.x}px`; el.style.top=`${o.y}px`; }
    setPos();
    el.addEventListener('pointerdown', async e=>{
      await unlockAudio();
      playOne(sounds.orbClick,.24,true);
      const sr=rectOf();
      const px=e.clientX-sr.left, py=e.clientY-sr.top;
      o.dragging=true; o.pointerId=e.pointerId; o.offsetX=px-o.x; o.offsetY=py-o.y; o.moved=false; o.startX=px; o.startY=py; o.lastMove={x:px,y:py,t:performance.now()};
      el.classList.add('dragging'); el.setPointerCapture(e.pointerId);
      setDragTone(true,0);
    });
    el.addEventListener('pointermove',e=>{
      if(!o.dragging || o.pointerId!==e.pointerId) return;
      const sr=rectOf(); const px=e.clientX-sr.left, py=e.clientY-sr.top;
      o.x=Math.max(o.radius,Math.min(sr.width-o.radius,px-o.offsetX));
      o.y=Math.max(o.radius,Math.min(sr.height-o.radius,py-o.offsetY));
      o.baseX=o.x; o.baseY=o.y; setPos();
      const dist=Math.hypot(px-o.startX,py-o.startY); if(dist>6) o.moved=true;
      const now=performance.now(); let speed=0; if(o.lastMove){ const dt=Math.max(16, now-o.lastMove.t); speed=Math.hypot(px-o.lastMove.x,py-o.lastMove.y)/(dt/16); } o.lastMove={x:px,y:py,t:now};
      setDragTone(true,speed);
    });
    function release(e){ if(o.pointerId!==e.pointerId) return; o.dragging=false; el.classList.remove('dragging'); try{el.releasePointerCapture(e.pointerId);}catch{} o.pointerId=null; setDragTone(false); if(!o.moved){ playOne(sounds.orbClick,.40,true); openMonthPage(o.month); } else { playOne(sounds.orbClick,.18,true);} }
    el.addEventListener('pointerup',release); el.addEventListener('pointercancel',release);
    o.setPos=setPos; orbitObjects.push(o);
  });
  let t=0;
  function animate(){
    t++;
    orbitObjects.forEach((o,i)=>{
      if(!o.dragging){
        o.x=o.baseX + Math.cos(t*o.speed + o.phase)*o.rx + Math.sin(t*.0023 + i)*3;
        o.y=o.baseY + Math.sin(t*o.speed + o.phase)*o.ry + Math.cos(t*.0017 + i*2)*2;
        o.setPos();
      }
      o.history.push({x:o.x,y:o.y}); if(o.history.length>18) o.history.shift();
    });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize',()=>{const r=rectOf(); orbitObjects.forEach((o,i)=>{o.radius=o.el.offsetWidth/2; if(!o.dragging){o.baseX=r.width*starts[i].x; o.baseY=r.height*starts[i].y;}}); resizeTrailCanvas();});
}

let trailCanvas, trailCtx;
function resizeTrailCanvas(){
  if(!trailCanvas) return; const rect=trailCanvas.getBoundingClientRect(); const dpr=Math.min(2, window.devicePixelRatio||1); trailCanvas.width=Math.floor(rect.width*dpr); trailCanvas.height=Math.floor(rect.height*dpr); trailCtx.setTransform(dpr,0,0,dpr,0,0);
}
function startTrailSystem(){
  if(trailStarted) return; trailStarted=true; trailCanvas=$('#trailCanvas'); trailCtx=trailCanvas.getContext('2d'); resizeTrailCanvas(); window.addEventListener('resize',resizeTrailCanvas);
  function drawTrail(){
    const w=trailCanvas.getBoundingClientRect().width, h=trailCanvas.getBoundingClientRect().height; trailCtx.clearRect(0,0,w,h);
    for(const o of orbitObjects){
      if(o.history.length<2) continue;
      trailCtx.lineCap='round'; trailCtx.lineJoin='round';
      for(let i=1;i<o.history.length;i++){
        const p0=o.history[i-1], p1=o.history[i]; const alpha=i/o.history.length;
        trailCtx.strokeStyle=`rgba(120,255,220,${alpha*.06})`; trailCtx.lineWidth=2 + alpha*3; trailCtx.beginPath(); trailCtx.moveTo(p0.x,p0.y); trailCtx.lineTo(p1.x,p1.y); trailCtx.stroke();
        trailCtx.strokeStyle=`rgba(120,150,255,${alpha*.03})`; trailCtx.lineWidth=1 + alpha*2; trailCtx.beginPath(); trailCtx.moveTo(p0.x+2,p0.y); trailCtx.lineTo(p1.x+2,p1.y); trailCtx.stroke();
      }
      const head=o.history[o.history.length-1];
      trailCtx.fillStyle='rgba(150,255,228,.13)'; trailCtx.beginPath(); trailCtx.arc(head.x,head.y,12,0,Math.PI*2); trailCtx.fill();
    }
    requestAnimationFrame(drawTrail);
  }
  drawTrail();
}

// MONTH PAGE
const monthTitle=$('#monthTitle'), monthDescription=$('#monthDescription'), monthIndex=$('#monthIndex'), monthTagIndex=$('#monthTagIndex'), memoryLineText=$('#memoryLineText');
let monthAtmosphereStarted=false;
function openMonthPage(key){
  const data=monthData[key]; if(!data) return;
  monthIndex.textContent=data.index; monthTagIndex.textContent=data.index; monthTitle.textContent=data.title; monthTitle.dataset.text=data.title; monthDescription.textContent=data.description; memoryLineText.textContent=data.line;
  orbitScreen.classList.add('hidden-screen'); monthPage.classList.remove('hidden-screen'); monthPage.scrollTop=0; playOne(sounds.orbClick,.48,true); if(audioState.enabled){ fadeAudio(sounds.ambientMain,0.12,600); fadeAudio(sounds.ambientNature,0.05,700); }
  if(!monthAtmosphereStarted){ startAtmosphere($('#monthCanvas'),'month'); monthAtmosphereStarted=true; }
}
$('#backToOrbit').addEventListener('click',()=>{ monthPage.classList.add('hidden-screen'); orbitScreen.classList.remove('hidden-screen'); playOne(sounds.orbClick,.35,true); if(audioState.enabled){ fadeAudio(sounds.ambientMain,0.18,500); fadeAudio(sounds.ambientNature,0.08,600); } });
