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

"Nooo 🥹",
"Are you sure? 😭",
"Try the pink one 👀",
"Please don't break my tiny heart 💔",
"I prepared for one answer only 😭",
"That button looks suspicious"

];

let count = 0;

document.addEventListener("mouseover",function(e){

if(e.target.id === "noBtn"){

const btn = document.getElementById("noBtn");

btn.style.position = "fixed";

btn.style.left =
Math.random() * (window.innerWidth - 150) + "px";

btn.style.top =
Math.random() * (window.innerHeight - 100) + "px";

document.getElementById("begText").innerText =
noTexts[count % noTexts.length];

count++;

}

});

function yesClicked(){

document.getElementById("proposalScreen").classList.add("hidden");

document.getElementById("successScreen").classList.remove("hidden");

}
