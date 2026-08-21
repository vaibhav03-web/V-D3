/* =========================================================
   DREAMY PROPOSAL SITE - INTERACTION CONTROLLER
   ========================================================= */

const screens = [...document.querySelectorAll(".screen")];

/* maps each screen id to a step in the progress dots
   ("loading" shares the same step as "proposal" since
   it's just the suspense on the way there) */
const stepMap = {
  intro: 0,
  choice: 1,
  cards: 2,
  loading: 3,
  proposal: 3,
  success: 4
};

const dots = [...document.querySelectorAll(".progress-dots .dot")];

function updateDots(id) {
  const step = stepMap[id] ?? 0;

  dots.forEach((dot, i) => {
    dot.classList.remove("active", "done");

    if (i < step) {
      dot.classList.add("done");
    } else if (i === step) {
      dot.classList.add("active");
    }
  });
}

function showScreen(id) {
  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  updateDots(id);

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

        const label =
          musicToggle.querySelector(".music-label");

        if (label) {
          label.textContent = "music on ♫";
        }
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

          const label =
            musicToggle.querySelector(".music-label");

          if (label) {
            label.textContent = "music on ♫";
          }

        })
        .catch(() => {});

    } else {

      music.pause();

      const label =
        musicToggle.querySelector(".music-label");

      if (label) {
        label.textContent = "music off";
      }

    }

  });
}


/* =========================================================
   INTRO
   ========================================================= */

const startBtn =
  document.getElementById("startBtn");

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

const choiceCards =
  document.querySelectorAll(".choice-card");

choiceCards.forEach(card => {

  card.addEventListener("click", () => {

    const choice = card.dataset.choice;

    choiceCards.forEach(c => {
      c.classList.remove("selected");
    });

    card.classList.add("selected");

    const revealArea =
      document.getElementById("revealArea");

    const revealText =
      document.getElementById("revealText");

    if (revealText) {
      revealText.textContent =
        revealMessages[choice];
    }

    if (revealArea) {

      revealArea.classList.remove("hidden");

      revealArea.classList.add("revealing");

      setTimeout(() => {

        revealArea.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

      }, 150);

    }

    createBurst();

  });

});


const choiceContinue =
  document.getElementById("choiceContinue");

if (choiceContinue) {

  choiceContinue.addEventListener("click", () => {

    showScreen("cards");

  });

}


/* =========================================================
   MEMORY CARDS
   ========================================================= */

const memoryCards =
  document.querySelectorAll(".memory-card");

memoryCards.forEach((card, index) => {

  card.addEventListener("click", () => {

    card.classList.toggle("flipped");

    const hint =
      card.querySelector(".memory-hint");

    if (hint) {

      if (card.classList.contains("flipped")) {
        hint.textContent = "keep this one ♡";
      } else {
        hint.textContent = "tap to read";
      }

    }

    createBurst();

    /*
      Small surprise:
      once most cards are opened,
      reveal a hidden bonus message.
    */

    const flipped =
      document.querySelectorAll(".memory-card.flipped");

    if (flipped.length === memoryCards.length - 1) {
      unlockSecretMessage();
    }

  });

});


function unlockSecretMessage() {

  if (document.getElementById("secretMessage")) {
    return;
  }

  const message =
    document.createElement("div");

  message.id = "secretMessage";

  message.innerHTML = `
    <div class="secret-glow"></div>
    <span>one more thing...</span>
    <strong>you're really easy to like.</strong>
  `;

  document
    .getElementById("cards")
    .appendChild(message);

  setTimeout(() => {
    message.classList.add("show");
  }, 100);

  createBurst();
}


/* =========================================================
   LOADING / SUSPENSE
   ========================================================= */

const loadingSteps = [

  {
    title: "okay...",
    copy: "this suddenly feels a little more real."
  },

  {
    title: "don't panic.",
    copy: "I'm definitely not panicking."
  },

  {
    title: "taking a breath...",
    copy: "one second. I want to ask this properly."
  },

  {
    title: "almost there...",
    copy: "please be patient with my nervousness."
  },

  {
    title: "okay.",
    copy: "I think I'm ready."
  }

];


const askBtn =
  document.getElementById("askBtn");

if (askBtn) {

  askBtn.addEventListener("click", startSuspense);

}


function startSuspense() {

  showScreen("loading");

  const title =
    document.getElementById("loadingTitle");

  const copy =
    document.getElementById("loadingCopy");

  const bar =
    document.getElementById("progressBar");

  const percent =
    document.getElementById("loadingPercent");

  /*
    Deliberately unhurried, but not endless:
    around 12-14 seconds total.
  */

  let step = 0;

  const stepDuration = 2400;

  function showStep() {

    if (step >= loadingSteps.length) {

      finishSuspense();

      return;
    }

    const current =
      loadingSteps[step];

    if (title) {
      title.style.opacity = "0";
    }

    if (copy) {
      copy.style.opacity = "0";
    }

    setTimeout(() => {

      if (title) {
        title.textContent =
          current.title;

        title.style.opacity = "1";
      }

      if (copy) {
        copy.textContent =
          current.copy;

        copy.style.opacity = "1";
      }

    }, 250);

    const nextProgress =
      Math.round(
        ((step + 1) /
          loadingSteps.length) *
          94
      );

    if (bar) {
      bar.style.width =
        `${nextProgress}%`;
    }

    if (percent) {
      percent.textContent =
        `${nextProgress}%`;
    }

    createTinySparkle();

    step++;

    setTimeout(showStep, stepDuration);

  }

  showStep();

}


function finishSuspense() {

  const title =
    document.getElementById("loadingTitle");

  const copy =
    document.getElementById("loadingCopy");

  const bar =
    document.getElementById("progressBar");

  const percent =
    document.getElementById("loadingPercent");

  if (title) {
    title.textContent = "one last thing...";
  }

  if (copy) {
    copy.textContent =
      "okay. here we go.";
  }

  if (bar) {
    bar.style.width = "100%";
  }

  if (percent) {
    percent.textContent = "100%";
  }

  /*
    Hold the final suspense
    before showing the question.
  */

  setTimeout(() => {

    createMassiveBurst();

    setTimeout(() => {

      showScreen("proposal");

    }, 1200);

  }, 2000);

}


/* =========================================================
   PROPOSAL
   ========================================================= */

const noBtn =
  document.getElementById("noBtn");

const begText =
  document.getElementById("begText");

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

  noBtn.addEventListener(
    "mouseenter",
    dodgeNoButton
  );

  noBtn.addEventListener(
    "click",
    dodgeNoButton
  );

}


function dodgeNoButton() {

  noCount++;

  if (begText) {

    begText.textContent =
      noMessages[
        (noCount - 1) %
        noMessages.length
      ];

  }


  if (window.innerWidth < 600) {

    const x =
      (Math.random() * 120) - 60;

    const y =
      (Math.random() * 80) - 40;

    noBtn.style.transform =
      `translate(${x}px, ${y}px)`;

  } else {

    const x =
      (Math.random() * 280) - 140;

    const y =
      (Math.random() * 120) - 60;

    noBtn.style.transform =
      `translate(${x}px, ${y}px)`;

  }

  createTinySparkle();

}


/* =========================================================
   YES
   ========================================================= */

const yesBtn =
  document.getElementById("yesBtn");

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

  const layer =
    document.getElementById(
      "confettiLayer"
    );

  if (!layer) {
    return;
  }

  layer.innerHTML = "";

  const symbols = [
    "♡",
    "♥",
    "✦",
    "✧",
    "❀",
    "·"
  ];

  const colors = [
    "#d979a5",
    "#e4a7c1",
    "#b58aa7",
    "#d5b4c9",
    "#c96d97"
  ];

  for (
    let i = 0;
    i < 90;
    i++
  ) {

    const piece =
      document.createElement("span");

    piece.className =
      "confetti";

    piece.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];

    piece.style.left =
      `${Math.random() * 100}%`;

    piece.style.color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    piece.style.fontSize =
      `${10 + Math.random() * 18}px`;

    piece.style.animationDelay =
      `${Math.random() * 1.7}s`;

    piece.style.animationDuration =
      `${3 + Math.random() * 2.5}s`;

    layer.appendChild(piece);

  }

}


/* =========================================================
   PARTICLES / SPARKLES
   ========================================================= */

function createSparkles() {

  for (let i = 0; i < 5; i++) {
    createTinySparkle();
  }

}


function createTinySparkle() {

  const sparkle =
    document.createElement("div");

  sparkle.className =
    "floating-sparkle";

  sparkle.textContent =
    Math.random() > 0.5
      ? "✦"
      : "♡";

  sparkle.style.left =
    `${20 + Math.random() * 60}%`;

  sparkle.style.top =
    `${25 + Math.random() * 50}%`;

  sparkle.style.animationDuration =
    `${2 + Math.random() * 2}s`;

  document.body.appendChild(
    sparkle
  );

  setTimeout(() => {
    sparkle.remove();
  }, 4000);

}


function createBurst() {

  for (let i = 0; i < 12; i++) {

    setTimeout(() => {

      createTinySparkle();

    }, i * 35);

  }

}


function createMassiveBurst() {

  for (let i = 0; i < 50; i++) {

    setTimeout(() => {

      createTinySparkle();

    }, i * 30);

  }

}


/* =========================================================
   CURSOR HEART TRAIL
   (a light, occasional trail — not on every pixel moved)
   ========================================================= */

let lastHeartTime = 0;

document.addEventListener("mousemove", (e) => {

  const now = Date.now();

  if (now - lastHeartTime < 140) {
    return;
  }

  lastHeartTime = now;

  const heart =
    document.createElement("div");

  heart.className = "cursor-heart";

  heart.textContent = "♡";

  heart.style.left = `${e.clientX}px`;
  heart.style.top = `${e.clientY}px`;

  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 900);

});


/* =========================================================
   LITTLE EASTER EGG
   ========================================================= */

/*
   Click the moon three times.
*/

const moon =
  document.querySelector(".moon");

let moonClicks = 0;

if (moon) {

  moon.addEventListener("click", () => {

    moonClicks++;

    if (moonClicks === 3) {

      moonClicks = 0;

      const note =
        document.createElement("div");

      note.className =
        "moon-secret";

      note.innerHTML = `
        <span>you found the secret 🌙</span>
        <strong>okay, you're cute too.</strong>
      `;

      document.body.appendChild(
        note
      );

      setTimeout(() => {
        note.classList.add("show");
      }, 50);

      createMassiveBurst();

      setTimeout(() => {

        note.classList.remove("show");

        setTimeout(() => {
          note.remove();
        }, 500);

      }, 3500);

    }

  });

}


/* =========================================================
   INITIAL ATMOSPHERE
   ========================================================= */

window.addEventListener(
  "load",
  () => {

    updateDots("intro");

    setTimeout(() => {
      createSparkles();
    }, 600);

  }
);
