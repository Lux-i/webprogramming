const quizContainer = document.getElementById("quiz-container");
const inputContainer = document.getElementById("player-input");
const scoreContainer = document.getElementById("quiz-score");
const quizQuestionsContainer = document.getElementById("quiz-questions");
export function switchToQuiz() {
    quizContainer.style.display = "block";
    quizQuestionsContainer.style.display = "block";
    inputContainer.style.display = "none";
    scoreContainer.style.display = "none";
}
export function switchToInput() {
    quizContainer.style.display = "none";
    inputContainer.style.display = "block";
    scoreContainer.style.display = "none";
    quizQuestionsContainer.style.display = "none";
}
export function setCurrentQuestion(quest) {
    const button1 = document.getElementById("option-1");
    const button2 = document.getElementById("option-2");
    const button3 = document.getElementById("option-3");
    const button4 = document.getElementById("option-4");
    const category = document.getElementById("title-category");
    const question = document.getElementById("title-question");
    const difficulty = document.getElementById("title-difficulty");
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
    scoreContainer.style.display = "block";
    quizQuestionsContainer.style.display = "none";
}
export function generateScore(score) {
    let percent = document.getElementById("score-percent");
    percent.innerText = `${((score.points / score.totalPoints) * 100).toFixed(2)} % `;
    document.getElementById("total-collected-points").innerText = `${score.points}`;
    document.getElementById("max-points").innerText = `${score.totalPoints}`;
    const catContainer = document.getElementById("categories-container");
    catContainer.innerHTML = "";
    for (const key in score.byCategory) {
        let div = document.createElement("div");
        let cat = score.byCategory[key];
        div.innerHTML = `${key}: ${((cat.questionsCorrect / cat.questions) * 100).toFixed(2)}% (${cat.questionsCorrect}/${cat.questions}, ${cat.points} Points)`;
        catContainer.appendChild(div);
    }
    const questContainer = document.getElementById("questions-container");
    questContainer.innerHTML = "";
    let num = 1;
    score.questionsCorrect.forEach(element => {
        let div = document.createElement("div");
        div.innerHTML = `Question ${num} ${(element) ? "Correct" : "False"}`;
        questContainer.appendChild(div);
        num++;
    });
}
export function renderLeaderboard(board) {
    const leaderboard = document.getElementById("leaderboard-container");
    leaderboard.innerHTML = "";
    board.sort((a, b) => b.points - a.points);
    board.forEach(element => {
        let div = document.createElement("div");
        div.classList.add("card", "p-2", "my-2");
        div.innerHTML = `${element.name}: Points ${element.points} (${(element.percent * 100).toFixed(2)}%)`;
        leaderboard.appendChild(div);
    });
}
