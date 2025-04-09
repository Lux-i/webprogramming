interface Player {
  name: string;
  points: number;
  nextPlayer: Player;
}

export default class PlayerManager {
  private activePlayer: Player; //reference to the active Player object
  private player1: Player;
  private player2: Player | null;
  private leaderboardContainer: HTMLElement;

  //The first player (passed string) is always the starting player
  /**
   * @param leaderboard The HTMLElement which should contain the leaderboard data
   * @param name1 name of the first player
   * @param name2 name of the second player, or null if in singleplayer
   */
  constructor(leaderboard: HTMLElement, name1: string, name2: string | null) {
    //assign leaderboard element
    this.leaderboardContainer = leaderboard;

    //init first player with placeholder nextPlayer reference
    this.player1 = { name: name1, points: 0, nextPlayer: {} as Player };
    if (name2) {
      //if name for second player specified:
      //init second player
      this.player2 = { name: name2, points: 0, nextPlayer: this.player1 };
      //update nextPlayer reference of first player to the second one
      this.player1.nextPlayer = this.player2;
    } else {
      //if no second name specified (aka singlePlayer):
      //set second player as null
      this.player2 = null;
      //set first players nextPlayer reference to itself
      this.player1.nextPlayer = this.player1;
    }
    //set first player as active player
    this.activePlayer = this.player1;
  }

  switchPlayer = () => {
    //just update the activePlayer reference to the active players nextPlayer
    //also works for singleplayer because player1 is referencing itself in that case
    this.activePlayer = this.activePlayer.nextPlayer;
  };

  addPoint = () => {
    //finding a pair gives 1 point, so we just do ++
    this.activePlayer.points++;
  };

  updateLeaderboard = () => {
    //entire code could be optimized and expanded by generally storing a player array
    //this would theoretically allow a game of memory with an uncapped amount of players
    //but unnecessary for the current task

    //players array with one player
    const players: Player[] = [this.player1];
    //if second player is set (multiplayer), push second player
    if (this.player2) players.push(this.player2);

    //sorting players array based on points
    const sortedPlayers = players.sort((a, b) => b.points - a.points);

    //players array is mapped to an array of leaderboard-line strings
    //then we join with \n to generate one final string with newlines after every line
    this.leaderboardContainer.innerHTML = sortedPlayers
      .map(
        (player, index) =>
          `${index + 1}. ${player.name}: ${player.points} points`
      )
      .join("\n");
  };
}
