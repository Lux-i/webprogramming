import { Question } from "./questionModule.js";
import { calculateFinalScore, GroupedScore } from "./scoringModule.js";
import { LeaderboardScoreEntry } from "./leaderboardModule.js";

const quizContainer = document.getElementById("quiz-container") as HTMLElement;
const inputContainer = document.getElementById("player-input") as HTMLElement;
const scoreContainer = document.getElementById("quiz-score") as HTMLElement;
const quizQuestionsContainer = document.getElementById("quiz-questions") as HTMLElement;


export function switchToQuiz() {
    quizContainer.style.display = "block";
    quizQuestionsContainer.style.display = "block";
    inputContainer.style.display = "none";
    scoreContainer.style.display = "none"
}

export function switchToInput() {
    quizContainer.style.display = "none";
    inputContainer.style.display = "block";
    scoreContainer.style.display = "none"
    quizQuestionsContainer.style.display = "none";
}

export function setCurrentQuestion(quest: Question) {
    const button1 = document.getElementById("option-1") as HTMLButtonElement;
    const button2 = document.getElementById("option-2") as HTMLButtonElement;
    const button3 = document.getElementById("option-3") as HTMLButtonElement;
    const button4 = document.getElementById("option-4") as HTMLButtonElement;

    const category = document.getElementById("title-category") as HTMLButtonElement;
    const question = document.getElementById("title-question") as HTMLButtonElement;
    const difficulty = document.getElementById("title-difficulty") as HTMLButtonElement;

    button1.innerHTML = quest.options[0];
    button2.innerHTML = quest.options[1];
    button3.innerHTML = quest.options[2];
    button4.innerHTML = quest.options[3];

    category.innerHTML = quest.category;
    question.innerHTML = quest.question;
    difficulty.innerHTML = (quest.difficulty === 0) ? "Easy" : (quest.difficulty === 1) ? "Medium" : "Hard";
}

export function switchToScore() {
    quizContainer.style.display = "block";
    inputContainer.style.display = "none";
    scoreContainer.style.display = "block"
    quizQuestionsContainer.style.display = "none";
}

export function generateScore(score: GroupedScore) {
    let percent = document.getElementById("score-percent") as HTMLElement;

    percent.innerText = `${((score.points / score.totalPoints) * 100).toFixed(2)} % `;

    (document.getElementById("total-collected-points") as HTMLElement).innerText = `${score.points}`;
    (document.getElementById("max-points") as HTMLElement).innerText = `${score.totalPoints}`;

    const catContainer = document.getElementById("categories-container") as HTMLElement;

    catContainer.innerHTML = "";

    for (const key in score.byCategory) {

        let div = document.createElement("div");

        let cat = score.byCategory[key];
        div.innerHTML = `${key}: ${((cat.questionsCorrect / cat.questions) * 100).toFixed(2)}% (${cat.questionsCorrect}/${cat.questions}, ${cat.points} Points)`
        catContainer.appendChild(div);
    }

    const questContainer = document.getElementById("questions-container") as HTMLElement;

    questContainer.innerHTML = "";

    let num = 1;

    score.questionsCorrect.forEach(element => {
        let div = document.createElement("div");
        div.innerHTML = `Question ${num} ${(element) ? "Correct" : "False"}`;
        questContainer.appendChild(div);

        num++;
    });
}

export function renderLeaderboard(board: LeaderboardScoreEntry[]) {
    const leaderboard = document.getElementById("leaderboard-container") as HTMLElement;

    leaderboard.innerHTML = "";

    board.sort((a, b) => b.points - a.points)

    board.forEach(element => {
        let div = document.createElement("div");
        div.classList.add("card", "p-2", "my-2");

        div.innerHTML = `${element.name}: Points ${element.points} (${(element.percent * 100).toFixed(2)}%)`

        leaderboard.appendChild(div);
    });
}