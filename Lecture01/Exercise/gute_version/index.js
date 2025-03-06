const game_window = document.getElementsByTagName("game");
const cards_container = document.getElementById("cards_container");
const tracker = document.getElementById("tracker");
const overlay = document.getElementById("overlay");
const restart_button = document.getElementById("restart");

const cardAmount = 16;
const cardIcons = ["💯", "💸", "🤣", "💀", "🤮", "❤", "🎶", "🔥"];

/**
 * @param {Array<String>} arr
 */
const shuffleArray = (arr) => {
  return arr.sort(() => {
    return Math.random() > 0.5;
  });
};

let shuffledArray = shuffleArray(cardIcons.concat(cardIcons));

let inTimeout = false;

const neededPairs = cardAmount / 2;
let pairsFound = 0;
let tries = 0;

// the first selected card of a selection pair
let match = null;

const validateMatch = (currentCard) => {
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

  for (i = 0; i < cardAmount; i++) {
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
  cards = Array.from(cards_container.children);
  for (i = 0; i < cardAmount; i++) {
    cards[i].classList.remove("flipped", "found");
    const cardText = cards[i].firstChild;
    cardText.innerHTML = shuffledArray[i];
  }
  overlay.style.display = "none";
  pairsFound = 0;
  tries = 0;
  tracker.innerHTML = `Pairs found: ${pairsFound} | Tries: ${tries}`;
};

renderCards();
