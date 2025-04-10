export interface Question {
  category: string;
  question: string;
  options: Array<string>;
  answer: number; // Index of the correct answer in the array
  difficulty: number;
}

export class QuestionModule {
  private questions: Array<Question> = [];
  //#region initial fetch-state info
  private isLoading = true;
  private isSuccess = false;
  private isError = false;
  //#endregion
  onsuccess: Function = () => {};

  constructor() {
    this.fetchQuestions();
  }

  //#region fetching utility
  private fetchSuccess() {
    this.isLoading = false;
    this.isSuccess = true;
    this.onsuccess();
  }

  private fetchError(msg: string) {
    this.isLoading = false;
    this.isError = true;
    alert(msg);
  }

  private async fetchQuestions() {
    try {
      const response = await fetch("questions.json");
      if (!response) return this.fetchError("Could not load questions");
      const data: Array<Question> = await response.json();
      if (!data) return this.fetchError("Failed to convert from JSON");
      if (data.length == 0)
        return this.fetchError(
          "Retrieved empty array. Questions need to be stored first"
        );
      this.questions = data;
      return this.fetchSuccess();
    } catch (err) {
      console.log(err);
    }
  }

  isReady() {
    return this.isSuccess;
  }
  //#endregion

  /**
   * @param amount Amount of questions to return
   * @returns The given amount of questions, or null if the amount is invalid
   */
  getQuestions(amount: number): Question[] | null {
    let _length = this.questions.length;

    if (amount > _length || amount <= 0) return null;

    //assign copy after length check to avoid unnecessary execution time
    const questions = [...this.questions];
    const returnQuestions = new Array<Question>();
    const difficultyLevelAmount = 3;

    const threshold = amount / difficultyLevelAmount;

    //Array storing the amount of questions added per difficutly, with the difficulty as index
    const counts = new Array(difficultyLevelAmount);

    counts.fill(0);

    for (let i = 0; i < amount; i++) {
      let pushed = false;
      while (!pushed) {
        const index = Math.round(Math.random() * (_length - 1));
        const selected = questions[index];
        if (index < _length - 1) {
          questions[index] = questions[_length - 1];
          questions[_length - 1] = selected;
        }
        _length--;
        let difficulty = selected.difficulty;
        let pushable = false;
        if (difficulty === 2) {
          //ensures the threshold is always and only floored for questions with difficulty 2
          if (counts[difficulty] < Math.floor(threshold)) {
            pushable = true;
          }
        } else if (counts[difficulty] < threshold) {
          pushable = true;
        }
        if (pushable) {
          returnQuestions.push(selected);
          pushed = true;
          counts[difficulty]++;
        }
      }
    }
    return returnQuestions;
  }
}
