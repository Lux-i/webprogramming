import {
  scoreQuestion,
  calculateFinalScore,
  resetScores,
} from "./modules/scoringModule.js";
import { Question, QuestionModule } from "./modules/questionModule.js";
import {
  switchToInput,
  switchToQuiz,
  setCurrentQuestion,
  switchToScore,
  generateScore,
  renderLeaderboard,
} from "./modules/uiModule.js";
import { Leaderboard } from "./modules/leaderboardModule.js";

const startButton = document.getElementById(
  "start-game-button"
) as HTMLButtonElement;
let player = "";

const qm = new QuestionModule();

const leaderboard = new Leaderboard();

const leaderboardContainer = document.getElementById(
  "leaderboard-container"
) as HTMLElement;

leaderboard.onsuccess = () => {
  leaderboardContainer.innerHTML = "";

  leaderboard.getScores().then((res) => {
    renderLeaderboard(res!);
  });
};

qm.onsuccess = () => {
  startButton.disabled = false;
};

let questions: Question[];

let currentQuestion = 0;

(document.getElementById("new-game") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    player = "";
    currentQuestion = 0;

    resetScores();
    switchToInput();
  }
);

async function buttonNext() {
  currentQuestion++;

  if (currentQuestion > questions.length - 1) {
    switchToScore();

    let finalScore = calculateFinalScore(player);

    generateScore(finalScore!);

    await leaderboard.addScore(
      player,
      finalScore!.points,
      finalScore!.points / finalScore!.totalPoints
    );

    let tmp = await leaderboard.getScores();

    if (tmp === null) return;

    renderLeaderboard(tmp);
  } else {
    setCurrentQuestion(questions[currentQuestion]);
  }
}

(document.getElementById("option-1") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    scoreQuestion(questions[currentQuestion], player, 0);
    buttonNext();
  }
);

(document.getElementById("option-2") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    scoreQuestion(questions[currentQuestion], player, 1);
    buttonNext();
  }
);

(document.getElementById("option-3") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    scoreQuestion(questions[currentQuestion], player, 2);
    buttonNext();
  }
);

(document.getElementById("option-4") as HTMLButtonElement).addEventListener(
  "click",
  () => {
    scoreQuestion(questions[currentQuestion], player, 3);
    buttonNext();
  }
);

startButton.addEventListener("click", () => {
  const elem = document.getElementById("player-name") as HTMLInputElement;

  if (!qm.isReady()) {
    return alert("Loading Questions");
  }

  if (elem.value === "") {
    return alert("Please input name");
  }

  let arr = qm.getQuestions(5);
  if (arr !== null) {
    questions = arr;

    let diffs = [0, 0, 0];

    arr.forEach((element) => {
      diffs[element.difficulty]++;
    });

    console.log("Difficulty Balance: ");
    console.log(diffs);
  } else {
    return alert("Big ooopsie, too many questions :(");
  }

  player = elem.value;

  elem.value = "";
  switchToQuiz();

  setCurrentQuestion(questions[currentQuestion]);
});
