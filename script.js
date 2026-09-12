// =============================
// EDIT YOUR REAL CHAT HERE
// =============================
const conversation = [
  {
    opening: "🔥🔥 ja měl 6 bodu z use of english, myslel jsem že přece jsem znalec a dopadnu dobře B)",
    expected: [
      "tak bylo to tezky ale urcite das lingvistickou olympiadu jestli tam pujdes",
      "tak bylo to tezky, ale urcite das lingvistickou olympiadu, jestli tam pujdes"
    ],
    reply: "Odkud víš :0? Minulý rok jo, to bylo dobře :3",
    hint: "Try writing the reply from our real conversation."
  },
  {
    expected: [
      "vim vsechno",
      "protoze jsem genius",
      "protoze vim",
      "nevim"
    ],
    reply: "And that was only the beginning.",
    hint: "Replace this placeholder with the real next answer in script.js."
  }
];

const $ = s => document.querySelector(s);
const messages = $("#messages");
const form = $("#messageForm");
const input = $("#messageInput");
const typing = $("#typing");
const hint = $("#hint");
const chat = $("#chatIntro");
const main = $("#mainSite");

let step = 0;
let busy = false;
let done = false;

function normalize(s){
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[’']/g,"")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();
}

function similarity(a,b){
  a = normalize(a);
  b = normalize(b);

  if(a === b) return 1;
  if(!a || !b) return 0;
  if(a.includes(b) || b.includes(a)) return .92;

  const A = new Set(a.split(" "));
  const B = new Set(b.split(" "));
  const all = new Set([...A,...B]);

  let common = 0;
  all.forEach(word => {
    if(A.has(word) && B.has(word)) common++;
  });

  return common / all.size;
}

function accepted(text, expected){
  return expected.some(answer => similarity(text, answer) >= .72);
}

function addMessage(text, side){
  const row = document.createElement("div");
  row.className = "row " + side;

  if(side === "them"){
    const avatar = document.createElement("div");
    avatar.className = "mini-avatar";
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  row.appendChild(bubble);
  messages.appendChild(row);
  document.querySelector(".chat-body").scrollTop =
    document.querySelector(".chat-body").scrollHeight;
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function autoReply(text){
  busy = true;
  input.disabled = true;
  typing.classList.remove("hidden");

  await sleep(800);

  typing.classList.add("hidden");
  addMessage(text, "me");

  input.disabled = false;
  input.focus();
  busy = false;
}

function finish(){
  done = true;
  form.style.display = "none";
  hint.textContent = "";

  const button = document.createElement("button");
  button.className = "continue";
  button.textContent = "CONTINUE OUR STORY";

  button.onclick = () => {
    chat.style.display = "none";
    main.classList.remove("locked");
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    window.scrollTo(0,0);
  };

  messages.appendChild(button);
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  if(busy || done) return;

  const text = input.value.trim();
  if(!text) return;

  const current = conversation[step];

  if(!accepted(text, current.expected)){
    hint.textContent = current.hint || "That's not quite how it went.";
    return;
  }

  hint.textContent = "";
  input.value = "";
  addMessage(text, "them");

  await autoReply(current.reply);

  step++;
  if(step >= conversation.length) finish();
});

window.addEventListener("DOMContentLoaded", async () => {
  await sleep(450);
  if(conversation[0].opening){
    addMessage(conversation[0].opening, "me");
  }
  input.focus();
});

// MAIN SITE
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
}, {threshold:.15});

document.querySelectorAll(".card").forEach(card => {
  card.onclick = () => {
    card.querySelector("div").textContent = card.dataset.note;
    card.classList.toggle("open");
  };
});

$("#playButton").onclick = () => $("#finalMessage").classList.toggle("show");
