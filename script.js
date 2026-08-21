function startJourney() {
    document.getElementById("intro").classList.add("hidden");
    document.getElementById("choiceScreen").classList.remove("hidden");
}

function showCards() {
    document.getElementById("choiceScreen").classList.add("hidden");
    document.getElementById("cardsSection").classList.remove("hidden");
}

const loadingMessages = [
    "Okay... don't panic...",
    "Trying to look confident...",
    "This suddenly feels very real...",
    "Taking a deep breath...",
    "Just a few more seconds...",
    "Alright... here goes..."
];

function startLoading() {

    document.getElementById("cardsSection").classList.add("hidden");
    document.getElementById("loadingScreen").classList.remove("hidden");

    let i = 0;

    const text = document.getElementById("loadingText");

    const interval = setInterval(() => {

        text.innerText = loadingMessages[i];

        i++;

        if(i >= loadingMessages.length){

            clearInterval(interval);

            setTimeout(() => {

                document.getElementById("loadingScreen").classList.add("hidden");

                document.getElementById("proposalScreen").classList.remove("hidden");

            },1000);
        }

    },1200);
}

const noTexts = [
    "Nooo, read that again 🥹",
    "Are you absolutely sure? 😭",
    "That button seems suspicious",
    "Try the pink one maybe 👀",
    "Please don't break my tiny heart",
    "I prepared for one answer only 😭"
];

const noBtn = document.getElementById("noBtn");

let count = 0;

document.addEventListener("mouseover", function(e){

    if(e.target.id === "noBtn"){

        const maxX = window.innerWidth - 150;
        const maxY = window.innerHeight - 100;

        noBtn.style.position = "fixed";
        noBtn.style.left = Math.random() * maxX + "px";
        noBtn.style.top = Math.random() * maxY + "px";

        document.getElementById("begText").innerText =
            noTexts[count % noTexts.length];

        count++;
    }

});

function yesClicked(){

    document.getElementById("proposalScreen").classList.add("hidden");

    document.getElementById("successScreen").classList.remove("hidden");

}
