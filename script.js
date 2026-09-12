// Replace these placeholders with your real first conversation.
const conversation = [
  { opening:"Hey :)", expected:["hey","hi","hello","hii"], reply:"I wasn't sure if you would answer.", hint:"Try the answer from our real first chat." },
  { expected:["of course","of course i would","why wouldnt i","why wouldn't i","i would"], reply:"Good. Because I actually wanted to ask you something.", hint:"Think about what you wrote next." },
  { expected:["what","what is it","ask","go ahead","what did you want to ask"], reply:"And somehow that tiny conversation became all of this.", hint:"A short curious reply should work." }
];

const $=s=>document.querySelector(s);
const messages=$("#messages"), form=$("#messageForm"), input=$("#messageInput"),
typing=$("#typing"), hint=$("#hint"), chat=$("#chatIntro"), main=$("#mainSite");
let step=0, busy=false, done=false;

function norm(s){return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}
function score(a,b){a=norm(a);b=norm(b);if(a===b)return 1;if(!a||!b)return 0;if(a.includes(b)||b.includes(a))return .9;const A=new Set(a.split(" ")),B=new Set(b.split(" ")),all=new Set([...A,...B]);let n=0;all.forEach(w=>{if(A.has(w)&&B.has(w))n++});return n/all.size}
function accepted(text,list){return list.some(x=>score(text,x)>=.72)}
function add(text,side){const r=document.createElement("div");r.className="row "+side;const b=document.createElement("div");b.className="bubble";b.textContent=text;r.appendChild(b);messages.appendChild(r);messages.scrollTop=messages.scrollHeight}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function reply(text){busy=true;input.disabled=true;typing.classList.remove("hidden");await sleep(850);typing.classList.add("hidden");add(text,"them");input.disabled=false;busy=false;input.focus()}
function finish(){done=true;form.style.display="none";hint.textContent="";const b=document.createElement("button");b.className="continue";b.textContent="CONTINUE OUR STORY";b.onclick=()=>{chat.style.display="none";main.classList.remove("locked");document.querySelectorAll(".reveal").forEach(x=>observer.observe(x));window.scrollTo(0,0)};messages.appendChild(b);messages.scrollTop=messages.scrollHeight}

form.addEventListener("submit",async e=>{e.preventDefault();if(busy||done)return;const text=input.value.trim();if(!text)return;const c=conversation[step];if(!accepted(text,c.expected)){hint.textContent=c.hint||"That's not quite how it went.";return}hint.textContent="";input.value="";add(text,"me");await reply(c.reply);step++;if(step>=conversation.length)finish()});

window.addEventListener("DOMContentLoaded",async()=>{await sleep(450);if(conversation[0].opening)await reply(conversation[0].opening);input.focus()});

const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.15});
document.querySelectorAll(".card").forEach(c=>c.onclick=()=>{c.querySelector("div").textContent=c.dataset.note;c.classList.toggle("open")});
$("#playButton").onclick=()=>$("#finalMessage").classList.toggle("show");
