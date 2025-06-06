/*const game_window = document.getElementsByTagName("game");
const cards_container = document.getElementById(
  "cards_container"
) as HTMLElement;
const tracker = document.getElementById("tracker") as HTMLElement;
const overlay = document.getElementById("overlay") as HTMLElement;
const restart_button = document.getElementById("restart") as HTMLElement;

const cardAmount = 16;
const cardIcons = ["💯", "💸", "🤣", "💀", "🤮", "❤", "🎶", "🔥"];

const shuffleArray = (arr: Array<string>) => {
  return arr.sort(() => {
    return Math.random() - 0.5;
  });
};

let shuffledArray = shuffleArray(cardIcons.concat(cardIcons));

let inTimeout = false;

const neededPairs = cardAmount / 2;
let pairsFound = 0;
let tries = 0;

// the first selected card of a selection pair
let match: HTMLElement | null = null;

const validateMatch = (currentCard: HTMLElement) => {
  if (!match) return;
  tries++;
  const isMatch = match.innerHTML == currentCard.innerHTML;
  if (isMatch) {
    pairsFound++;
    match.classList.add("found");
    currentCard.classList.add("found");
    match = null;
    //ending case
    if (pairsFound == neededPairs) {
      overlay.style.display = "flex";
    }
  } else {
    inTimeout = true;
    match.classList.add("wrong");
    currentCard.classList.add("wrong");
    setTimeout(() => {
      if (!match) return;
      match.classList.remove("flipped", "wrong");
      match = null;
      currentCard.classList.remove("flipped", "wrong");
      inTimeout = false;
    }, 1000);
  }
  tracker.innerHTML = `Pairs found: ${pairsFound} | Tries: ${tries}`;
};

const renderCards = () => {
  if (cardAmount % 2 != 0) {
    return console.error(
      `CardAmount is set to ${cardAmount} which does not allow pairs`
    );
  }

  if (cardAmount / 2 > cardIcons.length) {
    return console.error(
      `CardAmount is set to ${cardAmount} which would exceed maximum possible pairs`
    );
  }

  for (let i = 0; i < cardAmount; i++) {
    const newCard = document.createElement("Card");
    const cardText = document.createElement("p");
    cardText.innerHTML = shuffledArray[i];
    newCard.appendChild(cardText);
    newCard.onclick = () => {
      //return cases
      if (inTimeout) return;
      if (newCard.classList.contains("flipped")) return;

      newCard.classList.add("flipped");
      if (!match) {
        match = newCard;
      } else {
        validateMatch(newCard);
      }
    };
    cards_container.appendChild(newCard);
  }
};

restart_button.onclick = () => {
  shuffledArray = shuffleArray(cardIcons.concat(cardIcons));
  const cards = Array.from(cards_container.children);
  for (let i = 0; i < cardAmount; i++) {
    cards[i].classList.remove("flipped", "found");
    const cardText = cards[i].firstChild as HTMLElement;
    cardText.innerHTML = shuffledArray[i];
  }
  overlay.style.display = "none";
  pairsFound = 0;
  tries = 0;
  tracker.innerHTML = `Pairs found: ${pairsFound} | Tries: ${tries}`;
};

renderCards();*/
import CardManager from "./modules/Cards.js";
import PlayerManager from "./modules/Players.js";
let inTimeout = false;
// the first selected card of a selection pair
let match = null;
let neededPairs = 0;
let pairsFound = 0;
let tries = 0;
let playerManager;
window.onload = () => {
    //form and input
    const startButton = document.getElementById("start");
    const pairInput = document.getElementById("pairs");
    const name1Input = document.getElementById("name1");
    const name2Input = document.getElementById("name2");
    const modeSelector = document.getElementById("modeSelect");
    //containers and displays
    const tracker = document.getElementById("tracker");
    const overlay = document.getElementById("overlay");
    //card container
    const cardsContainer = document.getElementById("cards_container");
    const validateMatch = (currentCard) => {
        if (!match)
            return;
        tries++;
        const isMatch = match.innerHTML == currentCard.innerHTML;
        if (isMatch) {
            pairsFound++;
            match.classList.add("found");
            currentCard.classList.add("found");
            match = null;
            //ending case
            if (pairsFound == neededPairs) {
                overlay.style.display = "flex";
            }
        }
        else {
            inTimeout = true;
            match.classList.add("wrong");
            currentCard.classList.add("wrong");
            setTimeout(() => {
                if (!match)
                    return;
                match.classList.remove("flipped", "wrong");
                match = null;
                currentCard.classList.remove("flipped", "wrong");
                inTimeout = false;
            }, 1000);
        }
        tracker.innerHTML = `Pairs found: ${pairsFound} | Tries: ${tries}`;
    };
    const startGame = () => {
        let name2 = name2Input.value;
        if (modeSelector.value == "Multiplayer" && name2 == "") {
            return alert("Missing player2's name!");
        }
        const pairAmount = Number.parseInt(pairInput.value);
        const cardManager = new CardManager(cardsContainer, pairAmount);
        overlay.style.display = "none";
        if (modeSelector.value == "Singleplayer")
            name2 = null;
        playerManager = new PlayerManager({}, name1Input.value, name2);
        const cards = cardManager.renderCards();
        cards.forEach((card) => {
            card.onclick = () => {
                //return cases
                if (inTimeout)
                    return;
                if (card.classList.contains("flipped"))
                    return;
                card.classList.add("flipped");
                if (!match) {
                    match = card;
                }
                else {
                    validateMatch(card);
                }
            };
        });
    };
    startButton.onclick = startGame;
};
