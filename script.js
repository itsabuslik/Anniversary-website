const conversation=[
  {
    opening:"🔥🔥 ja měl 6 bodu z use of english, myslel jsem že přece jsem znalec a dopadnu dobře B)",
    expected:"tak bylo to tezky, ale urcite das lingvistickou olympiadu, jestli tam pujdes !!",
    reply:"Odkud víš :0? Minulý rok jo, to bylo dobře :3"
  },
  {
    reply:"Ale aspoň mám motivace učit angličtinu dál",
    expected:"verim v tebe haha"
  }
];

const secondConversation=[
  {
    opening:"Dneska mi o tyto šále povídala Bětka xd",
    expected:"yess ja tu salu uplne miluju, ale kvuli tomu byla moje kamaradka vzhuru do 1 rano hahaha",
    replies:["XD","Je hezka"]
  },
  {
    expected:"ted ji budu nosit uplne vsude hahaha",
    replies:["A bude slušet tvému stylu si myslím"]
  },
  {
    expected:"snad jo snad jo",
    replies:[]
  },
  {
    expected:"tak vetsina myho obleceni je cerna takze",
    replies:["Oh no dneska jsi měla takovou červeno černou, ne? To je hezký"]
  },
  {
    expected:"dneska zrovna jo, chtela jsem alespon trosku vanocni outfit",
    replies:[]
  },
  {
    expected:"nic jinyho vanocniho nemam tak cerveny tricko muselo stacit",
    replies:["Ještě si pamatuju zelenou, tu asi vidim nejčastéj\nMožna mýlím se"]
  },
  {
    expected:"nepamatuju si kdy jsem naposledy mela zelenou teda",
    replies:[]
  },
  {
    expected:"jo jako mam jedno zeleno modry tricko",
    replies:["Okay tak nevím to je moje první asociace s tebou"]
  },
  {
    expected:"ale tak zelena je hezka",
    replies:[]
  }
];

const monthData={
  april:{index:"01",title:"APRIL"},
  may:{index:"02",title:"MAY"},
  june:{index:"03",title:"JUNE"},
  july:{index:"04",title:"JULY"},
  august:{index:"05",title:"AUGUST"},
  september:{index:"06",title:"SEPTEMBER"}
};

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

const chatIntro=$("#chatIntro");
const chatBody=$("#chatBody");
const messages=$("#messages");
const typing=$("#typing");
const form=$("#messageForm");
const input=$("#messageInput");
const sendButton=$("#sendButton");

const chatInterlude=$("#chatInterlude");
const interludeBody=$("#chatInterludeBody");
const interludeMessages=$("#interludeMessages");
const interludeTyping=$("#interludeTyping");
const interludeForm=$("#interludeForm");
const interludeInput=$("#interludeInput");
const interludeSendButton=$("#interludeSendButton");

const treeHub=$("#treeHub");
const treeMemoryPage=$("#treeMemoryPage");
const treeMemoryIndex=$("#treeMemoryIndex");
const enterWellFromTree=$("#enterWellFromTree");

const orbitScreen=$("#orbitScreen");
const monthPage=$("#monthPage");

let step=0;
let busy=false;
let finished=false;
let secondStep=0;
let secondBusy=false;
let secondFinished=false;
let treeAtmosphereStarted=false;
let treeMemoryAtmosphereStarted=false;
const visitedMemories=new Set();

function currentTime(){
  return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

function addMessage(text,side,showAvatar=false){
  addMessageTo(messages,chatBody,text,side,showAvatar);
}

function addMessageTo(container,scrollBody,text,side,showAvatar=false){
  const row=document.createElement('div');
  row.className=`message-row ${side}`;

  if(side==='them'&&showAvatar){
    const av=document.createElement('div');
    av.className='mini-avatar';
    row.appendChild(av);
  }

  const wrap=document.createElement('div');
  wrap.className='message-wrap';

  const bubble=document.createElement('div');
  bubble.className='bubble';
  bubble.textContent=text;

  const meta=document.createElement('div');
  meta.className='message-meta';
  meta.textContent=currentTime();

  wrap.append(bubble,meta);
  row.appendChild(wrap);
  container.appendChild(row);

  requestAnimationFrame(()=>{
    scrollBody.scrollTo({top:scrollBody.scrollHeight,behavior:'smooth'});
  });
}

async function sendPremadeReply(text){
  if(!text) return;
  busy=true;
  input.disabled=true;
  sendButton.disabled=true;
  typing.classList.remove('hidden');

  await sleep(Math.min(1550,640+text.length*9));

  typing.classList.add('hidden');
  addMessage(text,'them',true);
  input.disabled=false;
  sendButton.disabled=false;
  busy=false;
  input.focus();
}

function finishConversation(){
  finished=true;
  input.blur();
  form.style.display='none';
  chatBody.classList.add('final-state');

  const wrap=document.createElement('div');
  wrap.className='final-continue-wrap';

  const btn=document.createElement('button');
  btn.className='continue';
  btn.textContent='CONTINUE';
  btn.addEventListener('click',startSecondChat,{once:true});

  wrap.appendChild(btn);
  messages.appendChild(wrap);

  const spacer=document.createElement('div');
  spacer.className='chat-end-spacer';
  messages.appendChild(spacer);

  const revealButton=()=>{
    btn.scrollIntoView({behavior:'smooth',block:'center'});
  };

  requestAnimationFrame(revealButton);
  setTimeout(revealButton,220);
  setTimeout(revealButton,520);
}

form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(busy||finished) return;

  const typed=input.value.trim();
  if(!typed) return;
  input.value='';

  await unlockAudio();

  const current=conversation[step];
  const corrected=current?.expected||typed;
  playOne(sounds.messageSend,.42,true);
  addMessage(corrected,'me',false);

  if(current?.reply) await sendPremadeReply(current.reply);

  step++;
  if(step>=conversation.length){
    await sleep(2026);
    finishConversation();
  }
});

window.addEventListener('DOMContentLoaded',async()=>{
  await sleep(350);
  if(conversation[0]?.opening) addMessage(conversation[0].opening,'them',true);
  input.focus();
  syncSoundButtons();
});

async function fadeSwap(fromEl,toEl,duration=620){
  fromEl.classList.add('bridge-fade-out');
  await sleep(duration);
  fromEl.classList.add('hidden-screen');
  fromEl.classList.remove('bridge-fade-out');

  toEl.classList.remove('hidden-screen');
  toEl.classList.add('bridge-fade-in');
  await sleep(duration);
  toEl.classList.remove('bridge-fade-in');
}

async function startSecondChat(){
  await unlockAudio();
  await fadeSwap(chatIntro,chatInterlude,620);

  interludeMessages.innerHTML='';
  secondStep=0;
  secondBusy=false;
  secondFinished=false;
  interludeForm.style.display='grid';
  chatInterlude.classList.remove('green-ending');

  if(secondConversation[0]?.opening){
    addMessageTo(interludeMessages,interludeBody,secondConversation[0].opening,'them',true);
  }

  setTimeout(()=>interludeInput.focus(),120);
}

async function sendSecondReplies(replies){
  if(!replies?.length) return;

  secondBusy=true;
  interludeInput.disabled=true;
  interludeSendButton.disabled=true;

  for(const reply of replies){
    interludeTyping.classList.remove('hidden');
    await sleep(Math.min(1650,650+reply.length*9));
    interludeTyping.classList.add('hidden');
    addMessageTo(interludeMessages,interludeBody,reply,'them',true);
    await sleep(260);
  }

  interludeInput.disabled=false;
  interludeSendButton.disabled=false;
  secondBusy=false;
  interludeInput.focus();
}

interludeForm.addEventListener('submit',async e=>{
  e.preventDefault();
  if(secondBusy||secondFinished) return;

  const typed=interludeInput.value.trim();
  if(!typed) return;
  interludeInput.value='';

  await unlockAudio();

  const current=secondConversation[secondStep];
  const corrected=current?.expected||typed;
  playOne(sounds.messageSend,.42,true);
  addMessageTo(interludeMessages,interludeBody,corrected,'me',false);

  if(current?.replies?.length){
    await sendSecondReplies(current.replies);
  }

  secondStep++;
  if(secondStep>=secondConversation.length){
    await finishSecondChat();
  }
});

async function finishSecondChat(){
  secondFinished=true;
  interludeInput.blur();
  interludeInput.disabled=true;
  interludeSendButton.disabled=true;

  // Keep the chat normal first. Green starts only after the entire exchange is complete.
  await sleep(2026);
  interludeForm.style.opacity='.72';
  chatInterlude.classList.add('green-ending');

  await sleep(1550);
  interludeForm.style.display='none';
  await fadeSwap(chatInterlude,treeHub,720);
  enterTreeHub();
}

function enterTreeHub(){
  document.body.style.overflow='hidden';

  if(!treeAtmosphereStarted){
    startAtmosphere($('#treeCanvas'),'green');
    treeAtmosphereStarted=true;
  }

  startTreeNature();
  updateTreeCompletion();
}

$$('.bush',treeHub).forEach(btn=>{
  btn.addEventListener('click',async()=>{
    await unlockAudio();
    playOne(sounds.orbClick,.34,true);

    const memory=btn.dataset.memory;
    visitedMemories.add(memory);
    btn.classList.add('visited');
    updateTreeCompletion();
    openTreeMemory(memory);
  });
});

function updateTreeCompletion(){
  if(visitedMemories.size>=4){
    enterWellFromTree.classList.remove('hidden');
  }
}

function openTreeMemory(memory){
  treeMemoryIndex.textContent=memory;
  treeHub.classList.add('hidden-screen');
  treeMemoryPage.classList.remove('hidden-screen');
  treeMemoryPage.scrollTop=0;

  if(!treeMemoryAtmosphereStarted){
    startAtmosphere($('#treeMemoryCanvas'),'green');
    treeMemoryAtmosphereStarted=true;
  }
}

$('#backToTree').addEventListener('click',async()=>{
  await unlockAudio();
  playOne(sounds.orbClick,.24,true);
  treeMemoryPage.classList.add('hidden-screen');
  treeHub.classList.remove('hidden-screen');
  updateTreeCompletion();
});

enterWellFromTree.addEventListener('click',async()=>{
  await enterMemoryWell();
});

// AUDIO
const audioState={enabled:true,unlocked:false,ctx:null,dragOsc:null,dragGain:null};
const sounds={
  ambientMain:new Audio('audio/ambient_main.mp3'),
  ambientNature:new Audio('audio/ambient_nature.mp3'),
  orbClick:new Audio('audio/orb_click.mp3'),
  enterWell:new Audio('audio/enter_well.mp3'),
  messageSend:new Audio('audio/message_send.mp3')
};
for(const a of Object.values(sounds)){a.preload='auto';}
sounds.ambientMain.loop=true;
sounds.ambientNature.loop=true;

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

  for(const a of Object.values(sounds)){
    a.muted=!audioState.enabled;
  }
  audioState.unlocked=true;
}

function playOne(audio,volume=.4,reset=true){
  if(!audioState.enabled||!audioState.unlocked) return;
  if(reset) audio.currentTime=0;
  audio.volume=volume;
  audio.play().catch(()=>{});
}

function fadeAudio(audio,target,duration=900){
  const start=audio.volume||0;
  const delta=target-start;
  const t0=performance.now();

  function frame(now){
    const p=Math.min(1,(now-t0)/duration);
    audio.volume=start+delta*p;
    if(p<1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

async function startTreeNature(){
  if(!audioState.enabled||!audioState.unlocked) return;
  sounds.ambientNature.volume=0;
  sounds.ambientNature.play().catch(()=>{});
  fadeAudio(sounds.ambientNature,.075,1500);
}

async function startAmbience(){
  if(!audioState.enabled||!audioState.unlocked) return;
  sounds.ambientMain.volume=0;
  sounds.ambientNature.volume=Math.min(sounds.ambientNature.volume,.075);
  sounds.ambientMain.play().catch(()=>{});
  sounds.ambientNature.play().catch(()=>{});
  fadeAudio(sounds.ambientMain,0.18,1600);
  fadeAudio(sounds.ambientNature,0.08,1800);
}

function stopAmbience(){
  for(const a of [sounds.ambientMain,sounds.ambientNature]) a.pause();
}

function setDragTone(active,speed=0){
  if(!audioState.enabled||!audioState.unlocked||!audioState.ctx||!audioState.dragOsc||!audioState.dragGain) return;
  const now=audioState.ctx.currentTime;

  if(active){
    const freq=Math.max(120,Math.min(340,130+speed*8));
    audioState.dragOsc.frequency.cancelScheduledValues(now);
    audioState.dragOsc.frequency.linearRampToValueAtTime(freq,now+.05);
    audioState.dragGain.gain.cancelScheduledValues(now);
    audioState.dragGain.gain.linearRampToValueAtTime(.012,now+.05);
  }else{
    audioState.dragGain.gain.cancelScheduledValues(now);
    audioState.dragGain.gain.linearRampToValueAtTime(0,now+.08);
  }
}

function toggleSound(force){
  audioState.enabled=typeof force==='boolean'?force:!audioState.enabled;
  for(const a of Object.values(sounds)) a.muted=!audioState.enabled;
  if(!audioState.enabled) setDragTone(false);
  syncSoundButtons();
}

function syncSoundButtons(){
  $$('#soundToggle, #soundToggleMonth, #soundToggleTree, #soundToggleTreeMemory').forEach(btn=>{
    btn.textContent=audioState.enabled?'SOUND ON':'SOUND OFF';
  });
}

$('#soundToggle').addEventListener('click',async()=>{
  await unlockAudio();
  toggleSound();
  if(audioState.enabled&&!sounds.ambientMain.paused){
    fadeAudio(sounds.ambientMain,0.18,400);
    fadeAudio(sounds.ambientNature,0.08,500);
  }
});

$('#soundToggleMonth').addEventListener('click',async()=>{
  await unlockAudio();
  toggleSound();
});

$('#soundToggleTree').addEventListener('click',async()=>{
  await unlockAudio();
  toggleSound();
  if(audioState.enabled&&!sounds.ambientNature.paused){
    fadeAudio(sounds.ambientNature,0.075,450);
  }
});

$('#soundToggleTreeMemory').addEventListener('click',async()=>{
  await unlockAudio();
  toggleSound();
});

async function enterMemoryWell(){
  await unlockAudio();
  playOne(sounds.enterWell,.65,true);

  treeHub.classList.add('bridge-fade-out');
  await sleep(620);
  treeHub.classList.add('hidden-screen');
  treeHub.classList.remove('bridge-fade-out');

  orbitScreen.classList.remove('hidden-screen');
  orbitScreen.style.opacity='0';
  document.body.style.overflow='hidden';

  requestAnimationFrame(()=>{
    orbitScreen.style.transition='opacity .62s ease';
    orbitScreen.style.opacity='1';
    $('#orbitTitle').classList.add('show');
    initializeOrbit();
    startAtmosphere($('#wellCanvas'),'orbit');
    startTrailSystem();
    startAmbience();
  });
}

// ATMOSPHERE CANVAS
const atmosphereStates=new WeakMap();
function startAtmosphere(canvas,mode='orbit'){
  if(!canvas||atmosphereStates.has(canvas)) return;

  const ctx=canvas.getContext('2d',{alpha:true});
  const state={ctx,canvas,mode,t:0,motes:[],fog:[],w:0,h:0,raf:0};
  atmosphereStates.set(canvas,state);

  function resize(){
    const rect=canvas.getBoundingClientRect();
    const targetW=Math.max(180,Math.min(380,Math.floor(rect.width/3.2)));
    const targetH=Math.max(120,Math.floor(targetW*rect.height/Math.max(1,rect.width)));
    canvas.width=targetW;
    canvas.height=targetH;
    state.w=targetW;
    state.h=targetH;

    state.motes=Array.from({length:mode==='orbit'?78:56},()=>({
      x:Math.random()*state.w,
      y:Math.random()*state.h,
      vx:(Math.random()-.5)*.08,
      vy:-.02-Math.random()*.05,
      life:Math.random(),
      r:Math.random()<.8?1:2,
      c:Math.random()
    }));

    state.fog=Array.from({length:mode==='green'?7:6},(_,i)=>({
      x:Math.random()*state.w,
      y:Math.random()*state.h,
      rx:24+Math.random()*56,
      ry:12+Math.random()*28,
      speed:.0008+Math.random()*.0016,
      phase:Math.random()*Math.PI*2,
      hue:i%3
    }));
  }

  resize();
  window.addEventListener('resize',resize);

  function poster(alpha,h){
    if(mode==='green') return `rgba(${h===0?'108,255,120':h===1?'72,210,90':'165,255,176'},${alpha})`;
    if(h===0) return `rgba(68,255,216,${alpha})`;
    if(h===1) return `rgba(77,106,255,${alpha})`;
    return `rgba(150,72,255,${alpha})`;
  }

  function draw(){
    state.t++;
    const {ctx,w,h}=state;
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle=mode==='green'?'#041007':'#020405';
    ctx.fillRect(0,0,w,h);

    for(let y=0;y<h;y+=8){
      const a=0.008+((y/8)%2)*0.006;
      ctx.fillStyle=mode==='green'?`rgba(138,255,152,${a})`:`rgba(100,255,225,${a})`;
      ctx.fillRect(0,y,w,1);
    }

    ctx.globalCompositeOperation='screen';
    for(const f of state.fog){
      const x=f.x+Math.sin(state.t*f.speed*4+f.phase)*24;
      const y=f.y+Math.cos(state.t*f.speed*3+f.phase)*10;
      const grad=ctx.createRadialGradient(x,y,0,x,y,f.rx);
      grad.addColorStop(0,poster(.055,f.hue));
      grad.addColorStop(.46,poster(.024,f.hue));
      grad.addColorStop(1,'rgba(0,0,0,0)');
      ctx.save();
      ctx.translate(x,y);
      ctx.scale(1,f.ry/f.rx);
      ctx.fillStyle=grad;
      ctx.beginPath();
      ctx.arc(0,0,f.rx,0,Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    for(const p of state.motes){
      p.x+=p.vx+Math.sin((state.t+p.y)*.013)*.018;
      p.y+=p.vy;
      p.life+=.004;
      if(p.y<-3){p.y=h+3;p.x=Math.random()*w;}
      if(p.x<0) p.x=w;
      if(p.x>w) p.x=0;

      const flick=.22+Math.max(0,Math.sin((state.t*.05)+(p.life*12)))*.58;
      if(mode==='green'){
        ctx.fillStyle=p.c<.84?`rgba(155,255,168,${flick})`:`rgba(220,255,225,${flick*.8})`;
      }else if(p.c<.68){
        ctx.fillStyle=`rgba(145,255,221,${flick})`;
      }else if(p.c<.87){
        ctx.fillStyle=`rgba(110,145,255,${flick*.8})`;
      }else{
        ctx.fillStyle=`rgba(255,115,205,${flick*.55})`;
      }
      ctx.fillRect(Math.round(p.x),Math.round(p.y),p.r,p.r);
    }

    ctx.globalCompositeOperation='source-over';
    ctx.lineWidth=1;
    ctx.strokeStyle=mode==='green'?'rgba(118,255,143,.06)':'rgba(78,255,211,.07)';

    for(let row=0;row<4;row++){
      ctx.beginPath();
      const baseY=mode==='green'?h*(.62+row*.08):h*(.20+row*.18);
      for(let x=0;x<=w;x+=5){
        const yy=baseY+Math.sin(x*.055+state.t*.006+row*1.7)*2.2+Math.sin(x*.017-state.t*.003)*1.1;
        if(x===0) ctx.moveTo(x,yy);
        else ctx.lineTo(x,yy);
      }
      ctx.stroke();
    }

    if(mode==='orbit'){
      for(let i=0;i<9;i++){
        const y=h-8-i*3;
        const off=Math.sin(state.t*.009+i)*6;
        ctx.fillStyle=`rgba(73,230,219,${.022+i*.003})`;
        for(let x=0;x<w;x+=18){
          const len=5+((x+i*7)%11);
          ctx.fillRect(Math.round(x+off),y,len,1);
        }
      }
    }

    if(state.t%167===0){
      ctx.fillStyle='rgba(255,255,255,.12)';
      const yy=Math.floor(Math.random()*h);
      ctx.fillRect(0,yy,w,1);
    }

    state.raf=requestAnimationFrame(draw);
  }

  draw();
}

// ORBIT + TRAILS — existing Memory Well behavior
let orbitInitialized=false;
const orbitObjects=[];
let trailStarted=false;

function initializeOrbit(){
  if(orbitInitialized) return;
  orbitInitialized=true;

  const stage=$('#orbitStage');
  const cursorLight=$('#cursorLight');
  const rectOf=()=>stage.getBoundingClientRect();

  orbitScreen.addEventListener('pointermove',e=>{
    const r=orbitScreen.getBoundingClientRect();
    cursorLight.style.left=`${e.clientX-r.left}px`;
    cursorLight.style.top=`${e.clientY-r.top}px`;
  });

  const starts=[
    {x:.17,y:.34,s:.009,rx:36,ry:18,p:.1},
    {x:.38,y:.21,s:.0072,rx:54,ry:29,p:1.3},
    {x:.69,y:.28,s:.008,rx:45,ry:24,p:2.2},
    {x:.79,y:.60,s:.0065,rx:36,ry:19,p:3.4},
    {x:.49,y:.69,s:.0073,rx:60,ry:28,p:4.7},
    {x:.18,y:.66,s:.0062,rx:34,ry:22,p:5.7}
  ];

  $$('.sphere',stage).forEach((el,i)=>{
    const r=rectOf();
    const rad=el.offsetWidth/2;
    const o={
      el,
      month:el.dataset.month,
      x:r.width*starts[i].x,
      y:r.height*starts[i].y,
      baseX:r.width*starts[i].x,
      baseY:r.height*starts[i].y,
      phase:starts[i].p,
      speed:starts[i].s,
      rx:starts[i].rx,
      ry:starts[i].ry,
      radius:rad,
      dragging:false,
      pointerId:null,
      offsetX:0,
      offsetY:0,
      moved:false,
      history:[],
      lastMove:null
    };

    function setPos(){
      el.style.left=`${o.x}px`;
      el.style.top=`${o.y}px`;
    }
    setPos();

    el.addEventListener('pointerdown',async e=>{
      await unlockAudio();
      const sr=rectOf();
      const px=e.clientX-sr.left;
      const py=e.clientY-sr.top;
      o.dragging=true;
      o.pointerId=e.pointerId;
      o.offsetX=px-o.x;
      o.offsetY=py-o.y;
      o.moved=false;
      o.startX=px;
      o.startY=py;
      o.lastMove={x:px,y:py,t:performance.now()};
      el.classList.add('dragging');
      el.setPointerCapture(e.pointerId);
      setDragTone(true,0);
    });

    el.addEventListener('pointermove',e=>{
      if(!o.dragging||o.pointerId!==e.pointerId) return;
      const sr=rectOf();
      const px=e.clientX-sr.left;
      const py=e.clientY-sr.top;
      o.x=Math.max(o.radius,Math.min(sr.width-o.radius,px-o.offsetX));
      o.y=Math.max(o.radius,Math.min(sr.height-o.radius,py-o.offsetY));
      o.baseX=o.x;
      o.baseY=o.y;
      setPos();

      const dist=Math.hypot(px-o.startX,py-o.startY);
      if(dist>6) o.moved=true;

      const now=performance.now();
      let speed=0;
      if(o.lastMove){
        const dt=Math.max(16,now-o.lastMove.t);
        speed=Math.hypot(px-o.lastMove.x,py-o.lastMove.y)/(dt/16);
      }
      o.lastMove={x:px,y:py,t:now};
      setDragTone(true,speed);
    });

    function release(e){
      if(o.pointerId!==e.pointerId) return;
      o.dragging=false;
      el.classList.remove('dragging');
      try{el.releasePointerCapture(e.pointerId);}catch{}
      o.pointerId=null;
      setDragTone(false);
      if(!o.moved) openMonthPage(o.month);
    }

    el.addEventListener('pointerup',release);
    el.addEventListener('pointercancel',release);
    o.setPos=setPos;
    orbitObjects.push(o);
  });

  let t=0;
  function animate(){
    t++;
    orbitObjects.forEach((o,i)=>{
      if(!o.dragging){
        o.x=o.baseX+Math.cos(t*o.speed+o.phase)*o.rx+Math.sin(t*.0023+i)*3;
        o.y=o.baseY+Math.sin(t*o.speed+o.phase)*o.ry+Math.cos(t*.0017+i*2)*2;
        o.setPos();
      }
      o.history.push({x:o.x,y:o.y});
      if(o.history.length>18) o.history.shift();
    });
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize',()=>{
    const r=rectOf();
    orbitObjects.forEach((o,i)=>{
      o.radius=o.el.offsetWidth/2;
      if(!o.dragging){
        o.baseX=r.width*starts[i].x;
        o.baseY=r.height*starts[i].y;
      }
    });
    resizeTrailCanvas();
  });
}

let trailCanvas,trailCtx;
function resizeTrailCanvas(){
  if(!trailCanvas) return;
  const rect=trailCanvas.getBoundingClientRect();
  const dpr=Math.min(2,window.devicePixelRatio||1);
  trailCanvas.width=Math.floor(rect.width*dpr);
  trailCanvas.height=Math.floor(rect.height*dpr);
  trailCtx.setTransform(dpr,0,0,dpr,0,0);
}

function startTrailSystem(){
  if(trailStarted) return;
  trailStarted=true;
  trailCanvas=$('#trailCanvas');
  trailCtx=trailCanvas.getContext('2d');
  resizeTrailCanvas();
  window.addEventListener('resize',resizeTrailCanvas);

  function drawTrail(){
    const w=trailCanvas.getBoundingClientRect().width;
    const h=trailCanvas.getBoundingClientRect().height;
    trailCtx.clearRect(0,0,w,h);

    for(const o of orbitObjects){
      if(o.history.length<2) continue;
      trailCtx.lineCap='round';
      trailCtx.lineJoin='round';

      for(let i=1;i<o.history.length;i++){
        const p0=o.history[i-1];
        const p1=o.history[i];
        const alpha=i/o.history.length;

        trailCtx.strokeStyle=`rgba(120,255,220,${alpha*.06})`;
        trailCtx.lineWidth=2+alpha*3;
        trailCtx.beginPath();
        trailCtx.moveTo(p0.x,p0.y);
        trailCtx.lineTo(p1.x,p1.y);
        trailCtx.stroke();

        trailCtx.strokeStyle=`rgba(120,150,255,${alpha*.03})`;
        trailCtx.lineWidth=1+alpha*2;
        trailCtx.beginPath();
        trailCtx.moveTo(p0.x+2,p0.y);
        trailCtx.lineTo(p1.x+2,p1.y);
        trailCtx.stroke();
      }

      const head=o.history[o.history.length-1];
      trailCtx.fillStyle='rgba(150,255,228,.13)';
      trailCtx.beginPath();
      trailCtx.arc(head.x,head.y,12,0,Math.PI*2);
      trailCtx.fill();
    }

    requestAnimationFrame(drawTrail);
  }

  drawTrail();
}

// MONTH PAGE — existing Memory Well pages
const monthTitle=$('#monthTitle');
const monthIndex=$('#monthIndex');
let monthAtmosphereStarted=false;

function openMonthPage(key){
  const data=monthData[key];
  if(!data) return;

  monthIndex.textContent=data.index;
  monthTitle.textContent=data.title;
  monthTitle.dataset.text=data.title;

  orbitScreen.classList.add('hidden-screen');
  monthPage.classList.remove('hidden-screen');
  requestAnimationFrame(()=>{monthPage.scrollTop=0;});

  playOne(sounds.orbClick,.48,true);
  if(audioState.enabled){
    fadeAudio(sounds.ambientMain,0.12,600);
    fadeAudio(sounds.ambientNature,0.05,700);
  }

  if(!monthAtmosphereStarted){
    startAtmosphere($('#monthCanvas'),'month');
    monthAtmosphereStarted=true;
  }
}

$('#backToOrbit').addEventListener('click',()=>{
  monthPage.scrollTop=0;
  monthPage.classList.add('hidden-screen');
  orbitScreen.classList.remove('hidden-screen');
  playOne(sounds.orbClick,.35,true);

  if(audioState.enabled){
    fadeAudio(sounds.ambientMain,0.18,500);
    fadeAudio(sounds.ambientNature,0.08,600);
  }
});
