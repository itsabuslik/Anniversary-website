// Reveal elements when they enter the screen
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => observer.observe(element));

// Clickable memory cards
document.querySelectorAll(".memory-card").forEach((card) => {
  card.addEventListener("click", () => {
    const note = card.querySelector(".hidden-note");
    note.textContent = card.dataset.note;
    card.classList.toggle("open");
  });
});

// Simple film button interaction
const playButton = document.getElementById("playButton");
const finalMessage = document.getElementById("finalMessage");

playButton.addEventListener("click", () => {
  finalMessage.classList.toggle("show");
  playButton.textContent = finalMessage.classList.contains("show")
    ? "CLOSE"
    : "PLAY";
});
