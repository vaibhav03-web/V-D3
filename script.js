/* =========================================
   SCREEN NAVIGATION
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

}


/* =========================================
   OPTIONAL MUSIC
   =========================================

   Put this file beside the other files:

   song.mp3

   You do NOT need to change the code.

   The music button automatically appears
   when the MP3 exists.

   Browsers may block automatic playback,
   so the first click on the website
   starts the music.
   ========================================= */

const music =
  document.getElementById("bgMusic");


const musicToggle =
  document.getElementById("musicToggle");


let musicAvailable = true;


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

      musicToggle.classList.remove("hidden");

    }

  }
);


function tryStartMusic(){

  if(!musicAvailable){
    return;
  }


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

    .catch(() => {

      /*
        Browser blocked autoplay.
        The site continues normally.
      */

    });

}


function toggleMusic(){

  if(!musicAvailable){
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


  }else{

    music.pause();


    musicToggle
      .querySelector(".music-label")
      .textContent =
      "music off";

  }

}


musicToggle.addEventListener(
  "click",
  toggleMusic
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

      showScreen("choice");

    }
  );


/* =========================================
   CHOICE / REVEAL
   ========================================= */

const revealMessages = {

  little:
    "You probably don't realize how often you make an ordinary moment feel a little better just by being there.",

  secret:
    "Tiny secret: I have definitely caught myself smiling at my phone because of you. More than once.",

  random:
    "Random fact: talking to you has an oddly reliable ability to improve my mood.",

  warning:
    "Small warning: there is a question waiting at the end of this. I have been nervous about it for a while."

};


document
  .querySelectorAll(".choice-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

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


        card.classList.add(
          "selected"
        );


        setTimeout(() => {

          revealArea.scrollIntoView({

            behavior:"smooth",

            block:"center"

          });

        },80);

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
   MEMORY CARDS
   ========================================= */

document
  .querySelectorAll(".memory-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        card.classList.toggle(
          "flipped"
        );


        const hint =
          card.querySelector(
            ".memory-hint"
          );


        if(
          card.classList.contains(
            "flipped"
          )
        ){

          hint.textContent =
            "keep this one";

        }else{

          hint.textContent =
            "tap to read";

        }

      }
    );

  });


/* =========================================
   LOADING / COURAGE
   ========================================= */

const loadingSteps = [

  [
    "collecting courage...",
    "this seemed much easier in my head."
  ],

  [
    "re-reading everything...",
    "okay, don't overthink this."
  ],

  [
    "panicking a little...",
    "completely normal. probably."
  ],

  [
    "taking a breath...",
    "you've got this."
  ],

  [
    "almost there...",
    "one last deep breath."
  ],

  [
    "okay, here goes...",
    "no turning back now."
  ]

];


document
  .getElementById("askBtn")
  .addEventListener(
    "click",
    () => {

      showScreen("loading");


      const title =
        document.getElementById(
          "loadingTitle"
        );


      const copy =
        document.getElementById(
          "loadingCopy"
        );


      const percent =
        document.getElementById(
          "loadingPercent"
        );


      const bar =
        document.getElementById(
          "progressBar"
        );


      let progress = 0;


      const tick =
        setInterval(
          () => {

            progress +=
              Math.floor(
                Math.random() * 10
              ) + 8;


            if(progress > 100){

              progress = 100;

            }


            const messageIndex =
              Math.min(

                Math.floor(
                  progress /
                  (100 / loadingSteps.length)
                ),

                loadingSteps.length - 1

              );


            title.textContent =
              loadingSteps[
                messageIndex
              ][0];


            copy.textContent =
              loadingSteps[
                messageIndex
              ][1];


            percent.textContent =
              `${progress}%`;


            bar.style.width =
              `${progress}%`;


            if(progress >= 100){

              clearInterval(tick);


              setTimeout(
                () => {

                  showScreen(
                    "proposal"
                  );

                },
                900
              );

            }

          },

          420

        );

    }
  );


/* =========================================
   PLAYFUL NO BUTTON
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

  "nooo, I don't think that's the button I meant 🥹",

  "wait wait, maybe try the other one?",

  "are you sure? I'm already nervous 😭",

  "that button is getting suspiciously difficult to click",

  "please don't choose chaos today",

  "I spent so much time making the other button prettier",

  "okay... I can take a hint. maybe. 🥺",

  "one more chance?",

  "the pink one is looking very hopeful right now"

];


let noCount = 0;


function moveNoButton(){

  if(
    window.innerWidth < 560
  ){

    noBtn.style.transform =
      `translateX(${
        (Math.random() * 120) - 60
      }px)`;

  }else{

    const parent =
      noBtn.parentElement
        .getBoundingClientRect();


    const btnRect =
      noBtn.getBoundingClientRect();


    const maxX =
      Math.max(

        60,

        parent.width -
        btnRect.width -
        20

      );


    const x =
      Math.random() * maxX -
      maxX / 2;


    noBtn.style.transform =
      `translateX(${x}px)`;

  }


  begText.textContent =
    noMessages[
      noCount %
      noMessages.length
    ];


  noCount++;

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
   YES BUTTON
   ========================================= */

document
  .getElementById("yesBtn")
  .addEventListener(
    "click",
    () => {

      showScreen("success");

      startCelebration();


      if(
        musicAvailable &&
        music.paused
      ){

        tryStartMusic();

      }

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
    "✦",
    "✧",
    "•",
    "♥",
    "❀"

  ];


  const colors = [

    "#d979a5",
    "#e4a7c1",
    "#b58aa7",
    "#d5b4c9",
    "#c96d97"

  ];


  for(
    let i = 0;
    i < 65;
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
      `${10 + Math.random() * 15}px`;


    piece.style.animationDelay =
      `${Math.random() * 1.8}s`;


    piece.style.animationDuration =
      `${2.7 + Math.random() * 2}s`;


    layer.appendChild(
      piece
    );

  }

}
