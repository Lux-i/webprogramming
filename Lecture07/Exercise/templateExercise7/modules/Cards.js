import { shuffleArray } from "./Util.js";
const cardIcons = ["💯", "💸", "🤣", "💀", "🤮", "❤", "🎶", "🔥"];
export default class CardManager {
    /**
     * @param cardContainer The HTMLElement that should contain all the cards
     * @param pairAmount The desired amount of pairs the game should have
     */
    constructor(cardContainer, pairAmount) {
        /**
         * @returns The array of generated cards
         */
        this.renderCards = () => {
            //reset cardContainer
            this.cardContainer.innerHTML = "";
            //create icon array
            //a random selection of icons is made (important when pairAmount != 8)
            const usedIcons = shuffleArray([...cardIcons]).slice(0, this.pairAmount);
            //we then create a randomly shuffled array of the used icons times 2 (pairs)
            const shuffledArray = shuffleArray(usedIcons.concat(usedIcons));
            //create cards and append to container
            let cards = [];
            for (let i = 0; i < this.cardAmount; i++) {
                const newCard = document.createElement("Card");
                const cardText = document.createElement("p");
                cardText.innerHTML = shuffledArray[i];
                newCard.appendChild(cardText);
                this.cardContainer.appendChild(newCard);
                cards.push(newCard);
            }
            //return card array to assign onclick listener in main scope
            return cards;
        };
        if (pairAmount > cardIcons.length) {
            alert(`The amount of pairs will be set to the maximum of ${cardIcons.length},
        because your desired amount of ${pairAmount} pairs exceeds the implemented limit`);
            pairAmount = cardIcons.length;
        }
        this.cardContainer = cardContainer;
        this.pairAmount = pairAmount;
        this.cardAmount = pairAmount * 2;
    }
}
