export interface Question {
  category: string;
  question: string;
  options: Array<string>;
  answer: number; // Index of the correct answer in the array
  difficulty: string;
}

export class QuestionModule {
  private questions: Array<Question> = [];
  //#region initial fetch-state info
  private isLoading = true;
  private isSuccess = false;
  private isError = false;
  //#endregion

  async QuestionModule() {
    this.fetchQuestions();
  }

  //#region fetching utility
  private fetchSuccess() {
    this.isLoading = false;
    this.isSuccess = true;
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
  //#endregion

  getQuestion(): Question {
    return this.questions[Math.random()];
  }
}
