export interface LeaderboardScoreEntry {
  name: string;
  points: number;
  percent: number;
}

export class Leaderboard {
  private db: IDBDatabase | null; //DB connection
  onsuccess: Function = () => {};

  constructor() {
    this.db = null;
    const request = indexedDB.open("library");

    request.onupgradeneeded = () => {
      //set up db
      this.db = request.result;
      if (!this.db.objectStoreNames.contains("scores")) {
        this.db.createObjectStore("scores", { keyPath: "name" });
      }
    };

    request.onsuccess = () => {
      this.db = request.result;
      this.onsuccess();
    };

    request.onerror = (event) => {
      console.error(
        "Database failed to initialize:",
        (event.target as IDBOpenDBRequest).error
      );
    };
  }

  async addScore(name: string, points: number, percent: number) {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const tx = this.db.transaction("scores", "readwrite");
      const store = tx.objectStore("scores");

      const request = store.put({
        name: name,
        points: points,
        percent: percent,
      });

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(null);
      };
    });
  }

  async getScore(name: string): Promise<LeaderboardScoreEntry | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const tx = this.db.transaction("scores", "readonly");
      const store = tx.objectStore("scores");

      const request = store.get(name);

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(null);
      };
    });
  }

  async getScores(): Promise<LeaderboardScoreEntry[] | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      const tx = this.db.transaction("scores", "readonly");
      const store = tx.objectStore("scores");

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(null);
      };
    });
  }
}
