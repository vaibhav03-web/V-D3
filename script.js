// ============ Screen navigation ============
const screens = Array.from(document.querySelectorAll('.screen'));
function showScreen(id){
  screens.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ Music toggle ============
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let musicStarted = false;

// Only reveal the toggle if a source is actually present/loadable
bgMusic.addEventListener('canplay', () => {
  musicToggle.classList.remove('hidden');
}, { once: true });
bgMusic.addEventListener('error', () => {
  musicToggle.classList.add('hidden');
});
// Try to detect early too, in case canplay never fires (missing file)
setTimeout(() => {
  if (bgMusic.readyState === 0) musicToggle.classList.add('hidden');
}, 1500);

musicToggle.addEventListener('click', () => {
  const label = musicToggle.querySelector('.music-label');
  if (!musicStarted) {
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      musicStarted = true;
      musicToggle.classList.add('playing');
      label.textContent = 'pause the song';
    }).catch(() => {
      label.textContent = 'tap again ♫';
    });
  } else if (bgMusic.paused) {
    bgMusic.play();
    musicToggle.classList.add('playing');
    label.textContent = 'pause the song';
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
    label.textContent = 'play a little song';
  }
});

// ============ Intro -> Choice ============
document.getElementById('startBtn').addEventListener('click', () => {
  showScreen('choice');
});

// ============ Choice screen ============
const choiceMessages = {
  little: "Okay, something little: you have this way of making an ordinary Tuesday feel like an event, just by being in it. That's not a small thing to me.",
  secret: "Alright, the secret — I've rewritten this website more times than I'll ever admit, because I kept wanting to say it a little better. That's how much I wanted to get this right for you.",
  random: "Something random: if you were a font, you'd be one of those ones that looks effortless but is secretly really well designed. Make of that what you will.",
  warning: "Fair warning — the rest of this page is unreasonably soft and a little nervous. I'm not sorry about it."
};

const choiceCards = document.querySelectorAll('.choice-card');
const revealArea = document.getElementById('revealArea');
const revealText = document.getElementById('revealText');

choiceCards.forEach(card => {
  card.addEventListener('click', () => {
    choiceCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const key = card.getAttribute('data-choice');
    revealText.textContent = choiceMessages[key] || "You picked this one — I like that.";
    revealArea.classList.remove('hidden');
    revealArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

document.getElementById('choiceContinue').addEventListener('click', () => {
  showScreen('cards');
});

// ============ Memory cards (flip on tap) ============
document.querySelectorAll('.memory-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

document.getElementById('askBtn').addEventListener('click', () => {
  showScreen('loading');
  runLoadingSequence();
});

// ============ Loading sequence ============
const loadingLines = [
  "collecting courage...",
  "double checking this is a good idea...",
  "definitely not rehearsing this in my head...",
  "okay, hands are a little shaky...",
  "one more deep breath...",
  "here goes nothing..."
];

function runLoadingSequence(){
  const titleEl = document.getElementById('loadingTitle');
  const copyEl = document.getElementById('loadingCopy');
  const bar = document.getElementById('progressBar');
  const pct = document.getElementById('loadingPercent');

  const subCopy = [
    "this suddenly feels very real.",
    "no take-backs after this.",
    "I promise this is worth the wait.",
    "almost there, stay with me.",
    "okay. okay okay okay.",
    "sending it."
  ];

  let step = 0;
  bar.style.width = '0%';
  pct.textContent = '0%';

  const totalSteps = loadingLines.length;
  const interval = setInterval(() => {
    step++;
    const progress = Math.min(100, Math.round((step / totalSteps) * 100));
    bar.style.width = progress + '%';
    pct.textContent = progress + '%';

    if (step < totalSteps) {
      titleEl.textContent = loadingLines[step];
      copyEl.textContent = subCopy[step];
    }

    if (step >= totalSteps) {
      clearInterval(interval);
      setTimeout(() => {
        showScreen('proposal');
      }, 700);
    }
  }, 850);

  // set initial line immediately
  titleEl.textContent = loadingLines[0];
  copyEl.textContent = subCopy[0];
}

// ============ Proposal: dodging No button ============
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const beggingContainer = document.querySelector('.proposal-buttons');
const begText = document.getElementById('begText');

const noMessages = [
  "noo, please 🥺",
  "wait, really? think again?",
  "you sure about that?",
  "c'mon, give it another thought",
  "my heart says otherwise",
  "the button is shy, try yes instead",
  "okay but yes is right there...",
  "I'll just wait here",
  "please? 🥹",
  "yes is a much better option, promise"
];

let noIndex = 0;
let noEscapeCount = 0;
let yesGrowth = 1;

function moveNoButton(){
  const containerRect = beggingContainer.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = Math.max(0, containerRect.width - btnRect.width - 8);
  const maxY = Math.max(0, 140 - btnRect.height); // allow some vertical roam

  const randX = Math.random() * maxX;
  const randY = (Math.random() * maxY) - (maxY / 2);

  noBtn.style.position = 'absolute';
  noBtn.style.left = randX + 'px';
  noBtn.style.top = randY + 'px';

  noEscapeCount++;
  begText.textContent = noMessages[noIndex % noMessages.length];
  noIndex++;

  // Yes button gets a little more inviting each time, capped so it stays cute not cringe
  yesGrowth = Math.min(1.35, 1 + noEscapeCount * 0.045);
  yesBtn.style.transform = `scale(${yesGrowth})`;
}

// Trigger dodge on hover (desktop) and on click/touch (mobile-friendly)
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });

// ============ Yes! ============
yesBtn.addEventListener('click', () => {
  showScreen('success');
  launchConfetti();
  if (musicStarted === false) {
    // try to start music gently as a nice touch, ignore failure silently
    bgMusic.play().then(() => {
      musicStarted = true;
      musicToggle.classList.remove('hidden');
      musicToggle.classList.add('playing');
      musicToggle.querySelector('.music-label').textContent = 'pause the song';
    }).catch(() => {});
  }
});

// ============ Confetti ============
function launchConfetti(){
  const layer = document.getElementById('confettiLayer');
  layer.innerHTML = '';
  const colors = ['#ff8fc4', '#f26fae', '#e8b872', '#ffd3e6', '#ffb3d6'];
  const pieceCount = 60;

  for (let i = 0; i < pieceCount; i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.6) + 's';
    piece.style.animationDuration = (2 + Math.random() * 1.2) + 's';
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(piece);
  }

  setTimeout(() => { layer.innerHTML = ''; }, 3200);
}
