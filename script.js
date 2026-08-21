/* =========================================================
   DREAMY PROPOSAL SITE - FINAL CONTROLLER
   ========================================================= */

const screens = [...document.querySelectorAll(".screen")];
const journeyDots = [...document.querySelectorAll(".journey-dots .dot")];

function showScreen(id) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
  }

  // update journey dots
  const activeIndex = screens.findIndex(s => s.id === id);
  journeyDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === activeIndex);
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  createSparkles();
}


/* =========================================================
   MUSIC
   ========================================================= */

const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

let musicAvailable = true;

if (music) {
  music.addEventListener("error", () => {
    musicAvailable = false;
    if (musicToggle) {
      musicToggle.classList.add("hidden");
    }
  });

  music.addEventListener("canplay", () => {
    if (musicAvailable && musicToggle) {
      musicToggle.classList.remove("hidden");
    }
  });
}

function tryStartMusic() {
  if (!musicAvailable || !music) return;
  music.volume = 0.35;
  music.play()
    .then(() => {
      if (musicToggle) {
        musicToggle.classList.remove("hidden");
        const label = musicToggle.querySelector(".music-label");
        if (label) label.textContent = "music on ♫";
      }
    })
    .catch(() => {});
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (!musicAvailable || !music) return;
    if (music.paused) {
      music.play()
        .then(() => {
          const label = musicToggle.querySelector(".music-label");
          if (label) label.textContent = "music on ♫";
        })
        .catch(() => {});
    } else {
      music.pause();
      const label = musicToggle.querySelector(".music-label");
      if (label) label.textContent = "music off";
    }
  });
}


/* =========================================================
   INTRO
   ========================================================= */

const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    tryStartMusic();
    createBurst();
    setTimeout(() => {
      showScreen("choice");
    }, 250);
  });
}


/* =========================================================
   CHOICE SCREEN
   ========================================================= */

const revealMessages = {
  little:
    "You probably don't realize how often you make an ordinary moment feel a little better just by being there.",
  secret:
    "Tiny secret: I have definitely caught myself smiling at my phone because of you. More than once.",
  random:
    "Random fact: talking to you has an oddly reliable ability to improve my mood.",
  warning:
    "Small warning: there is a question waiting at the end of this. I've been nervous about it for a while."
};

const choiceCards = document.querySelectorAll(".choice-card");

choiceCards.forEach(card => {
  card.addEventListener("click", () => {
    const choice = card.dataset.choice;
    choiceCards.forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");

    const revealArea = document.getElementById("revealArea");
    const revealText = document.getElementById("revealText");
    if (revealText) revealText.textContent = revealMessages[choice];

    if (revealArea) {
      revealArea.classList.remove("hidden");
      revealArea.classList.add("revealing");
      setTimeout(() => {
        revealArea.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }

    createBurst();
  });
});


const choiceContinue = document.getElementById("choiceContinue");
if (choiceContinue) {
  choiceContinue.addEventListener("click", () => {
    showScreen("cards");
  });
}


/* =========================================================
   MEMORY CARDS
   ========================================================= */

const memoryCards = document.querySelectorAll(".memory-card");
const openedCards = new Set();
const totalCards = memoryCards.length;

const cardProgressFill = document.getElementById("cardProgressFill");
const cardProgressLabel = document.getElementById("cardProgressLabel");
const cardHintText = document.getElementById("cardHintText");
const askBtn = document.getElementById("askBtn");
const allCardsOpened = document.getElementById("allCardsOpened");

let hintTimer = null;

function updateCardProgress() {
  const count = openedCards.size;
  if (cardProgressFill) {
    cardProgressFill.style.width = `${(count / totalCards) * 100}%`;
  }
  if (cardProgressLabel) {
    cardProgressLabel.textContent = `${count} / ${totalCards} opened`;
  }
  if (cardHintText) {
    cardHintText.classList.remove("visible");
  }
  if (count === totalCards) {
    revealAskButton();
  }
}

function revealAskButton() {
  if (askBtn) {
    askBtn.classList.remove("hidden");
  }
  if (allCardsOpened) {
    allCardsOpened.classList.remove("hidden");
  }
  createMassiveBurst();
  setTimeout(() => {
    createBurst();
  }, 500);
}

memoryCards.forEach((card, index) => {
  const flipCard = () => {
    if (card.classList.contains("flipped")) {
      // wiggle if already opened
      card.animate(
        [
          { transform: "rotate(0deg)" },
          { transform: "rotate(-2deg)" },
          { transform: "rotate(2deg)" },
          { transform: "rotate(0deg)" }
        ],
        { duration: 300, easing: "ease-in-out" }
      );
      return;
    }

    card.classList.add("flipped");
    card.setAttribute("aria-pressed", "true");

    openedCards.add(index);
    updateCardProgress();

    createCardBurst(card);
  };

  card.addEventListener("click", flipCard);

  // keyboard support
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCard();
    }
  });
});

// hint appears after 3 seconds if no cards opened
if (cardHintText) {
  hintTimer = setTimeout(() => {
    if (openedCards.size === 0) {
      cardHintText.classList.add("visible");
    }
  }, 3000);
}

// cancel hint timer when a card is opened
memoryCards.forEach(card => {
  card.addEventListener("click", () => {
    if (hintTimer) {
      clearTimeout(hintTimer);
      hintTimer = null;
    }
  });
});


/* =========================================================
   LOADING / SUSPENSE
   ========================================================= */

const loadingSteps = [
  { title: "okay...", copy: "this suddenly feels a little more real." },
  { title: "don't panic.", copy: "I'm definitely not panicking." },
  { title: "actually...", copy: "I might be panicking a little." },
  { title: "taking a breath...", copy: "one second. I want to ask this properly." },
  { title: "thinking...", copy: "about how to say this without making it weird." },
  { title: "almost there...", copy: "please be patient with my nervousness." },
  { title: "okay.", copy: "I think I'm ready." }
];

if (askBtn) {
  askBtn.addEventListener("click", startSuspense);
}

function startSuspense() {
  showScreen("loading");

  const title = document.getElementById("loadingTitle");
  const copy = document.getElementById("loadingCopy");
  const bar = document.getElementById("progressBar");
  const percent = document.getElementById("loadingPercent");

  let step = 0;
  const stepDuration = 3000;

  function showStep() {
    if (step >= loadingSteps.length) {
      finishSuspense();
      return;
    }

    const current = loadingSteps[step];

    if (title) title.style.opacity = "0";
    if (copy) copy.style.opacity = "0";

    setTimeout(() => {
      if (title) {
        title.textContent = current.title;
        title.style.opacity = "1";
      }
      if (copy) {
        copy.textContent = current.copy;
        copy.style.opacity = "1";
      }
    }, 250);

    const nextProgress = Math.round(((step + 1) / loadingSteps.length) * 94);
    if (bar) bar.style.width = `${nextProgress}%`;
    if (percent) percent.textContent = `${nextProgress}%`;

    createTinySparkle();
    step++;
    setTimeout(showStep, stepDuration);
  }

  showStep();
}

function finishSuspense() {
  const title = document.getElementById("loadingTitle");
  const copy = document.getElementById("loadingCopy");
  const bar = document.getElementById("progressBar");
  const percent = document.getElementById("loadingPercent");

  if (title) title.textContent = "one last thing...";
  if (copy) copy.textContent = "okay. here we go.";
  if (bar) bar.style.width = "100%";
  if (percent) percent.textContent = "100%";

  setTimeout(() => {
    createMassiveBurst();
    setTimeout(() => {
      showScreen("proposal");
      startTypingQuestion();
    }, 1200);
  }, 2500);
}


/* =========================================================
   TYPING EFFECT FOR PROPOSAL QUESTION
   ========================================================= */

const questionText = "Will you be my girlfriend?";

function startTypingQuestion() {
  const questionEl = document.getElementById("proposalQuestion");
  if (!questionEl) return;

  questionEl.textContent = "";
  let charIndex = 0;

  function typeNextChar() {
    if (charIndex < questionText.length) {
      questionEl.textContent += questionText[charIndex];
      charIndex++;
      if (charIndex % 5 === 0) createTinySparkle();
      setTimeout(typeNextChar, 90);
    } else {
      // add blinking cursor
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      questionEl.appendChild(cursor);
      setTimeout(() => cursor.remove(), 3000);
    }
  }

  setTimeout(typeNextChar, 400);
}


/* =========================================================
   PROPOSAL
   ========================================================= */

const noBtn = document.getElementById("noBtn");
const begText = document.getElementById("begText");

const noMessages = [
  "wait... that's not the one I was hoping for 🥹",
  "are you sure?",
  "I feel like we should reconsider this.",
  "you clicked the wrong answer. respectfully.",
  "okay okay... one more try?",
  "that button is suspiciously hard to catch.",
  "I'm choosing to believe that was an accident.",
  "please don't make me use my final trick.",
  "the other button is literally right there ♡"
];

let noCount = 0;

if (noBtn) {
  noBtn.addEventListener("mouseenter", dodgeNoButton);
  noBtn.addEventListener("click", dodgeNoButton);
}

function dodgeNoButton() {
  noCount++;
  if (begText) {
    begText.textContent = noMessages[(noCount - 1) % noMessages.length];
  }

  const scale = Math.max(0.6, 1 - noCount * 0.04);
  if (window.innerWidth < 600) {
    const x = (Math.random() * 100) - 50;
    const y = (Math.random() * 70) - 35;
    noBtn.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  } else {
    const x = (Math.random() * 240) - 120;
    const y = (Math.random() * 100) - 50;
    noBtn.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  createTinySparkle();
}


/* =========================================================
   YES
   ========================================================= */

const yesBtn = document.getElementById("yesBtn");
if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    tryStartMusic();
    createMassiveBurst();
    showScreen("success");
    startCelebration();
  });
}


/* =========================================================
   CELEBRATION
   ========================================================= */

function startCelebration() {
  const layer = document.getElementById("confettiLayer");
  if (!layer) return;
  layer.innerHTML = "";

  const symbols = ["♡", "♥", "✦", "✧", "❀", "·"];
  const colors = ["#d979a5", "#e4a7c1", "#b58aa7", "#d5b4c9", "#c96d97"];

  for (let i = 0; i < 100; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = `${10 + Math.random() * 18}px`;
    piece.style.animationDelay = `${Math.random() * 1.7}s`;
    piece.style.animationDuration = `${3 + Math.random() * 2.5}s`;
    layer.appendChild(piece);
  }

  for (let i = 0; i < 8; i++) {
    setTimeout(createFloatingHeart, i * 400);
  }
}


/* =========================================================
   PARTICLES / SPARKLES
   ========================================================= */

function createSparkles() {
  for (let i = 0; i < 5; i++) createTinySparkle();
}

function createTinySparkle() {
  const sparkle = document.createElement("div");
  sparkle.className = "floating-sparkle";
  sparkle.textContent = Math.random() > 0.5 ? "✦" : "♡";
  sparkle.style.left = `${20 + Math.random() * 60}%`;
  sparkle.style.top = `${25 + Math.random() * 50}%`;
  sparkle.style.animationDuration = `${2 + Math.random() * 2}s`;
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 4000);
}

function createCardBurst(card) {
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "floating-sparkle";
    sparkle.textContent = ["✦", "♡", "✧", "❀"][i % 4];
    sparkle.style.left = `${centerX + (Math.random() * 80 - 40)}px`;
    sparkle.style.top = `${centerY + (Math.random() * 80 - 40)}px`;
    sparkle.style.animationDuration = `${1.5 + Math.random() * 1.5}s`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
  }
}

function createBurst() {
  for (let i = 0; i < 12; i++) {
    setTimeout(createTinySparkle, i * 35);
  }
}

function createMassiveBurst() {
  for (let i = 0; i < 50; i++) {
    setTimeout(createTinySparkle, i * 30);
  }
}


/* =========================================================
   FLOATING HEARTS (background)
   ========================================================= */

function createFloatingHeart() {
  const container = document.getElementById("floatingHearts");
  if (!container) return;

  const heart = document.createElement("span");
  heart.className = "floating-heart";
  heart.textContent = ["♡", "♥", "♡", "❀"][Math.floor(Math.random() * 4)];
  heart.style.left = `${Math.random() * 95}%`;
  heart.style.fontSize = `${14 + Math.random() * 22}px`;
  heart.style.animationDuration = `${6 + Math.random() * 8}s`;
  container.appendChild(heart);
  setTimeout(() => heart.remove(), 15000);
}

setInterval(() => {
  if (Math.random() > 0.5) createFloatingHeart();
}, 2000);


/* =========================================================
   LITTLE EASTER EGG
   ========================================================= */

const moon = document.querySelector(".moon");
let moonClicks = 0;

if (moon) {
  moon.addEventListener("click", () => {
    moonClicks++;
    if (moonClicks === 3) {
      moonClicks = 0;

      const note = document.createElement("div");
      note.className = "moon-secret";
      note.innerHTML = `
        <span>you found the secret 🌙</span>
        <strong>okay, you're cute too.</strong>
      `;
      document.body.appendChild(note);

      setTimeout(() => note.classList.add("show"), 50);
      createMassiveBurst();

      setTimeout(() => {
        note.classList.remove("show");
        setTimeout(() => note.remove(), 500);
      }, 3500);
    }
  });
}
