import { Question } from "./questionModule.js";

export interface GroupedScore {
    totalPoints: number,
    points: number,
    byCategory: { [key: string]: { questions: number, questionsCorrect: number, points: number, totalPoints: number } },
    questionsCorrect: boolean[]
}

type ScoreStored = {
    [key: string]: { question: Question, selected: number, points: number, correct: boolean }[];
}

let scores: ScoreStored = {
}

export function scoreQuestion(question: Question, player: string, selected: number = -1): number {

    let points: number = question.difficulty + 1;
    let correct = selected === question.answer;

    (!scores[player]) ? scores[player] = [] : '';

    scores[player].push({ question: question, selected: selected, points: points, correct: correct });
    return points;
}


export function calculateFinalScore(player: string): GroupedScore | null {
    if (!scores[player]) {
        console.error("Player has no scores!");
        return null
    }

    let groupedScore: GroupedScore = { totalPoints: 0, points: 0, byCategory: {}, questionsCorrect: [] };

    scores[player].forEach(score => {
        groupedScore.totalPoints += score.points;

        (score.correct) ? groupedScore.points += score.points : "";
        groupedScore.questionsCorrect.push(score.correct);

        // idk if needed but checks regardlesss
        if (!groupedScore.byCategory[score.question.category]) {
            groupedScore.byCategory[score.question.category] = { questions: 0, questionsCorrect: 0, points: 0, totalPoints: 0 }
        }

        groupedScore.byCategory[score.question.category].totalPoints += score.points
        groupedScore.byCategory[score.question.category].questions++;

        if (score.correct) {
            groupedScore.byCategory[score.question.category].questionsCorrect++;
            groupedScore.byCategory[score.question.category].points += score.points;
        }
    });
    return groupedScore;
}

export function resetScores() {
    scores = {};
}