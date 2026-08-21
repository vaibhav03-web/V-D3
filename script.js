/* =====================================================
   NAVIGATION
===================================================== */

const screens =
  [...document.querySelectorAll(".screen")];


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


/* =====================================================
   MUSIC
===================================================== */

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

      musicToggle.classList.add(
        "hidden"
      );

    }
  );


  music.addEventListener(
    "canplay",
    () => {

      musicToggle.classList.remove(
        "hidden"
      );

    }
  );

}


function startMusic(){

  if(
    !musicAvailable ||
    !music
  ){
    return;
  }


  music.volume = .32;


  music.play()
    .then(() => {

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

      startMusic();

    }else{

      music.pause();

      musicToggle
        .querySelector(".music-label")
        .textContent =
        "song";

    }

  }
);


/* =====================================================
   INTRO
===================================================== */

document
  .getElementById("startBtn")
  .addEventListener(
    "click",
    () => {

      startMusic();

      createBurst();

      setTimeout(
        () => {
          showScreen("choice");
        },
        250
      );

    }
  );


/* =====================================================
   CHOICE DOORS
===================================================== */

const messages = {

  little:
    "You probably don't realize how often you make an ordinary moment feel a little better just by being there.",

  secret:
    "Tiny secret: I have definitely caught myself smiling at my phone because of you. More than once.",

  random:
    "Random fact: talking to you has an oddly reliable ability to improve my mood.",

  warning:
    "Small warning: there is a question waiting at the end of this. I've been nervous about it for a while."

};


const doors =
  document.querySelectorAll(".door");


doors.forEach(door => {

  door.addEventListener(
    "click",
    () => {

      doors.forEach(d => {
        d.classList.remove("chosen");
      });


      door.classList.add(
        "chosen"
      );


      document
        .getElementById("letterText")
        .textContent =
        messages[
          door.dataset.choice
        ];


      const wrap =
        document.getElementById(
          "letterWrap"
        );


      wrap.classList.remove(
        "hidden"
      );


      createBurst();


      setTimeout(
        () => {

          wrap.scrollIntoView({
            behavior:"smooth",
            block:"center"
          });

        },
        100
      );

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


/* =====================================================
   REAL CARD REVEALS
===================================================== */

const cards =
  document.querySelectorAll(
    ".collectible"
  );


let openedCards = 0;


cards.forEach(card => {

  card.addEventListener(
    "click",
    () => {

      /*
        IMPORTANT:
        We are not using a CSS flip anymore.

        The card starts with ONLY the
        front design.

        Once clicked, JavaScript replaces
        the content with the hidden
        compliment.

        That eliminates the previous
        "both sides are visible" glitch.
      */

      if(
        card.classList.contains(
          "opened"
        )
      ){

        return;

      }


      const message =
        card.dataset.message;


      const cover =
        card.querySelector(
          ".collectible-cover"
        );


      cover.innerHTML = `

        <span class="card-num">
          opened
        </span>

        <span class="card-star">
          ♡
        </span>

        <strong>
          ${message}
        </strong>

        <small>
          keep this one
        </small>

      `;


      card.classList.add(
        "opened"
      );


      openedCards++;


      document
        .querySelector(
          ".progress-count"
        )
        .textContent =
        openedCards;


      createBurst();


      if(openedCards === 6){

        setTimeout(
          () => {

            const hidden =
              document.getElementById(
                "hiddenMessage"
              );


            hidden.classList.remove(
              "hidden"
            );


            setTimeout(
              () => {

                hidden.classList.add(
                  "revealed"
                );

              },
              80
            );


            createMassiveBurst();

          },
          500
        );

      }

    }
  );

});


/* =====================================================
   SUSPENSE
===================================================== */

const loadingSteps = [

  {
    title:
      "okay...",
    copy:
      "this suddenly feels a little more real."
  },

  {
    title:
      "don't panic.",
    copy:
      "I'm definitely not panicking."
  },

  {
    title:
      "actually...",
    copy:
      "I might be panicking a little."
  },

  {
    title:
      "one second.",
    copy:
      "I want to ask this properly."
  },

  {
    title:
      "thinking...",
    copy:
      "about how to say this without making it weird."
  },

  {
    title:
      "almost there...",
    copy:
      "okay. deep breath."
  },

  {
    title:
      "right.",
    copy:
      "I think I'm ready."
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


  function nextStep(){

    if(
      step >=
      loadingSteps.length
    ){

      finishSuspense();

      return;

    }


    const current =
      loadingSteps[step];


    title.style.opacity =
      "0";

    copy.style.opacity =
      "0";


    setTimeout(
      () => {

        title.textContent =
          current.title;

        copy.textContent =
          current.copy;


        title.style.opacity =
          "1";

        copy.style.opacity =
          "1";

      },
      300
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
      3.6 seconds per message.
      Roughly 28 seconds total.
    */

    setTimeout(
      nextStep,
      3600
    );

  }


  nextStep();

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
    Long final pause.
  */

  setTimeout(
    () => {

      createMassiveBurst();


      setTimeout(
        () => {

          showScreen(
            "proposal"
          );

        },
        1400
      );

    },
    3200
  );

}


/* =====================================================
   NO BUTTON
===================================================== */

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

  "that button is suspiciously difficult to catch.",

  "I'm choosing to believe that was an accident.",

  "please don't make me use my final trick.",

  "the other button is literally right there ♡"

];


let noCount = 0;


function dodgeNo(){

  noCount++;


  begText.textContent =
    noMessages[
      (noCount - 1) %
      noMessages.length
    ];


  let x;
  let y;


  if(
    window.innerWidth < 600
  ){

    x =
      Math.random() * 130 - 65;

    y =
      Math.random() * 90 - 45;

  }

  else{

    x =
      Math.random() * 300 - 150;

    y =
      Math.random() * 130 - 65;

  }


  noBtn.style.transform =
    `translate(${x}px,${y}px)`;


  createTinySparkle();

}


noBtn.addEventListener(
  "mouseenter",
  dodgeNo
);


noBtn.addEventListener(
  "click",
  dodgeNo
);


/* =====================================================
   YES
===================================================== */

document
  .getElementById("yesBtn")
  .addEventListener(
    "click",
    () => {

      startMusic();

      showScreen("success");

      createMassiveBurst();

      celebrate();

    }
  );


/* =====================================================
   CELEBRATION
===================================================== */

function celebrate(){

  const layer =
    document.getElementById(
      "confettiLayer"
    );


  layer.innerHTML = "";


  const symbols = [
    "♡",
    "✦",
    "✧",
    "❀",
    "♥",
    "·"
  ];


  const colors = [
    "#d979a1",
    "#9785bb",
    "#84a5be",
    "#c8a269",
    "#ca789b"
  ];


  for(
    let i = 0;
    i < 100;
    i++
  ){

    const item =
      document.createElement(
        "span"
      );


    item.className =
      "confetti";


    item.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    item.style.left =
      `${Math.random() * 100}%`;


    item.style.color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];


    item.style.fontSize =
      `${10 + Math.random() * 17}px`;


    item.style.animationDelay =
      `${Math.random() * 1.5}s`;


    item.style.animationDuration =
      `${3 + Math.random() * 2.5}s`;


    layer.appendChild(
      item
    );

  }

}


/* =====================================================
   SPARKLES
===================================================== */

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
    `${20 + Math.random() * 60}%`;


  document.body.appendChild(
    sparkle
  );


  setTimeout(
    () => {

      sparkle.remove();

    },
    2800
  );

}


function createSparkles(){

  for(
    let i = 0;
    i < 5;
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
    i < 10;
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
    i < 45;
    i++
  ){

    setTimeout(
      createTinySparkle,
      i * 27
    );

  }

}


/* =====================================================
   SECRET MOON
===================================================== */

const moon =
  document.querySelector(".moon");

let moonClicks = 0;


moon.addEventListener(
  "click",
  () => {

    moonClicks++;


    if(
      moonClicks !== 3
    ){
      return;
    }


    moonClicks = 0;


    const secret =
      document.createElement(
        "div"
      );


    secret.className =
      "moon-secret";


    secret.innerHTML = `

      <span>
        you found the moon secret 🌙
      </span>

      <strong>
        okay, you're cute too.
      </strong>

    `;


    document.body.appendChild(
      secret
    );


    setTimeout(
      () => {

        secret.classList.add(
          "show"
        );

      },
      60
    );


    createMassiveBurst();


    setTimeout(
      () => {

        secret.classList.remove(
          "show"
        );


        setTimeout(
          () => {
            secret.remove();
          },
          500
        );

      },
      3500
    );

  }
);


/* =====================================================
   STARTUP
===================================================== */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      createSparkles,
      500
    );

  }
);
