/* =========================================
   NAVIGATION
========================================= */

const screens = [
  ...document.querySelectorAll(".screen")
];


function showScreen(id){

  screens.forEach(screen => {
    screen.classList.remove("active");
  });


  const target =
    document.getElementById(id);


  if(target){
    target.classList.add("active");
  }


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  createSparkles();
}


/* =========================================
   MUSIC
========================================= */

const music =
  document.getElementById("bgMusic");

const musicToggle =
  document.getElementById("musicToggle");

let musicAvailable = true;


if(music){

  music.addEventListener(
    "error",
    () => {

      musicAvailable = false;

      musicToggle.classList.add("hidden");

    }
  );


  music.addEventListener(
    "canplay",
    () => {

      if(musicAvailable){

        musicToggle.classList.remove(
          "hidden"
        );

      }

    }
  );

}


function tryStartMusic(){

  if(
    !musicAvailable ||
    !music
  ){
    return;
  }


  music.volume = .35;


  music.play()

    .then(() => {

      musicToggle.classList.remove(
        "hidden"
      );

      musicToggle
        .querySelector(".music-label")
        .textContent =
        "music on ♫";

    })

    .catch(() => {});

}


musicToggle.addEventListener(
  "click",
  () => {

    if(
      !musicAvailable ||
      !music
    ){
      return;
    }


    if(music.paused){

      music.play()
        .then(() => {

          musicToggle
            .querySelector(".music-label")
            .textContent =
            "music on ♫";

        })
        .catch(() => {});

    }

    else{

      music.pause();

      musicToggle
        .querySelector(".music-label")
        .textContent =
        "music off";

    }

  }
);


/* =========================================
   INTRO
========================================= */

document
  .getElementById("startBtn")
  .addEventListener(
    "click",
    () => {

      tryStartMusic();

      createBurst();

      setTimeout(
        () => showScreen("choice"),
        250
      );

    }
  );


/* =========================================
   CHOICE
========================================= */

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
  document.querySelectorAll(
    ".choice-card"
  );


choiceCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      choiceCards.forEach(c => {
        c.classList.remove("selected");
      });


      card.classList.add("selected");


      const choice =
        card.dataset.choice;


      document
        .getElementById("revealText")
        .textContent =
        revealMessages[choice];


      const revealArea =
        document.getElementById(
          "revealArea"
        );


      revealArea.classList.remove(
        "hidden"
      );


      setTimeout(
        () => {

          revealArea.scrollIntoView({
            behavior:"smooth",
            block:"center"
          });

        },
        100
      );


      createBurst();

    }
  );

});


document
  .getElementById("choiceContinue")
  .addEventListener(
    "click",
    () => {

      showScreen("cards");

    }
  );


/* =========================================
   REAL FLIP CARDS
========================================= */

const memoryCards =
  document.querySelectorAll(
    ".memory-card"
  );


memoryCards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      card.classList.toggle(
        "flipped"
      );


      createBurst();


      const opened =
        document.querySelectorAll(
          ".memory-card.flipped"
        );


      if(opened.length >= 3){

        unlockSecret();

      }

    }
  );

});


function unlockSecret(){

  const secret =
    document.getElementById(
      "secretMessage"
    );


  if(
    secret.classList.contains("show")
  ){
    return;
  }


  secret.classList.add("show");

  createMassiveBurst();

}


/* =========================================
   SLOW SUSPENSE LOADING
========================================= */

const loadingSteps = [

  {
    title:"okay...",
    copy:"this suddenly feels a little more real."
  },

  {
    title:"don't panic.",
    copy:"I'm definitely not panicking."
  },

  {
    title:"actually...",
    copy:"I might be panicking a little."
  },

  {
    title:"taking a breath...",
    copy:"one second. I want to ask this properly."
  },

  {
    title:"thinking...",
    copy:"about how to say this without making it weird."
  },

  {
    title:"almost there...",
    copy:"please be patient with my nervousness."
  },

  {
    title:"okay.",
    copy:"I think I'm ready."
  }

];


document
  .getElementById("askBtn")
  .addEventListener(
    "click",
    startSuspense
  );


function startSuspense(){

  showScreen("loading");


  const title =
    document.getElementById(
      "loadingTitle"
    );


  const copy =
    document.getElementById(
      "loadingCopy"
    );


  const bar =
    document.getElementById(
      "progressBar"
    );


  const percent =
    document.getElementById(
      "loadingPercent"
    );


  let step = 0;


  function showStep(){

    if(
      step >=
      loadingSteps.length
    ){

      finishSuspense();

      return;

    }


    const current =
      loadingSteps[step];


    title.style.opacity = "0";
    copy.style.opacity = "0";


    setTimeout(
      () => {

        title.textContent =
          current.title;

        copy.textContent =
          current.copy;


        title.style.opacity = "1";
        copy.style.opacity = "1";

      },
      250
    );


    const progress =
      Math.round(

        ((step + 1) /
          loadingSteps.length)
        * 94

      );


    bar.style.width =
      `${progress}%`;


    percent.textContent =
      `${progress}%`;


    createTinySparkle();


    step++;


    /*
      Each message stays for
      3.4 seconds so there is
      actually time to read it.
    */

    setTimeout(
      showStep,
      3400
    );

  }


  showStep();

}


function finishSuspense(){

  const title =
    document.getElementById(
      "loadingTitle"
    );


  const copy =
    document.getElementById(
      "loadingCopy"
    );


  const bar =
    document.getElementById(
      "progressBar"
    );


  const percent =
    document.getElementById(
      "loadingPercent"
    );


  title.textContent =
    "one last thing...";


  copy.textContent =
    "okay. here we go.";


  bar.style.width =
    "100%";


  percent.textContent =
    "100%";


  /*
    Pause after 100%.
    This is the suspense moment.
  */

  setTimeout(
    () => {

      createMassiveBurst();


      setTimeout(
        () => {

          showScreen("proposal");

        },
        1200
      );

    },
    2600
  );

}


/* =========================================
   NO BUTTON
========================================= */

const noBtn =
  document.getElementById(
    "noBtn"
  );


const begText =
  document.getElementById(
    "begText"
  );


const noMessages = [

  "wait... that's not the one I was hoping for 🥹",

  "are you sure?",

  "I feel like we should reconsider this.",

  "you clicked the wrong answer. respectfully.",

  "okay okay... one more try?",

  "that button is suspiciously difficult to click.",

  "I'm choosing to believe that was an accident.",

  "please don't make me use my final trick.",

  "the other button is literally right there ♡"

];


let noCount = 0;


function moveNoButton(){

  noCount++;


  begText.textContent =
    noMessages[
      (noCount - 1) %
      noMessages.length
    ];


  if(
    window.innerWidth < 600
  ){

    const x =
      Math.random() * 120 - 60;


    const y =
      Math.random() * 80 - 40;


    noBtn.style.transform =
      `translate(${x}px,${y}px)`;

  }

  else{

    const x =
      Math.random() * 280 - 140;


    const y =
      Math.random() * 120 - 60;


    noBtn.style.transform =
      `translate(${x}px,${y}px)`;

  }


  createTinySparkle();

}


noBtn.addEventListener(
  "mouseenter",
  moveNoButton
);


noBtn.addEventListener(
  "click",
  moveNoButton
);


/* =========================================
   YES
========================================= */

document
  .getElementById("yesBtn")
  .addEventListener(
    "click",
    () => {

      tryStartMusic();

      createMassiveBurst();

      showScreen("success");

      startCelebration();

    }
  );


/* =========================================
   CONFETTI
========================================= */

function startCelebration(){

  const layer =
    document.getElementById(
      "confettiLayer"
    );


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
    "#9a87be",
    "#87a5bf",
    "#d3aa67",
    "#c97699"
  ];


  for(
    let i = 0;
    i < 100;
    i++
  ){

    const piece =
      document.createElement(
        "span"
      );


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
      `${Math.random() * 1.5}s`;


    piece.style.animationDuration =
      `${3 + Math.random() * 2.5}s`;


    layer.appendChild(
      piece
    );

  }

}


/* =========================================
   SPARKLES
========================================= */

function createTinySparkle(){

  const sparkle =
    document.createElement(
      "div"
    );


  sparkle.className =
    "floating-sparkle";


  sparkle.textContent =
    Math.random() > .5
      ? "✦"
      : "♡";


  sparkle.style.left =
    `${20 + Math.random() * 60}%`;


  sparkle.style.top =
    `${25 + Math.random() * 50}%`;


  document.body.appendChild(
    sparkle
  );


  setTimeout(
    () => sparkle.remove(),
    3000
  );

}


function createSparkles(){

  for(
    let i = 0;
    i < 6;
    i++
  ){

    setTimeout(
      createTinySparkle,
      i * 100
    );

  }

}


function createBurst(){

  for(
    let i = 0;
    i < 12;
    i++
  ){

    setTimeout(
      createTinySparkle,
      i * 35
    );

  }

}


function createMassiveBurst(){

  for(
    let i = 0;
    i < 55;
    i++
  ){

    setTimeout(
      createTinySparkle,
      i * 25
    );

  }

}


/* =========================================
   MOON EASTER EGG
========================================= */

const moon =
  document.querySelector(".moon");


let moonClicks = 0;


moon.addEventListener(
  "click",
  () => {

    moonClicks++;


    if(moonClicks === 3){

      moonClicks = 0;


      const note =
        document.createElement(
          "div"
        );


      note.className =
        "moon-secret";


      note.innerHTML = `
        <span>you found the secret 🌙</span>
        <strong>okay, you're cute too.</strong>
      `;


      document.body.appendChild(
        note
      );


      setTimeout(
        () => {

          note.classList.add(
            "show"
          );

        },
        50
      );


      createMassiveBurst();


      setTimeout(
        () => {

          note.classList.remove(
            "show"
          );


          setTimeout(
            () => note.remove(),
            500
          );

        },
        3500
      );

    }

  }
);


/* =========================================
   STARTING ATMOSPHERE
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      createSparkles,
      500
    );

  }
);
